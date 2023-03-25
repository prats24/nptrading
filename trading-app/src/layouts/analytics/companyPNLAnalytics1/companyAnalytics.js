import React, { useRef, Component } from "react";
import jsPDF from "jspdf";
import HeatMap from "react-heatmap-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import { Typography } from "@mui/material";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {useState, useContext, useEffect} from "react"
import Chart from 'react-google-charts'
import MockCompanyPNLTWiseData from "./data/pnldata";
import MDTypography from "../../../components/MDTypography";

function DayWiseTraderPNL() {

// Display only even labels
const [traderName, setTraderName] = useState('Total');
const { columnsdata, rowsdata } = MockCompanyPNLTWiseData();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let valueInDate2 = Number(10)
let valueInDate1 = Number(1)
const [startDay, setStartDay] = useState(1);
const [endDay, setEndDay] = useState(10);
const [tradersPNLData, setTradersPNLData] = useState([]);
const [traders, setTraders] = useState([]);
let [overallPnl, setOverallPnl] = useState([]);


useEffect(()=>{
    pnlCalculation(valueInDate1,valueInDate2,traderName)
      overallPnl = 0;
      axios.get(`${baseUrl}api/v1/getDayWiseTradersTradeDetailsCompanySide/${valueInDate1}/${valueInDate2}/${traderName}`)
        .then((res)=>{
                  // console.log(res.data);
                  setTradersPNLData(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Day Wise PNL Details");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readuserdetails`)
        .then((res)=>{
          let data = res.data;
          let traderdata = data.filter((elem) => {
            return elem.designation === "Equity Trader"
        })
                  let obj = {}
                  obj.name = 'Total';
                  traderdata.unshift(obj)
                  setTraders(traderdata);
        }).catch((err)=>{
            window.alert("Error Fetching Trader Details");
            return new Error(err);
        })
  // },[startDay,endDay,traderName])
},[])


  function pnlCalculation(startDay, endDay, traderName){
    // console.log(Number(startDay), Number(endDay), traderName)
    axios.get(`${baseUrl}api/v1/getDayWiseTradersTradeDetailsCompanySide/${Number(startDay)}/${Number(endDay)}/${traderName}`)
        .then((res)=>{
                  // console.log(res.data);
                  setTradersPNLData(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Day Wise PNL Details");
            return new Error(err);
    }).catch((err) => {
        return new Error(err);
    })
  }

  function startDay1(e){
    e.preventDefault();
    if(e.target.value > endDay){
      window.alert("Please select a valid range");
      return;
    }
    setStartDay(e.target.value)
    pnlCalculation(e.target.value, endDay,traderName)
    overallPnl = 0;
    //console.log(e.target.value);
  }
  function endDay1(e){
    e.preventDefault();
    if(e.target.value < startDay){
      window.alert("Please select a valid range");
      return;
    }
    setEndDay(e.target.value)
    pnlCalculation(startDay, e.target.value,traderName)
    overallPnl = 0;
    //console.log(e.target.value);
  }

  function TraderName(e){
    e.preventDefault();
    setTraderName(e.target.value)
    // console.log("Changed Trader Name: ",e.target.value)
    pnlCalculation(startDay, endDay,e.target.value)
    overallPnl = 0;
  }


let daysdataarray = []
tradersPNLData?.map((elem)=>{
    elem.pnl_by_day.map((e)=>{
        daysdataarray.push(e.serial_number)
    })
    
})

// console.log(daysdataarray);

let xlabelvis = Math?.max(...daysdataarray)
// console.log("XLabel Visibility: ",xlabelvis)

let xlabelnumber = []
for(let i = 1; i <= xlabelvis; i++)
{
    // console.log(i)
    xlabelnumber.push(i);
    // console.log(xlabelnumber);
}


// console.log("XLabel Numbers: ",xlabelnumber);


let pnldata = []
tradersPNLData?.map((elem)=>{
    pnldata.push([elem.pnl_by_day.day,elem.trader_name])
})
// console.log(pnldata)

const xLabelsVisibility = xlabelnumber;

const yLabels = ['Gross P&L','Brokerage','Net P&L','# of Trades','Zerodha(Cost)', 'Zerodha(GST)', 'Zerodha(Total)','Exchange(Cost)']
// console.log(yLabels)
const xLabels = xlabelnumber;
// console.log(xLabels)



let rows = yLabels.length;
let cols = xLabels.length;
let data = new Array(rows);



for (let i = 0; i < rows; i++) {
  data[i] = new Array(cols);
}


if(tradersPNLData) {
    for (let j = 0; j < cols; j++) {
      
      data[0][j] = tradersPNLData
      ?.filter((e) => {
        let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
        return xlabelnumber[j] == filterData[0]?.serial_number 
        
      })
      ?.map((e) =>{
      let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
     
      return e.pnl_by_day[j]?.gpnl})   
    }

    for (let j = 0; j < cols; j++) {
    data[1][j] = tradersPNLData
      ?.filter((e) => {
        let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
        return xlabelnumber[j] == filterData[0]?.serial_number 
        
      })
      ?.map((e) =>{
      let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
     
      return (e.pnl_by_day[j]?.brokerage)?.toFixed(0)})   
    }

    for (let j = 0; j < cols; j++) {
      data[2][j] = tradersPNLData
        ?.filter((e) => {
          let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
          return xlabelnumber[j] == filterData[0]?.serial_number 
          
        })
        ?.map((e) =>{
        let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
       
        return (e.pnl_by_day[j]?.npnl)?.toFixed(0)})   
      }

      for (let j = 0; j < cols; j++) {
        data[3][j] = tradersPNLData
          ?.filter((e) => {
            let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
            return xlabelnumber[j] == filterData[0]?.serial_number 
            
          })
          ?.map((e) =>{
          let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
         
          return (e.pnl_by_day[j]?.trades)?.toFixed(0)})   
        }
      
        for (let j = 0; j < cols; j++) {
          data[4][j] = tradersPNLData
            ?.filter((e) => {
              let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
              return xlabelnumber[j] == filterData[0]?.serial_number 
              
            })
            ?.map((e) =>{
            let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
           
            return ((e.pnl_by_day[j]?.trades*20))?.toFixed(0)})   
          }

          for (let j = 0; j < cols; j++) {
            data[5][j] = tradersPNLData
              ?.filter((e) => {
                let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
                return xlabelnumber[j] == filterData[0]?.serial_number 
                
              })
              ?.map((e) =>{
              let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
             
              return ((e.pnl_by_day[j]?.trades*20*0.18))?.toFixed(0)})   
            }
          
            for (let j = 0; j < cols; j++) {
              data[6][j] = tradersPNLData
                ?.filter((e) => {
                  let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
                  return xlabelnumber[j] == filterData[0]?.serial_number 
                  
                })
                ?.map((e) =>{
                let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
               
                return ((e.pnl_by_day[j]?.trades*20*0.18 + e.pnl_by_day[j]?.trades*20))?.toFixed(0)})   
              }

              for (let j = 0; j < cols; j++) {
                data[7][j] = tradersPNLData
                  ?.filter((e) => {
                    let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
                    return xlabelnumber[j] == filterData[0]?.serial_number 
                    
                  })
                  ?.map((e) =>{
                  let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
                 
                  return ((e.pnl_by_day[j]?.brokerage-(e.pnl_by_day[j]?.trades*20*0.18 + e.pnl_by_day[j]?.trades*20)))?.toFixed(0)})   
                }

      }

      const series1 = [];
      const yValue = [];
      tradersPNLData.map((e)=>{
        e.pnl_by_day.map((elem)=>{
          yValue.push(elem.gpnl)
        })
      });
      function chartLoad() {
          let i;
          let j = 0;
          for (i = 1; i <= xlabelvis; i++) {
              series1.push({ x: i, y: yValue[j] });
              j++;
          }
      }
      const primaryxAxis = { title: 'Day', interval:3 ,majorGridLines: { width: 1 } };
      const primaryyAxis = {
          title: 'Gross P&L', interval: 100000,
          lineStyle: { width: 0 }, majorTickLines: { width: 10 }
      };
      const tooltip = { enable: true };
      const chartarea = { border: { width: 0 } };
      const marker = { visible: true };
      chartLoad();  

      console.log(tradersPNLData)
      const TrendData = []
      TrendData.push(['day','gpnl'])
      tradersPNLData.map((e)=>{
        e.pnl_by_day.map((elem)=>{
          TrendData.push([elem.serial_number,elem.gpnl])
        })
      });
      console.log(TrendData)

      const TrendOptions = {
        title: 'Day wise gross p&l chart of traders',
        hAxis: { title: 'Day' },
        vAxis: { title: 'Gross P&L' },
        legend: 'none',
        trendlines: { 0: {} },
      }

      const TrendData1 = [
        ['Diameter', 'Age'],
        [8, 37],
        [4, 19.5],
        [11, 52],
        [4, 22],
        [3, 16.5],
        [6.5, 32.8],
        [14, 72],
      ]
      console.log(TrendData1)
      console.log(traders)

      

      // tradersPNLData?.map((e)=>{
      //   e.pnl_by_day.map((elem)=>{
      //   let tpnl = {}
      //   const gpnlcolor = (elem.gpnl) >= 0 ? "success" : "error"
      //   //const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
      //   const npnlcolor = (elem.npnl) >= 0 ? "success" : "error"
    
      //   tpnl.trader = (
      //     <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      //       {elem._id}
      //     </MDTypography>
      //   );
      //   tpnl.gpnl = (
      //       <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
      //         {(elem.gpnl) >= 0 ? "+₹" + (elem.gpnl).toFixed(0) : "-₹" + (-elem.gpnl).toFixed(0)}
      //       </MDTypography>
      //     );
      //   tpnl.brokerage = (
      //     <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      //       ₹{(elem.brokerage).toFixed(0)}
      //     </MDTypography>
      //   );
      //   tpnl.npnl = (
      //     <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
      //       {(elem.npnl) >= 0 ? "+₹" + (elem.npnl).toFixed(0) : "-₹" + (-elem.npnl).toFixed(0)}
      //     </MDTypography>
      //   );
      //   tpnl.trades = (
      //     <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      //       {elem.trades}
      //     </MDTypography>
      //   );
    
      //   rows.push(tpnl)
      //   })
    
      //   })

//export default function() {
  return (
    <>
    <MDBox mt={2} mb={3} fontSize={13}>
    <Card xs={12} md={6} lg={12}  sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
      <Grid container spacing={0} mb={2}>

        <Grid item xs={12} md={6} lg={8}>
          <Typography 
            sx={{ margin: 2, textAlign:"center" ,marginRight:2, alignItems:"center", backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>
              Company Side Day Wise (Mock-P&L)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={2}>
          <Typography 
            sx={{ margin: 2, textAlign:"center" ,marginRight:2, alignItems:"center", backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>
              Trader Name
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={1}>
          <Typography 
            sx={{ margin: 2, textAlign:"center" ,marginRight:2, alignItems:"center", backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>
              Start Day
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={1}>
          <Typography 
            sx={{ margin: 2, textAlign:"center" ,marginRight:2, alignItems:"center", backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>
              End day
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={2} 
          sx={{textAlign:"center", alignItems:"center"}}
          >
         Gross P&L : {(tradersPNLData[0]?.gpnlsum)?.toFixed(0)}
        </Grid>

        <Grid item xs={12} md={6} lg={2} 
          sx={{textAlign:"center", alignItems:"center"}}
          >
         Brokerage : {(tradersPNLData[0]?.brokeragesum)?.toFixed(0)}
        </Grid>

        <Grid item xs={12} md={6} lg={2} 
          sx={{textAlign:"center", alignItems:"center"}}
          >
         Net P&L : {(tradersPNLData[0]?.npnlsum)?.toFixed(0)}
        </Grid>

        <Grid item xs={12} md={6} lg={2} 
          sx={{textAlign:"center", alignItems:"center"}}
          >
         #Trades : {(tradersPNLData[0]?.tradessum)?.toFixed(0)}
        </Grid>

        <Grid item xs={12} md={6} lg={2} pr={2} pl={2}>
            <TextField
                id="outlined-basic"
                select
                label=""
                fullWidth
                defaultValue="Praveen K"
                // minHeight="4em"
                //helperText="Please select the body condition"
                variant="outlined"
                // sx={{marginLeft: 1.5, marginRight:10, padding: 1}}
                onChange={(e)=>{TraderName(e)}}
              >
                {traders.map((option) => (
                  <MenuItem key={option} value={option.name} minHeight="4em">
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
        </Grid>
      
        <Grid item xs={12} md={6} lg={1} pr={5} pl={5}>
            <TextField
                id="outlined-basic" variant="standard" type="number" fullWidth
                sx={{ marginRight:2}} onChange={(e)=>{startDay1(e)}} value={startDay}/>
        </Grid>

        <Grid item xs={12} md={6} lg={1} pr={5} pl={5}>
             <TextField
                id="outlined-basic" variant="standard" type="number" fullWidth
                sx={{ marginRight: 2}} onChange={(e)=>{endDay1(e)}} value={endDay}/>

        </Grid>
      </Grid>
      </Card>

    <Card xs={12} md={6} lg={12} style={{marginTop:12}}  sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>

    <Grid item xs={12} md={6} lg={12}>
        <Chart
          // width={'600px'}
          height={'550px'}
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={TrendData}
          options={TrendOptions}
          rootProps={{ 'data-testid': '1' }}
        />
    </Grid>

    </Card>
    </MDBox>
    </>
  );
}
export default DayWiseTraderPNL;