/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
import OrdersOverview from "./components/OrdersOverview";

function AdminDashboard() {
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
   
    useEffect(()=>{

        console.log(socket);
        socket.on("connect", ()=>{
            console.log(socket.id);
            socket.emit("hi",true)
        })
        socket.on("noToken", (data)=>{
            console.log("no token");
            window.alert(data);
        })
        socket.on("wrongToken", (data)=>{
            console.log("wrong Token");
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
    });
    console.log(todaymockcount)
    console.log(allmockcount)
    console.log(todaylivecount)
    console.log(alllivecount)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                heading="Today's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={todaymockcount}
                tcost={todaymockcount}
                npnl={todaymockcount}
                traders={todaymockcount}
                trades={todaymockcount}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                heading="Week's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                heading="Months's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                heading="Years's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* Second Grid Start */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                heading="Yesterday's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                heading="Last Week's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                heading="Last Month's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                heading="Last Year's Summary"
                titlegpnl="Gross P&L"
                titletcost="Transaction Cost"
                titlenpnl="Net P&L"
                titletraders="# of Traders"
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
                traders={allmockcount}
                trades={allmockcount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* Second Grid Ends */}

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Daily Transaction Cost"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily net p&l"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={pnl}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="daily gross p&l"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={pnlpoints}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8} mb={3}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4} mb={3}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
        
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminDashboard;
