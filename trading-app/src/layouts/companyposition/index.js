
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

import MismatchDetails from "./components/MismatchDetails";
import InstrumentDetails from "./components/InstrumentDetails";
import MockOverallCompanyPNL from "./components/MockOverallCompanyPNL";
import LiveOverallCompanyPNL from "./components/LiveOverallCompanyPNL";
import MockTraderwiseCompanyPNL from "./components/MockTraderwiseCompanyPNL";
import LiveTraderwiseCompanyPNL from "./components/LiveTraderwiseCompanyPNL";

function CompanyPosition() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try{
      socket = io.connect(`${baseUrl1}`)
  } catch(err){
      throw new Error(err);
  }


    const [userPermission, setUserPermission] = useState([]);

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readpermission`)
        .then((res)=>{
          setUserPermission((res.data));            
            //setOrderCountTodayCompany((res.data).length);
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })

    }, []);

    useEffect(() => {
      socket.on("connect", () => {
        socket.emit("hi", true)
      })
      socket.on("noToken", (data) => {
        window.alert(data);
      })
      socket.on("wrongToken", (data) => {
        window.alert(data);
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


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0}>
      <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MismatchDetails socket={socket}/>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox mt={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <InstrumentDetails socket={socket}/>
            </Grid>
          </Grid>
        </MDBox> */}
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
              <MockTraderwiseCompanyPNL users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} />
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