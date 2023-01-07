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
  const {labels, datasets} = reportsBarChartData;

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
    const [Tdata, setTdata] = useState([]);
    const [tcostarray, setTcostarray] = useState([]);
    const [tcostdate, setTcostdate] = useState([]);
    const [PNLData, setPNLData] = useState([]);
    const [gpnl, setGpnlarray] = useState([]);
    const [npnl, setNpnlarray] = useState([]);
    const [brokerage, setBrokeragearray] = useState([]);
    const [pnldate, setPNLDatearray] = useState([]);

    
    let dayname = [];
   
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
//  Transaction Cost Chart Code Starts
    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/gettcostmocktradecompanylastfivedays`)
      // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
      .then((res)=>{
          // setTCost(res.data);
          setTdata(res.data) 
          for(let item of res.data)
          {
            // tcostarray.push(item.brokerage)
            setTcostarray((prev)=>{return[...prev,item.brokerage]})
            console.log(tcostarray);
            setTcostdate((prev)=>{return[...prev,item._id]})
          }
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  tcostdate.map((elem)=>{
    const date = new Date(elem);
    const dayOfWeek = date.getDay();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    console.log(weekday);  // Output: "Sunday"
    dayname.push(weekday.slice(0,3))
  })

  //  Transaction Cost Chart Code Ends

  //  PNL Chart Code Starts
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getpnlmocktradecompanylastfivedays`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        // setTCost(res.data);
        setPNLData(res.data) 
        for(let item of res.data)
        {
          // tcostarray.push(item.brokerage)
          setBrokeragearray((prev)=>{return[...prev,item.brokerage]})
          setPNLDatearray((prev)=>{return[...prev,item._id.date]})
          setGpnlarray((prev)=>{return[...prev,-item.amount]})
          setNpnlarray((prev)=>{return[...prev,(-item.amount)-item.brokerage]})
          
        }
    }).catch((err)=>{
        window.alert("Server Down");
        return new Error(err);
    })
},[])

let datepartpnl = [];
pnldate.map((elem)=>{
  // const date = new Date(elem);
  datepartpnl.push(elem.slice(-2));
})


  //  PNL Chart Code Ends
  
  
    console.log("TData"+Tdata);
    console.log(todaymockcount)
    console.log(allmockcount)
    console.log(todaylivecount)
    console.log(alllivecount)
    console.log(tcostarray)
    console.log(tcostdate)
    // console.log(reportsBarChartData.labels)
    // console.log(reportsBarChartData.datasets.data())
    // console.log(reportsBarChartData.datasets)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>

      <MDBox mb={1}>
          <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Last 5 days net p&l"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={
                    {
                      labels: datepartpnl,
                      datasets: { label: "Net P&L", data: npnl },
                    }
                  }
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Last 5 days Transaction Cost"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={{
                    labels: dayname,
                    datasets: { label: "Transaction Cost", data: tcostarray },
                  }}
                />
              </MDBox>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Last 5 days gross p&l"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={
                    {
                      labels: datepartpnl,
                      datasets: { label: "Gross P&L", data: gpnl },
                    }
                  }
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

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
