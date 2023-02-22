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

function TradersHeatMap() {

// Display only even labels
let date = new Date();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let valueInDate2 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
let valueInDate1 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
const [firstDate, setFirstDate] = useState(valueInDate1);
const [secondDate, setSecondDate] = useState(valueInDate2);
const [traders, setTraders] = useState([]);
const [udates, setUDates] = useState([]);
let [overallPnl, setOverallPnl] = useState([]);


useEffect(()=>{
    pnlCalculation(valueInDate1,valueInDate2)
      overallPnl = 0;

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
  },[])

  function startDate(e){
    e.preventDefault();
    if(e.target.value > secondDate){
      window.alert("Please select a valid range");
      return;
    }
    setFirstDate(e.target.value)
    pnlCalculation(e.target.value, secondDate)
    overallPnl = 0;
    //console.log(e.target.value);
  }
  function endDate(e){
    e.preventDefault();
    if(e.target.value < firstDate){
      window.alert("Please select a valid range");
      return;
    }
    setSecondDate(e.target.value)
    pnlCalculation(firstDate, e.target.value)
    overallPnl = 0;
    //console.log(e.target.value);
  }


  function pnlCalculation(firstDate, secondDate){
    console.log(firstDate,secondDate)
    axios.get(`${baseUrl}api/v1/getuserreportLive/${firstDate}/${secondDate}`)
    .then((res) => {
      let data = res.data;
      console.log(res.data);
      setOverallPnl(res.data);

    }).catch((err) => {
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/getuniquedatesLive/${firstDate}/${secondDate}`)
    .then((res) => {
      let data = res.data;
      console.log(res.data);
      setUDates(res.data);

    }).catch((err) => {
        return new Error(err);
    })
  }


  overallPnl.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
        return 1;
    }
    return 0;
  });



let traderNameList = []
traders.map((elem)=>{
    traderNameList.push(elem.name)
})

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

const xLabelsVisibility = pnldates;

const yLabels = traderNameList
const xLabels = [];
for (let i = 0; i < pnldates.length; i++) {
    console.log(pnldates[i][1]);
    xLabels.push(pnldates[i][1])
}

const pnldates1 = [];
for (let i = 0; i < pnldates.length; i++) {
    console.log(pnldates[i][0]);
    pnldates1.push(pnldates[i][0])
}

let rows = traderNameList.length;
let cols = xLabels.length;
let data = new Array(rows);

for (let i = 0; i < rows; i++) {
  data[i] = new Array(cols);
}

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      data[i][j] = overallPnl
      .filter((e) => {
        return pnldates1[j] == e._id.date && traderNameList[i] == e._id.trader;
      })
      .map((e) => -e.amount.toFixed(0));
    }
}

let dateupdate = new Date();
let dateupdatenow = `last updated ${(dateupdate.getHours())}:${String(dateupdate.getMinutes()).padStart(2, '0')}:${String(dateupdate.getSeconds()).padStart(2, '0')}`
console.log(dateupdatenow);
  
//export default function() {
  return (
    
    <MDBox mt={2} mb={3} fontSize={13}>
        <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
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
            </Card>
      <MDBox mt={2} mb={3} fontSize={13} style={{ backgroundColor: '#FFF0AA' }}>
      <MDBox fontSize={20} mb={2} display="flex" justifyContent="center" style={{ backgroundColor: 'lightblue' }}>Daywise Heat Map</MDBox>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation={"top"}
        xLabelsVisibility={xLabelsVisibility}
        xLabelWidth={100}
        yLabelWidth={100}
        data={data}
        rectangles
        height={40}
        width={50}
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
    <Typography sx={{ mt: -2 }} display="flex">
      <Icon fontSize="small" sx={{ mt: -0.25 }}>
        <AccessTimeIcon/>
      </Icon><Typography sx={{ mt: -1 }}>{dateupdatenow}</Typography>
    </Typography>
    </MDBox>
  );
}
export default TradersHeatMap;
