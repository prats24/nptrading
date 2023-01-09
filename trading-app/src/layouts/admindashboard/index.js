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
    const [PNLData, setPNLData] = useState([]);
    const [gpnl, setGpnlarray] = useState([]);
    const [npnl, setNpnlarray] = useState([]);
    const [brokerage, setBrokeragearray] = useState([]);
    const [ThisWeekPNLData, setThisWeekPNLData] = useState([]);
    const [pnldate, setPNLDatearray] = useState([]);
    const [thisweekgpnl, setThisWeekGPNL] = useState([]);
    const [thisweekbrokerage, setThisWeekBrokerage] = useState([]);
    const [thisweektrades, setThisWeekTrades] = useState([]);
    const [thisweeknpnl, setThisWeekNPNL] = useState([]);
    const [ThisMonthPNLData, setThisMonthPNLData] = useState([]);
    const [thismonthgpnl, setThisMonthGPNL] = useState([]);
    const [thismonthbrokerage, setThisMonthBrokerage] = useState([]);
    const [thismonthtrades, setThisMonthTrades] = useState([]);
    const [thismonthnpnl, setThisMonthNPNL] = useState([]);
    const [ThisYearPNLData, setThisYearPNLData] = useState([]);
    const [thisyeargpnl, setThisYearGPNL] = useState([]);
    const [thisyearbrokerage, setThisYearBrokerage] = useState([]);
    const [thisyeartrades, setThisYearTrades] = useState([]);
    const [thisyearnpnl, setThisYearNPNL] = useState([]);
    const [ThisYesterdayPNLData, setThisYesterdayPNLData] = useState([]);
    const [thisyesterdaygpnl, setThisYesterdayGPNL] = useState([]);
    const [thisyesterdaybrokerage, setThisYesterdayBrokerage] = useState([]);
    const [thisyesterdaytrades, setThisYesterdayTrades] = useState([]);
    const [thisyesterdaynpnl, setThisYesterdayNPNL] = useState([]);

    
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
    
   //This week pnl details code starts
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthisweek`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
          if(res.data)
          {
          setThisWeekPNLData(res.data) 
          console.log(ThisWeekPNLData);
          setThisWeekBrokerage((res.data[0]).brokerage)
          console.log((res.data[0]).brokerage)
          setThisWeekGPNL((-(res.data[0]).amount))
          console.log(-(res.data[0]).amount)
          setThisWeekTrades((res.data[0]).trades)
          setThisWeekNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          console.log(thisweeknpnl)
          }
    }).catch((err)=>{
        window.alert("Server Down");
        return new Error(err);
    })
},[])

  // This week pnl details code ends
  

  // This month pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthismonth`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
          if(res.data){
          setThisMonthPNLData(res.data) 
          console.log(ThisMonthPNLData);
          setThisMonthBrokerage((res.data[0]).brokerage)
          console.log((res.data[0]).brokerage)
          setThisMonthGPNL((-(res.data[0]).amount))
          console.log(-(res.data[0]).amount)
          setThisMonthTrades((res.data[0]).trades)
          setThisMonthNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          console.log(thismonthnpnl)
          }
    })
},[])

  // This month pnl details code start
  

  // This Year pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthisyear`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
          if(res.data)
          {
          setThisYearPNLData(res.data) 
          console.log(ThisYearPNLData);
          setThisYearBrokerage((res.data[0]).brokerage)
          console.log((res.data[0]).brokerage)
          setThisYearGPNL((-(res.data[0]).amount))
          console.log(-(res.data[0]).amount)
          setThisYearTrades((res.data[0]).trades)
          setThisYearNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          console.log(thisyearnpnl)
          }
    })
},[])

  // This year pnl details code ends

  
  // Yesterday's pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsyesterday`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
          
          setThisYesterdayPNLData(res.data) 
          console.log(ThisYesterdayPNLData);
          setThisYesterdayBrokerage((res.data[0]).brokerage)
          console.log((res.data[0]).brokerage)
          setThisYesterdayGPNL((-(res.data[0]).amount))
          console.log(-(res.data[0]).amount)
          setThisYesterdayTrades((res.data[0]).trades)
          setThisYesterdayNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          console.log(thisyesterdaynpnl)
          
    })
},[])

  // Yesterday's pnl details code ends

  //chart data code starts

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getpnlmocktradecompanylastfivedays`)
    .then((res)=>{
        setPNLData(res.data) 
        for(let item of res.data)
        {
          setBrokeragearray((prev)=>{return[...prev,(item.brokerage)]})
          setPNLDatearray((prev)=>{return[...prev,item._id.date]})
          setGpnlarray((prev)=>{return[...prev,-item.amount]})
          setNpnlarray((prev)=>{return[...prev,(-item.amount)-item.brokerage]})
          
        }
    })
},[])

let datepartpnl = [];
pnldate.map((elem)=>{
  // const date = new Date(elem);
  datepartpnl.push(elem.slice(-2));
})

pnldate.map((elem)=>{
  const date = new Date(elem);
  const dayOfWeek = date.getDay();
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  // console.log(weekday);  // Output: "Sunday"
  dayname.push(weekday.slice(0,3))
})
//chart data code ends
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
                    datasets: { label: "Transaction Cost", data: brokerage },
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
                heading="Yesterday's Summary"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={!thisyesterdaygpnl ? (thisyesterdaygpnl >= 0 ? "+₹"+ thisyesterdaygpnl : "-₹"+ (-thisyesterdaygpnl)) : "₹" + 0}
                tcost={!thisyesterdaybrokerage ? "₹"+thisyesterdaybrokerage : "₹" + 0}
                npnl={!thisyesterdaynpnl ? (thisyesterdaynpnl >= 0 ? "+₹"+thisyesterdaynpnl : "-₹"+ (-thisyesterdaynpnl)) : "₹" + 0}
                trades={!thisyesterdaytrades ? thisyesterdaytrades : 0}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask day before yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                heading="Week's Summary"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thisweekgpnl >= 0 ? "+₹"+ thisweekgpnl : "-₹"+ (-thisweekgpnl)}
                tcost={"₹"+thisweekbrokerage}
                npnl={thisweeknpnl >= 0 ? "+₹"+thisweeknpnl : "-₹"+ (-thisweeknpnl)}
                trades={thisweektrades}
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
                heading="Month's Summary"
                icon="store"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thismonthgpnl >= 0 ? "+₹"+ thismonthgpnl : "-₹"+ (-thismonthgpnl)}
                tcost={"₹"+thismonthbrokerage}
                npnl={thismonthnpnl >= 0 ? "+₹"+thismonthnpnl : "-₹"+ (-thismonthnpnl)}
                trades={thismonthtrades}
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
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thisyeargpnl >= 0 ? "+₹"+ thisyeargpnl : "-₹"+ (-thisyeargpnl)}
                tcost={"₹"+thisyearbrokerage}
                npnl={thisyearnpnl >= 0 ? "+₹"+thisyearnpnl : "-₹"+ (-thisyearnpnl)}
                trades={thisyeartrades}
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
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
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
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
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
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
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
                titletrades="# of Trades"
                gpnl={allmockcount}
                tcost={allmockcount}
                npnl={allmockcount}
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
