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

function BatchWiseTradersHeatMap() {

// Display only even labels
let date = new Date();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
let valueInDate2 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
let valueInDate1 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
const [firstDate, setFirstDate] = useState(valueInDate1);
const [secondDate, setSecondDate] = useState(valueInDate2);
const [batchData, setBatchData] = useState([]);
const [udates, setUDates] = useState([]);
let [overallPnl, setOverallPnl] = useState([]);


useEffect(()=>{

      axios.get(`${baseUrl}api/v1/batchwisepnl`)
        .then((res)=>{
          let data = res.data;

        setBatchData(data);
        }).catch((err)=>{
            return new Error(err);
        })
  },[])


  let uniqueBatches = new Set(batchData.map((obj) =>{
    if(String(obj._id.BatchWeek).length === 1){
      return Number(String(obj._id.BatchYear)+String("0"+obj._id.BatchWeek))
    } else{
      return Number(String(obj._id.BatchYear)+String(obj._id.BatchWeek))
    }
    
  }))
  uniqueBatches = ([...uniqueBatches]) // prints an array of unique Batch numbers

  let uniqueWeeks = new Set(batchData.map(obj => (String(obj._id.Year)+"-"+String(obj._id.WeekNumber))));
  // console.log("uniqueBatches", uniqueBatches)
  uniqueWeeks = ([...uniqueWeeks]);

  uniqueBatches.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
  });

  uniqueWeeks.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
  });

  console.log("uniqueBatches", uniqueWeeks)



// let uniqueBatches = []
// batchData.map((elem)=>{
//     uniqueBatches.push(elem.name)
// })

let pnldates = []
udates.map((elem)=>{
    const dateString = elem._id.date;
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    console.log(formattedDate); // Output: "Jan 1"
    pnldates.push([elem._id.date,formattedDate])
})
console.log(pnldates);
let pnldata = []
overallPnl.map((elem)=>{
    pnldata.push([elem._id.date,elem.amount])
})
console.log(pnldata)


let yLabels = uniqueBatches
let xLabels = uniqueWeeks;

let yLabelsTemp = new Set(batchData.map((obj) =>{
  if(String(obj._id.BatchWeek).length === 1){
    return `Batch#${Number(String(obj._id.BatchYear)+String("0"+obj._id.BatchWeek))}`
  } else{
    return `Batch#${Number(String(obj._id.BatchYear)+String(obj._id.BatchWeek))}` 
  }
  
}))
yLabelsTemp = ([...yLabelsTemp]) // prints an array of unique Batch numbers

let yLabelTempArray = []
if(yLabelsTemp.length != 0){
for(let i = 0; i < yLabelsTemp.length; i++)
{
  yLabelTempArray.push("Batch# " + "" + (i+1));
}
}

let xLabelsTemp = new Set(batchData.map((obj) => {
  if(String(obj._id.WeekNumber).length === 1){
    return `Week#${String("0"+obj._id.WeekNumber)+"-"+String(obj._id.Year)}`
  } else{
    return `Week#${String(obj._id.WeekNumber)+"-"+String(obj._id.Year)}`
  }
}))
// console.log("uniqueBatches", uniqueBatches)
xLabelsTemp = ([...xLabelsTemp])
const xLabelsVisibility = xLabelsTemp;

// yLabels = yLabels.map((elem)=>{
//   return `Batch#(${elem})`
// })
// for (let i = 0; i < pnldates.length; i++) {
//     console.log(pnldates[i][1]);
//     xLabels.push(pnldates[i][1])
// }

// const pnldates1 = [];
// for (let i = 0; i < pnldates.length; i++) {
//     console.log(pnldates[i][0]);
//     pnldates1.push(pnldates[i][0])
// }

let rows = uniqueBatches.length;
let cols = uniqueWeeks.length;
let data = new Array(rows);

for (let i = 0; i < rows; i++) {
  data[i] = new Array(cols);
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      data[i][j] = batchData
      .filter((e) => {
        if(String(e._id.BatchWeek).length === 1) {e._id.BatchWeek = "0"+e._id.BatchWeek}
        return uniqueBatches[i] == Number(String(e._id.BatchYear)+String(e._id.BatchWeek)) && xLabels[j] == (String(e._id.Year)+"-"+String(e._id.WeekNumber));
      }).map((e) => e._id.gpnl.toFixed(0));
      
    }
}

console.log("data, xLabels", data, xLabels)
  // 



//export default function() {
  return (
    
    <MDBox mt={2} mb={3} fontSize={13}>
        {/* <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>Trader Side HeatMap (Mock-Gross P&L)</Typography>
              </MDBox>
              <MDBox >
                <Typography sx={{ margin: 2, padding: 1, fontSize: 15,fontWeight:600,backgroundColor:"#f0f2f5", borderRadius:2 }}>Start Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1.5, padding: 1 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
           
              <MDBox >
                <Typography color="dark" sx={{ margin: 2, padding: 1, fontSize: 15,fontWeight:600,backgroundColor:"#f0f2f5", borderRadius:2 }}>End Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1.5, padding: 1 }} onChange={(e)=>{endDate(e)}} value={secondDate}/>
              <MDBox >
              <MDButton variant="contained" color="info" sx={{margin: 1, marginLeft: 10, padding: 1 }} onClick="">Download PDF</MDButton>
              </MDBox>
            </Card> */}
      <MDBox mt={2} mb={3} fontSize={13} style={{ backgroundColor: '#FFF0AA' }}>
      <MDBox fontSize={20} mb={2} display="flex" justifyContent="center" style={{ backgroundColor: 'lightblue' }}>Batch Wise Heat Map</MDBox>
      <HeatMap
        xLabels={xLabelsTemp}
        yLabels={yLabelTempArray}
        xLabelsLocation={"top"}
        xLabelsVisibility={xLabelsVisibility}
        xLabelWidth={100}
        yLabelWidth={70}
        data={data}
        rectangles
        height={40}
        width={100}
        onClick={(x, y) => alert("P&L is : " + `${data[y][x] > 0 ? "+₹" +data[y][x] : data[y][x] == 0 ? "₹"+0 : "-₹"+(-data[y][x])}`)}
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
  );
}
export default BatchWiseTradersHeatMap;
