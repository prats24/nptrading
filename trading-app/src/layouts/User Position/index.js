import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";



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
  const { columns, rows } = OverallPL();
  const { columns: pColumns, rows: pRows } = OverallPL();

  const { pnl, pnlpoints } = reportsLineChartData;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  const [todaymockcount, setTodayMockCount] = useState([]);
  const [allmockcount, setAllMockCount] = useState([]);
  const [todaylivecount, setTodayLiveCount] = useState([]);
  const [alllivecount, setAllLiveCount] = useState([]);
  const [reRender, setReRender] = useState(true);

  useEffect(() => {

    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("hi", true)
    })
    socket.on("noToken", (data) => {
      console.log("no token");
      window.alert(data);
    })
    socket.on("wrongToken", (data) => {
      console.log("wrong Token");
      window.alert(data);
    })

  }, []);

  useEffect(() => {

    axios.get(`${baseUrl}api/v1/readmocktradecompanytodaycount`)
      .then((res) => {
        setTodayMockCount((res.data));
        //setOrderCountTodayCompany((res.data).length);
      }).catch((err) => {
        window.alert("Server Down");
        return new Error(err);
      })

    axios.get(`${baseUrl}api/v1/readlivetradecompanycountToday`)
      .then((res) => {
        setTodayLiveCount((res.data));
        //setOrderCountTodayCompany((res.data).length);
      }).catch((err) => {
        window.alert("Server Down");
        return new Error(err);
      })


    axios.get(`${baseUrl}api/v1/readmocktradecompanycount`)
      .then((res) => {
        setAllMockCount((res.data));
        //setOrderCountTodayCompany((res.data).length);
      }).catch((err) => {
        window.alert("Server Down");
        return new Error(err);
      })

    axios.get(`${baseUrl}api/v1/readlivetradecompanycount`)
      .then((res) => {
        setAllLiveCount((res.data));
        //setOrderCountTodayCompany((res.data).length);
      }).catch((err) => {
        window.alert("Server Down");
        return new Error(err);
      })
  },[reRender]);
  console.log(todaymockcount)
  console.log(allmockcount)
  console.log(todaylivecount)
  console.log(alllivecount)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>

        <MDBox mt={0}>
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
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;
