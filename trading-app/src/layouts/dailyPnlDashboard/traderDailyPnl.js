//import React from 'react'
import {useState, useContext, useEffect} from "react"
import TextField from '@mui/material/TextField';
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from '@mui/material/MenuItem';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import { Typography } from "@mui/material";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";

// Data
import TraderPNLData from './data/TraderDailyPnlData';
import Traders from '../users/data/UserData';
import { height } from "@mui/system";

const TraderDailypnldata = () => {

    
    const { columns, rows } = TraderPNLData();
    const [newrows, setNewRows] = useState([]);
    const [traders, setTraders] = useState([]);
    const [Data, setData] = useState([]);
    const [FDPNLData, setFDPNLData] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    const [firstDate, setFirstDate] = useState(valueInDate);
    let valueInTraderName = 'Praveen K'
    let [traderName, setTraderName] = useState(valueInTraderName);

    useEffect(()=>{

      axios.get(`${baseUrl}api/v1/datewisetraderpnl/${firstDate}/${traderName}`)
      .then((res)=>{
                //console.log("First Date PNL Data: "+res.data)
                setFDPNLData(JSON.parse(JSON.stringify(res.data)));
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
 

        axios.get(`${baseUrl}api/v1/traderdailypnldata/${firstDate}/${traderName}`)
        .then((res)=>{
                  //console.log("Data on first come: ",res.data)
                  setData(res.data);
                  setNewRows(JSON.parse(JSON.stringify(res.data)));
        }).catch((err)=>{
            window.alert("Error while fetching Trader PNL");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readuserdetails`)
        .then((res)=>{
          let data = res.data;
          let traderdata = data.filter((elem) => {
            return elem.designation === "Equity Trader"
        })
                  setTraders(traderdata);
        }).catch((err)=>{
            window.alert("Error Fetching Trader Details");
            return new Error(err);
        })
    },[firstDate,traderName])

   
    console.log("FD PNL Data Update: ",FDPNLData)

    let pnlvalue = [];

    Data?.map((elem1)=>{
      let pnldata = {}
      pnlvalue.push(elem1.pnl);
      // console.log("Keys: "+elem1.keys());
      const gpnlcolor = (elem1.pnl) >= 0 ? "success" : "error"

      // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
        pnldata.trader = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem1._id.traderName}
            </MDTypography>
        );
        pnldata._id = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem1._id.date}
          </MDTypography>
        );
        pnldata.pnl = (
          <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
            {(elem1.pnl) >= 0.00 ? "+₹" + ((elem1.pnl).toFixed(0)): "-₹" + ((-(elem1.pnl)).toFixed(0))}
          </MDTypography>
        );
      pnldata.trades = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem1.trades}
        </MDTypography>
      );
     
      
      //console.log(typeof(pnldata));
      //console.log(pnldata)
      rows.push((pnldata))
      //setNewRows(rows);
    })
    let maxPnlValue = 0;
    let minPnlValue = 0;
    let maxPnlValuecolor = "dark";
    let minPnlValuecolor = "dark";
    if(pnlvalue.length !== 0){
    maxPnlValue = pnlvalue?.reduce(function(a, b) {
      return Math.max(a, b);
    });
    maxPnlValuecolor = maxPnlValue >= 0 ? "success" : "error"

    minPnlValue = pnlvalue?.reduce(function(a, b) {
      return Math.min(a, b);
    });
    minPnlValuecolor = minPnlValue >= 0 ? "success" : "error"
    }
   


    let graphx = [];
    let graphy = []

    Data?.map((elem)=>{
        //console.log("Element: ",elem)
        //console.log(elem._id.date)
        //graphy.push(elem._id.date.split(" ")[1].slice(0,5))
        graphy.push(elem._id.date)
        graphx.push((elem.pnl).toFixed(0))
    })

    //console.log("Values: "+graphx);
    //console.log("Labels: "+graphy);

    function startDate(e){
        e.preventDefault();
        setFirstDate(e.target.value)
        //console.log(e.target.value)
        //console.log(`${baseUrl}api/v1/dailypnldata/${e.target.value}`)
        axios.get(`${baseUrl}api/v1/traderdailypnldata/${e.target.value}`)
        .then((res)=>{
                  setData(res.data);
            // Getting row wise data
            Data?.map((elem1)=>{
                let pnldata = {}
                //console.log("Keys: "+elem1.keys());
                const gpnlcolor = (elem1.pnl) >= 0 ? "success" : "error"

                // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
                pnldata.trader = (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                      {elem1._id.traderName}
                    </MDTypography>
                  );
                pnldata._id = (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                      {elem1._id.date}
                    </MDTypography>
                  );
                  pnldata.pnl = (
                    <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
                        {(elem1.pnl) >= 0.00 ? "+₹" + ((elem1.pnl).toFixed(0)): "-₹" + ((-(elem1.pnl)).toFixed(0))}
                    </MDTypography>
                  );
                pnldata.trades = (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {elem1.trades}
                  </MDTypography>
                );
               
                
                console.log(typeof(pnldata));
                console.log(pnldata)
                rows.push(JSON.stringify(pnldata))
                //setNewRows(rows);
              })
              //console.log(newrows);

            // Code Ends

        }).catch((err)=>{
            // //window.alert("Server Down");
            return new Error(err);
        })
    }

    function TraderName(e){
        e.preventDefault();
        console.log("Changed Trader Name: ",e.target.value)
        setTraderName(e.target.value)
      }
    //console.log("Rows: "+rows);
    //console.log("FD PNL Data: "+FDPNLData[0]);
    const gpnlcolor = -(FDPNLData[0]?.amount) >= 0 ? "success" : "error"
    const npnlcolor = ((-FDPNLData[0]?.amount) - FDPNLData[0]?.brokerage)  >= 0 ? "success" : "error"
    
    return (
        <>
        <MDBox mt={2} mb={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} >
            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Select Trade Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
                <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Trader</Typography>
                </MDBox>
                <TextField
                id="outlined-basic"
                select
                label=""
                defaultValue="Praveen K"
                minHeight="4em"
                //helperText="Please select the body condition"
                variant="outlined"
                sx={{margin: 1, padding: 1, width: "200px"}}
                onChange={(e)=>{TraderName(e)}}
              >
                {traders.map((option) => (
                  <MenuItem key={option.name} value={option.name} minHeight="4em">
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} xl={12} >
            <Card sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', marginTop: 1 }}>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={gpnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{FDPNLData[0] ? (-FDPNLData[0].amount >= 0 ? "+₹" + (-FDPNLData[0].amount).toFixed(0) : "-₹" + (FDPNLData[0].amount).toFixed(0)) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Brokerage</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>₹{FDPNLData[0] ? (FDPNLData[0].brokerage).toFixed(0) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Net P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" color={npnlcolor} py={1}>{FDPNLData[0] ? (((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)) >= 0 ? "+₹" + ((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)).toFixed(0) : "-₹" + -((-FDPNLData[0].amount)-(FDPNLData[0].brokerage)).toFixed(0)) : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Total Trades</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{FDPNLData[0] ? FDPNLData[0].trades : 0}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Max Gross P&L</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={maxPnlValuecolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{maxPnlValue >= 0 ? "+₹" + maxPnlValue.toFixed(0) : "-₹" + (-maxPnlValue).toFixed(0)}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Min Gross P&L</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={minPnlValuecolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{minPnlValue >= 0 ? "+₹" + minPnlValue.toFixed(0) : "-₹" + (-minPnlValue).toFixed(0)}</MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

            <MDBox mb={1} pt={1}> 
                <ReportsLineChart
                  color="warning"
                  colorheight="25rem"
                  title="Gross P&L - 1 Minute Timeframe (Mock)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: graphy,
                      datasets: { label: "Gross P&L", data: graphx },
                    }
                  }
                />
              </MDBox>

            <MDBox pt={5} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={2.5}>
                                   P&L Data - 1 Minute Timeframe (Mock)
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    )
}

export default TraderDailypnldata