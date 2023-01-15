//import React from 'react'
import {useState, useContext, useEffect} from "react"
import TextField from '@mui/material/TextField';
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import { Typography } from "@mui/material";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";

// Data
import PNLData from './data/DailyPnlData';



const Dailypnldata = () => {

    
    const { columns, rows } = PNLData();
    const [newrows, setNewRows] = useState([]);
    const [Data, setData] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    const [firstDate, setFirstDate] = useState(valueInDate);

    useEffect(()=>{

        axios.get(`${baseUrl}api/v1/dailypnldata/${firstDate}`)
        .then((res)=>{
                  setData(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[])
  
    console.log(Data);

    let graphx = [];
    let graphy = []

    rows.map((elem)=>{
        graphy.push(elem.timestamp.props.children.split(" ")[1].slice(0,5))
        graphx.push(elem.gpnl.props.children)
    })

    console.log("Values: "+graphx);
    console.log("Labels: "+graphy);

    function startDate(e){
        e.preventDefault();
        setFirstDate(e.target.value)
        console.log(e.target.value)
        console.log(`${baseUrl}api/v1/dailypnldata/${e.target.value}`)
        axios.get(`${baseUrl}api/v1/dailypnldata/${e.target.value}`)
        .then((res)=>{
                  setData(res.data);
            // Getting row wise data
            (res.data).map((elem)=>{
                let pnldata = {}
                // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
                  pnldata.timestamp = (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                      {elem._id}
                    </MDTypography>
                  );
                  pnldata.gpnl = (
                    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                      {elem.pnl.toFixed(0)}
                    </MDTypography>
                  );
                  pnldata.traders = (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {elem.traders}
                  </MDTypography>
                );
                pnldata.trades = (
                  <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                    {elem.trades}
                  </MDTypography>
                );
               
                
                console.log(typeof(pnldata));
                console.log(pnldata)
                rows.push(JSON.parse(JSON.stringify(pnldata)))
                setNewRows(rows);
              })
              console.log(newrows);

            // Code Ends

        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    }
    console.log("Rows: "+rows);
    
    return (
        <>
        <Grid item xs={12} md={12} lg={12} mt={3} >
            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Select Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
            </Card>
          </Grid>

            <MDBox mb={3} pt={6}> 
                <ReportsLineChart
                  color="warning"
                  colorheight="25rem"
                  title="This month's daily net p&l (Mock)"
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

            <MDBox pt={6} pb={3}>
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
                                   Daily P&L Data
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows:newrows }}
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

export default Dailypnldata