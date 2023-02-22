import React, { useRef } from "react";
import jsPDF from "jspdf";
import HeatMap from "react-heatmap-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import { Typography } from "@mui/material";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {useState, useContext, useEffect} from "react"

const HeatMapComponent = ({ data, xLabels, yLabels, xLabelsVisibility }) => {
  const heatmapRef = useRef(null);

  let date = new Date();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
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
      axios.get(`${baseUrl}api/v1/getuserreport/${firstDate}/${secondDate}`)
      .then((res) => {
        let data = res.data;
        console.log(res.data);
        setOverallPnl(res.data);
  
      }).catch((err) => {
          return new Error(err);
      })
  
      axios.get(`${baseUrl}api/v1/getuniquedates/${firstDate}/${secondDate}`)
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
  
  
  // const xLabelsVisibility = new Array(pnldates.length)
  //   .fill(0)
  //   .map((_, i) => (i % 2 === 0 ? true : false));
  
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

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.addHTML(heatmapRef.current, () => {
      pdf.save("heatmap.pdf");
    });
  };

  return (
    <div>
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
          background: `${value > 0 ? `rgb(0, 255, 0, ${1 - (max - value) / (max - min)})` : value == 0 ? "rgb(255, 255, 0)" :`rgb(255, 0, 0, ${1 - (max - (-value)) / (max - min)})`}`,
          fontSize: "10px",
          color: "white",
        })}
        cellRender={value => value && <MDBox>{value > 0 ? "+₹"+value.toLocaleString() : value == 0 ? "₹0" : "-₹"+(-value).toLocaleString()}</MDBox>}
        ref={heatmapRef}
      />
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default HeatMapComponent;
