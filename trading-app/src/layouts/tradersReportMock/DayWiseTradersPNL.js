import React, { useRef } from "react";
import jsPDF from "jspdf";
import HeatMap from "react-heatmap-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { Typography } from "@mui/material";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {useState, useContext, useEffect} from "react"
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Icon from "@mui/material/Icon";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";

function DayWiseTraderPNL() {

// Display only even labels
const [selectedWeek, setSelectedWeek] = useState(1);
const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
let date = new Date();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
let valueInDate2 = Number(10)
let valueInDate1 = Number(1)
const [startDay, setStartDay] = useState(1);
const [endDay, setEndDay] = useState(10);
const [tradersPNLData, setTradersPNLData] = useState([]);
const [totalDays, setTotalDays] = useState([]);
const [uweeks1, setUWeeks1] = useState([]);
let [overallPnl, setOverallPnl] = useState([]);


useEffect(()=>{
    pnlCalculation(valueInDate1,valueInDate2)
      overallPnl = 0;
      axios.get(`${baseUrl}api/v1/getDayWiseTradersTradeDetails/${valueInDate1}/${valueInDate2}`)
        .then((res)=>{
                  console.log(res.data);
                  setTradersPNLData(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Day Wise PNL Details");
            return new Error(err);
        })
  },[])

  function pnlCalculation(startDay, endDay){
    console.log(Number(startDay), Number(endDay))
    axios.get(`${baseUrl}api/v1/getDayWiseTradersTradeDetails/${Number(startDay)}/${Number(endDay)}`)
        .then((res)=>{
                  console.log(res.data);
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
    pnlCalculation(e.target.value, endDay)
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
    pnlCalculation(startDay, e.target.value)
    overallPnl = 0;
    //console.log(e.target.value);
  }


let traderNameList = []
let traderNameBatchList = []
tradersPNLData?.map((elem)=>{
    traderNameList.push(elem.trader_name)
    traderNameBatchList.push(elem.trader_name + " {" + elem.cohort + "}")
})

traderNameList.push("Total")

let daysdataarray = []
tradersPNLData?.map((elem)=>{
    elem.pnl_by_day.map((e)=>{
        daysdataarray.push(e.serial_number)
    })
    
})

console.log(daysdataarray);

let xlabelvis = Math?.max(...daysdataarray)
console.log("XLabel Visibility: ",xlabelvis)

let xlabelnumber = []
for(let i = 1; i <= xlabelvis; i++)
{
    console.log(i)
    xlabelnumber.push(i);
    console.log(xlabelnumber);
}

xlabelnumber.push("Total")

console.log("Total Serial Numbers: ",daysdataarray)

console.log("XLabel Numbers: ",xlabelnumber);


let pnldata = []
tradersPNLData?.map((elem)=>{
    pnldata.push([elem.pnl_by_day.day,elem.trader_name])
})
console.log(pnldata)

const xLabelsVisibility = xlabelnumber;

const yLabels = traderNameBatchList
const xLabels = xlabelnumber;
console.log(xLabels)



let rows = traderNameList.length;
let cols = xLabels.length;
let data = new Array(rows);



for (let i = 0; i < rows; i++) {
  data[i] = new Array(cols);
}


let totalArray = [];
for (let i = 0; i < rows; i++) {
  
    let npnlsum = 0;
    
    for (let j = 0; j < cols; j++) {
      
      data[i][j] = tradersPNLData
      ?.filter((e) => {
        let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})
        // console.log("Filtered Data: ",tradersPNLData[i]?.trader_name,filterData[0]?.npnl,npnlsum);
        // console.log(i,j,xlabelnumber[j]-1, indexofDay, traderNameList[i], e.trader_name,e.pnl_by_day[j]?.npnl)
        return xlabelnumber[j] == filterData[0]?.serial_number && traderNameList[i] == e.trader_name;
        
      })
      ?.map((e) =>{
      let filterData = e.pnl_by_day?.filter((k) => {return k.serial_number - 1 == j})

      npnlsum += filterData[0]?.npnl ? filterData[0]?.npnl : 0
     
      return e.pnl_by_day[j]?.npnl})   
    }

    data[i][cols-1] = tradersPNLData[i]?.npnlsum
    totalArray.push(tradersPNLData[i]?.npnlsum);
}
console.log(totalArray)
let totalArraySum = 0
for(let i = 0; i < totalArray.length-1; i++)
{
    totalArraySum += totalArray[i]
}
data[rows-1][cols-1] = totalArraySum

let labelsforcharts = xlabelnumber.filter((e)=>{
    return e !== 'Total'
})


//export default function() {
  return (
    <>
    <MDBox mt={2} mb={3} fontSize={13}>
    <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>Trader Side Day Wise (Mock-Net P&L)</Typography>
              </MDBox>
              <MDBox >
                <Typography sx={{ margin: 2, padding: 1, fontSize: 15,fontWeight:600,backgroundColor:"#f0f2f5", borderRadius:2 }}>Start Day</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="number"
                sx={{ margin: 1.5, padding: 1, width:50 }} onChange={(e)=>{startDay1(e)}} value={startDay}/>
           
              <MDBox >
                <Typography color="dark" sx={{ margin: 2, padding: 1, fontSize: 15,fontWeight:600,backgroundColor:"#f0f2f5", borderRadius:2 }}>End Day</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="number"
                sx={{ margin: 1.5, padding: 1, width:50 }} onChange={(e)=>{endDay1(e)}} value={endDay}/>
              <MDBox >
              <MDButton variant="contained" color="info" sx={{margin: 1, marginLeft: 10, padding: 1 }} onClick="">Download PDF</MDButton>
              </MDBox>
            </Card>
      <MDBox mt={2} mb={3} fontSize={13} style={{ backgroundColor: '#FFF0AA' }}>
      <MDBox fontSize={20} mb={2} display="flex" justifyContent="center" style={{ backgroundColor: 'lightblue' }}>Trader Side Day Wise Net P&L</MDBox>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation={"top"}
        xLabelsVisibility={xLabelsVisibility}
        xLabelWidth={100}
        yLabelWidth={150}
        data={data}
        rectangles
        height={40}
        width={50}
        onClick={(x, y) => alert(`${xlabelnumber[x]}` + " P&L for " + `${traderNameList[y]} is ${data[y][x] > 0 ? "+₹" +data[y][x] : data[y][x] == 0 ? "₹"+0 : "-₹"+(-data[y][x])}`)}
        cellStyle={(background,value, min, max, data, x, y) => ({
          //background: `rgb(0, 255, 0, ${1 - (max - value) / (max - min)}`,
          background: `${value > 0 ? `rgb(0, 255, 0, ${1 - (max - value) / (max - min)})` : value == 0 ? "rgb(255, 255, 0)" :`rgb(255, 0, 0, ${1 - (max - (-value)) / (max - min)})`}`,
          fontSize: "12px",
          color: "white",
        })}
        cellRender={value => value && <MDBox>{value > 0 ? "+₹"+value.toLocaleString() : value == 0 ? "₹0" : "-₹"+(-value).toLocaleString()}</MDBox>}
        //ref={heatmapRef}
      />
    </MDBox>
    </MDBox>
    {/* <MDBox>
    {   
    data?.map((chartData, index) => ( 
            <Grid item xs={12} md={3} lg={12} mt={5} key={index}>
                <MDBox mb={1}>
                <ReportsLineChart
                    color="success"
                    colorheight={"25rem"}
                    title="Trader Daywise P&L"
                    description={
                    <>
                        {traderNameList[index]}
                    </>
                    }
                    date="updated yesterday"
                    chart={{
                    labels: labelsforcharts,
                    datasets: { label: "Net P&L", data: chartData[index] },
                    }}
                />
                </MDBox>
            </Grid>
            ))}
           


    </MDBox> */}
    </>
  );
}
export default DayWiseTraderPNL;
