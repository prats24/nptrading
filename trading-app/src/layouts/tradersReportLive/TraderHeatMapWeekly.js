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

function TradersHeatMapWeekly() {

// Display only even labels
const [selectedWeek, setSelectedWeek] = useState(1);
const weekNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
let date = new Date();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
let valueInDate2 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
let valueInDate1 = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
const [firstWeek, setFirstWeek] = useState(1);
const [secondWeek, setSecondWeek] = useState(52);
const [traders, setTraders] = useState([]);
const [uweeks, setUWeeks] = useState([]);
const [uweeks1, setUWeeks1] = useState([]);
let [overallPnl, setOverallPnl] = useState([]);


useEffect(()=>{
    pnlCalculation(firstWeek,secondWeek)
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

  function startWeek(e){
    e.preventDefault();
    if(e.target.value > secondWeek){
      window.alert("Please select a valid range");
      return;
    }
    setFirstWeek(e.target.value)
    pnlCalculation(e.target.value, secondWeek)
    overallPnl = 0;
    //console.log(e.target.value);
  }
  function endWeek(e){
    e.preventDefault();
    if(e.target.value < firstWeek){
      window.alert("Please select a valid range");
      return;
    }
    setSecondWeek(e.target.value)
    pnlCalculation(firstWeek, e.target.value)
    overallPnl = 0;
    //console.log(e.target.value);
  }


  function pnlCalculation(firstWeek, secondWeek){
    console.log(firstWeek,secondWeek)
    axios.get(`${baseUrl}api/v1/getweeklytraderpnlLive/${firstWeek}/${secondWeek}`)
    .then((res) => {
      let data = res.data;
      console.log(res.data);
      setOverallPnl(res.data);

    }).catch((err) => {
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/getuniqueweeksLive/${firstWeek}/${secondWeek}`)
    .then((res) => {
      let data = res.data;
      console.log(res.data);
      setUWeeks(res.data);

    }).catch((err) => {
        return new Error(err);
    })
  }



let traderNameList = []
traders.map((elem)=>{
    traderNameList.push(elem.name)
})

let pnlweeks = []
uweeks.map((elem)=>{
  pnlweeks.push("Week# " + elem._id.weekNumber + "-" + elem._id.year)
})
console.log(pnlweeks);
let pnlweeks1 = []
uweeks.map((elem)=>{
  pnlweeks1.push(elem._id.weekNumber)
})
console.log(pnlweeks);
let pnldata = []
overallPnl.map((elem)=>{
    pnldata.push([elem._id.weekNumber,elem._id.trader])
})
console.log(pnldata)

const xLabelsVisibility = pnlweeks;

const yLabels = traderNameList
const xLabels = pnlweeks;



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
        return pnlweeks1[j] == e._id.weekNumber && traderNameList[i] == e._id.trader;
      })
      .map((e) => -e.gpnl.toFixed(0));
    }
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

const currentDate = new Date();
const currentWeekNumber = getWeekNumber(currentDate)[1];

console.log(currentWeekNumber);

let dateupdate = new Date();
let dateupdatenow = `last updated ${(dateupdate.getHours())}:${String(dateupdate.getMinutes()).padStart(2, '0')}:${String(dateupdate.getSeconds()).padStart(2, '0')}`
console.log(dateupdatenow);
  
//export default function() {
  return (
    <>
    <MDBox mt={2} mb={3} fontSize={13}>
        <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>Trader Side HeatMap (Mock-Gross P&L)</Typography>
              </MDBox>
              <MDBox >
                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:2, p: 1, fontSize: 15,fontWeight:600}}>Current Week - {currentWeekNumber}</Typography>
              </MDBox>
              <MDBox >
                <Typography sx={{ margin: 2, padding: 1, marginRight: 1,backgroundColor:"#f0f2f5", borderRadius:2, fontSize: 15, fontWeight:600 }}>Week Number Start</Typography>
                </MDBox>
                <TextField
                id="outlined-basic"
                select
                label=""
                defaultValue="1"
                minHeight="4em"
                //helperText="Please select"
                variant="outlined"
                sx={{margin: 1.5, padding: 1, width: "75px", alignContent:"center", alignItems:"center"}}
                onChange={(e)=>{startWeek(e)}}
              >
                {weekNumbers.map((option) => (
                  <MenuItem key={option} value={option} minHeight="4em">
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <MDBox >
                <Typography sx={{ margin: 2, padding: 1,marginRight: 1,backgroundColor:"#f0f2f5", borderRadius:2, fontSize: 15,fontWeight:600 }}>Week Number End</Typography>
                </MDBox>
                <TextField
                id="outlined-basic"
                select
                label=""
                defaultValue="52"
                minHeight="4em"
                //helperText="Please select"
                variant="outlined"
                sx={{margin: 1.5, padding: 1, width: "75px", alignContent:"center",alignItems:"center"}}
                onChange={(e)=>{endWeek(e)}}
              >
                {weekNumbers.map((option) => (
                  <MenuItem key={option} value={option} minHeight="4em">
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <MDBox >
              <MDButton variant="contained" color="info" sx={{margin: 1, marginLeft: 10, padding: 1 }} onClick="">Download PDF</MDButton>
              </MDBox>
            </Card>
      <MDBox mt={2} mb={3} fontSize={13} style={{ backgroundColor: '#FFF0AA' }}>
      <MDBox fontSize={20} mb={2} display="flex" justifyContent="center" style={{ backgroundColor: 'lightblue' }}>Weekly Heat Map</MDBox>
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
        onClick={(x, y) => alert(`${pnlweeks[x]}` + " P&L for " + `${traderNameList[y]} is ${data[y][x] > 0 ? "+₹" +data[y][x] : data[y][x] == 0 ? "₹"+0 : "-₹"+(-data[y][x])}`)}
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
    </>
  );
}
export default TradersHeatMapWeekly;
