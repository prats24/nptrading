import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import TextField from '@mui/material/TextField';




// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";


// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";



// Dashboard components

import InstrumentDetails from "./components/InstrumentDetails";
import OverallPL from "./OverallP&L/Overall P&L";
import OverallGrid from "./OverallP&L/OverallGrid";
import MarginGrid from "./MarginDetails/MarginGrid";

function UserPosition() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  // let socket;
  // try {
  //   socket = io.connect(`${baseUrl1}`)
  // } catch (err) {
  //   throw new Error(err);
  // }

  const [inputData, setInputData] = useState();
  const [reRender, setReRender] = useState(true);

  
  useEffect(()=>{

                
  }, [])


  let timeoutId; // store the timeout id

function sendSearchReq(data) {
  // clear previous timeout if there is one
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // set a new timeout to send the request after 1 second
  timeoutId = setTimeout(() => {
    sendRequest(data);
  }, 1000);
}




  function sendRequest(data){


    // console.log("data", data.toUpperCase())


    axios.get(`${baseUrl}api/v1/tradableInstruments?search=${data}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      console.log("instrumentData", res.data)


    }).catch((err)=>{
      console.log(err);
    })

  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>


        <TextField
          id="outlined-basic" label="Search Symbol" variant="standard" type="text"
          sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{sendSearchReq(e.target.value.toUpperCase())}}/>


        {/* <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <InstrumentDetails socket={socket} Render={{ reRender, setReRender }} />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
             <OverallGrid socket={socket} Render={{ reRender, setReRender }}/>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MarginGrid/>
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;
