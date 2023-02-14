
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
// import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
// import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// // Data
// import reportsBarChartData from "./data/reportsBarChartData";
// import reportsLineChartData from "./data/reportsLineChartData";



// Dashboard components

// import Projects from "./components/Projects";
// import MismatchDetails from "./components/MismatchDetails";
// import InstrumentDetails from "./components/InstrumentDetails";
import MockOverallCompanyPNL from "./Component/MockOverallCompanyPNL";
import LiveOverallCompanyPNL from "./Component/LiveOverallCompanyPNL";
import MockTraderwiseCompanyPNL from "./Component/MockTraderwiseCompanyPNL";
import LiveTraderwiseCompanyPNL from "./Component/LiveTraderwiseCompanyPNL";
// import OrdersOverview from "./components/OrdersOverview";

function AlgoBoxMain({id, algoName}) {

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

          axios.get(`${baseUrl}api/v1/readpermission`)
          .then((res)=>{
            setUserPermission((res.data));            
              //setOrderCountTodayCompany((res.data).length);
          }).catch((err)=>{
              //window.alert("Server Down");
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
  

  return (

    <MDBox py={3}>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MockOverallCompanyPNL  /> */}
                <MockOverallCompanyPNL algoId={id} algoName={algoName} socket={socket} />
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                <LiveOverallCompanyPNL algoId={id} algoName={algoName} socket={socket} />
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MockTraderwiseCompanyPNL /> */}
                <MockTraderwiseCompanyPNL algoId={id} algoName={algoName} users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} />
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                <LiveTraderwiseCompanyPNL algoId={id} algoName={algoName} users={userPermission} handleSwitchChange={handleSwitchChange} socket={socket} />
            </Grid>
            </Grid>
        </MDBox>
    </MDBox>

  );
}

export default AlgoBoxMain;
