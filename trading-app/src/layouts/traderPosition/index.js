
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

// Data



// Dashboard components

import OverallTraderPnl from "./components/overallTraderPnl";
import TraderwiseTraderPnl from "./components/TraderwiseTraderPNL";

function TraderPosition() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
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


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {/* <MismatchDetails socket={socket}/> */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {/* <InstrumentDetails socket={socket}/> */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <OverallTraderPnl socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {/* <LiveOverallCompanyPNL socket={socket} /> */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <TraderwiseTraderPnl socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {/* <LiveTraderwiseCompanyPNL users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} /> */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TraderPosition;

// todo ---> mismatch