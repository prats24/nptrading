
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

// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";



// Dashboard components

import Projects from "./components/Projects";
import MismatchDetails from "./components/MismatchDetails";
import InstrumentDetails from "./components/InstrumentDetails";
import MockOverallCompanyPNL from "./components/MockOverallCompanyPNL";
import LiveOverallCompanyPNL from "./components/LiveOverallCompanyPNL";
import MockTraderwiseCompanyPNL from "./components/MockTraderwiseCompanyPNL";
import LiveTraderwiseCompanyPNL from "./components/LiveTraderwiseCompanyPNL";
import OrdersOverview from "./components/OrdersOverview";

function CompanyPosition() {
  const { pnl, pnlpoints } = reportsLineChartData;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try{
      socket = io.connect(`${baseUrl1}`)
  } catch(err){
      throw new Error(err);
  }

    const [todaymockcount, setTodayMockCount] = useState([]);
    const [allmockcount, setAllMockCount] = useState([]);
    const [todaylivecount, setTodayLiveCount] = useState([]);
    const [alllivecount, setAllLiveCount] = useState([]);

    const [userPermission, setUserPermission] = useState([]);
   
    useEffect(()=>{

        //console.log(socket);
        socket.on("connect", ()=>{
            //console.log(socket.id);
            socket.emit("hi",true)
        })
        socket.on("noToken", (data)=>{
            //console.log("no token");
            window.alert(data);
        })
        socket.on("wrongToken", (data)=>{
            //console.log("wrong Token");
            window.alert(data);
        })

    }, []);

    useEffect(()=>{

        axios.get(`${baseUrl}api/v1/readmocktradecompanytodaycount`)
        .then((res)=>{
            setTodayMockCount((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readlivetradecompanycountToday`)
        .then((res)=>{
            setTodayLiveCount((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })


        axios.get(`${baseUrl}api/v1/readmocktradecompanycount`)
        .then((res)=>{
            setAllMockCount((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readlivetradecompanycount`)
        .then((res)=>{
            setAllLiveCount((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readpermission`)
        .then((res)=>{
          setUserPermission((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

    }, []);

    const handleSwitchChange = id => {
      setUserPermission(prevUsers =>
        prevUsers.map(user => {
          if (user.userId === id) {
            return { ...user, isRealTradeEnable: !user.isRealTradeEnable };
          }
          return user;
        })
      );
    };

    console.log("re rendering index")

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MismatchDetails socket={socket}/>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <InstrumentDetails socket={socket}/>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MockOverallCompanyPNL socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <LiveOverallCompanyPNL socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MockTraderwiseCompanyPNL users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <LiveTraderwiseCompanyPNL users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CompanyPosition;

// todo ---> mismatch