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
import { height } from "@mui/system";

function AdminDashboard() {
  const { pnl, pnlpoints } = reportsLineChartData;
  const {labels, datasets} = reportsBarChartData;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

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
    const [ThisDayBeforeYesterdayPNLData, setThisDayBeforeYesterdayPNLData] = useState([]);
    const [thisDayBeforeyesterdaygpnl, setThisDayBeforeYesterdayGPNL] = useState([]);
    const [thisDayBeforeyesterdaybrokerage, setThisDayBeforeYesterdayBrokerage] = useState([]);
    const [thisDayBeforeyesterdaytrades, setThisDayBeforeYesterdayTrades] = useState([]);
    const [thisDayBeforeyesterdaynpnl, setThisDayBeforeYesterdayNPNL] = useState([]);
    const [LastMonthPNLData, setLastMonthPNLData] = useState([]);
    const [lastmonthgpnl, setLastMonthGPNL] = useState([]);
    const [lastmonthbrokerage, setLastMonthBrokerage] = useState([]);
    const [lastmonthtrades, setLastMonthTrades] = useState([]);
    const [lastmonthnpnl, setLastMonthNPNL] = useState([]);
    const [LastYearPNLData, setLastYearPNLData] = useState([]);
    const [lastyeargpnl, setLastYearGPNL] = useState([]);
    const [lastyearbrokerage, setLastYearBrokerage] = useState([]);
    const [lastyeartrades, setLastYearTrades] = useState([]);
    const [lastyearnpnl, setLastYearNPNL] = useState([]);
    const [LastWeekPNLData, setLastWeekPNLData] = useState([]);
    const [lastweekgpnl, setLastWeekGPNL] = useState([]);
    const [lastweekbrokerage, setLastWeekBrokerage] = useState([]);
    const [lastweektrades, setLastWeekTrades] = useState([]);
    const [lastweeknpnl, setLastWeekNPNL] = useState([]);
    let dayname = [];

  // constant for trader dashbaord
    const [thismonthtraderwisePNLData, setthismonthtraderwisePNLData] = useState([]);
    const [thismonthtraderwisegpnl, setthismonthtraderwiseGPNL] = useState([]);
    const [thismonthtraderwisebrokerage, setthismonthtraderwiseBrokerage] = useState([]);
    const [thismonthtraderwisetrades, setthismonthtraderwiseTrades] = useState([]);
    const [thismonthtraderwisenpnl, setthismonthtraderwiseNPNL] = useState([]);
    const [tradername, settradername] = useState([]);
  
  // Codes for Trader Dashboard

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/gettraderwisepnldetailsthismonth`)
    .then((res)=>{
        //console.log(res.data);
            for(let item of res.data)
            {
              if(tradername == '')
              {
              settradername((prev)=>{return[...prev,(item._id)]})
              setthismonthtraderwiseGPNL((prev)=>{return[...prev,-item.gpnl]})
              setthismonthtraderwiseBrokerage((prev)=>{return[...prev,item.brokerage]})
              setthismonthtraderwiseNPNL((prev)=>{return[...prev,(-item.gpnl)-item.brokerage]})
              setthismonthtraderwiseTrades((prev)=>{return[...prev,(-item.trades)]}) 
              } 
            }
            }).catch((err)=>{
                //window.alert("Server Down");
                return new Error(err);
            })
},[])

//console.log("Trader Name "+tradername);
//console.log("GPNL "+thismonthtraderwisegpnl);
//console.log("Brokerage "+thismonthtraderwisebrokerage);
//console.log("NPNL "+thismonthtraderwisenpnl);
//console.log("Trades "+thismonthtraderwisetrades);

  // Code Ends




   ////// COde used in Company Dashboard 
   //This week pnl details code starts
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthisweek`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        //console.log(res.data);

          if((res.data).length !== 0){
            //console.log(ThisWeekPNLData);
            setThisWeekBrokerage((res.data[0]).brokerage)
            //console.log((res.data[0]).brokerage)
            setThisWeekGPNL((-(res.data[0]).amount))
            //console.log(-(res.data[0]).amount)
            setThisWeekTrades((res.data[0]).trades)
            setThisWeekNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
            //console.log(thisweeknpnl)
          } else{
            setThisWeekBrokerage(0)
            setThisWeekGPNL(0)
            setThisWeekTrades(0)
            setThisWeekNPNL(0)
          }
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })
},[])

//Last Week Code

useEffect(()=>{
  axios.get(`${baseUrl}api/v1/getmocktradecompanydetailslastweek`)
  // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
  .then((res)=>{
      //console.log(res.data);
        if(res.data)
        {
        // setLastWeekPNLData(res.data) 
        //console.log(LastWeekPNLData);
        setLastWeekBrokerage((res.data[0]).brokerage)
        //console.log((res.data[0]).brokerage)
        setLastWeekGPNL((-(res.data[0]).amount))
        //console.log(-(res.data[0]).amount)
        setLastWeekTrades((res.data[0]).trades)
        setLastWeekNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
        //console.log(lastweeknpnl)
        }
  }).catch((err)=>{
      //window.alert("Server Down");
      return new Error(err);
  })
},[])

//Last week code ends

  // This week pnl details code ends
  

  // This month pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthismonth`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        //console.log(res.data);
          if(res.data){
          // setThisMonthPNLData(res.data) 
          //console.log(ThisMonthPNLData);
          setThisMonthBrokerage((res.data[0]).brokerage)
          //console.log((res.data[0]).brokerage)
          setThisMonthGPNL((-(res.data[0]).amount))
          //console.log(-(res.data[0]).amount)
          setThisMonthTrades((res.data[0]).trades)
          setThisMonthNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          //console.log(thismonthnpnl)
          }
    })
},[])

// Last MOnths COde


useEffect(()=>{
  axios.get(`${baseUrl}api/v1/readmocktradecompanyLastMonth`)
  // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
  .then((res)=>{
      //console.log(res.data);
        if(res.data){
        // setLastMonthPNLData(res.data) 
        //console.log(LastMonthPNLData);
        setLastMonthBrokerage((res.data[0]).brokerage)
        //console.log((res.data[0]).brokerage)
        setLastMonthGPNL((-(res.data[0]).amount))
        //console.log(-(res.data[0]).amount)
        setLastMonthTrades((res.data[0]).trades)
        setLastMonthNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
        //console.log(lastmonthnpnl)
        }
  })
},[])

//Code Ends


  // This month pnl details code start
  

  // This Year pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthisyear`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        //console.log(res.data);
          if(res.data)
          {
          // setThisYearPNLData(res.data) 
          //console.log(ThisYearPNLData);
          setThisYearBrokerage((res.data[0]).brokerage)
          //console.log((res.data[0]).brokerage)
          setThisYearGPNL((-(res.data[0]).amount))
          //console.log(-(res.data[0]).amount)
          setThisYearTrades((res.data[0]).trades)
          setThisYearNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
          //console.log(thisyearnpnl)
          }
    })
},[])

//Last Year Code

useEffect(()=>{
  axios.get(`${baseUrl}api/v1/getmocktradecompanydetailslastyear`)
  // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
  .then((res)=>{
      //console.log(res.data);
        if(res.data)
        {
        // setThisYearPNLData(res.data) 
        //console.log(LastYearPNLData);
        setLastYearBrokerage((res.data[0]).brokerage)
        //console.log((res.data[0]).brokerage)
        setLastYearGPNL((-(res.data[0]).amount))
        //console.log(-(res.data[0]).amount)
        setLastYearTrades((res.data[0]).trades)
        setLastYearNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
        //console.log(lastyearnpnl)
        }
  })
},[])

// Code Ends

  // This year pnl details code ends
  
  // Yesterday's pnl details code start

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsyesterday`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        //console.log(res.data);
          
          if((res.data).length !== 0){
            setThisYesterdayBrokerage((res.data[0]).brokerage)
            //console.log((res.data[0]).brokerage)
            setThisYesterdayGPNL((-(res.data[0]).amount))
            //console.log(-(res.data[0]).amount)
            setThisYesterdayTrades((res.data[0]).trades)
            setThisYesterdayNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
            //console.log(thisyesterdaynpnl)
          } else{
            setThisYesterdayBrokerage(0)
            //console.log(0)
            setThisYesterdayGPNL((0))
            //console.log(0)
            setThisYesterdayTrades(0)
            setThisYesterdayNPNL(0)
            //console.log(thisyesterdaynpnl)
          }
          
    })
},[])

// Day before yesterday 

useEffect(()=>{
  axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsdaybeforeyesterday`)
  // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
  .then((res)=>{
      //console.log(res.data);
        
        // setThisDayBeforeYesterdayPNLData(res.data) 
        //console.log(ThisDayBeforeYesterdayPNLData);
        setThisDayBeforeYesterdayBrokerage((res.data[0]).brokerage)
        //console.log((res.data[0]).brokerage)
        setThisDayBeforeYesterdayGPNL((-(res.data[0]).amount))
        //console.log(-(res.data[0]).amount)
        setThisDayBeforeYesterdayTrades((res.data[0]).trades)
        setThisDayBeforeYesterdayNPNL(((-(res.data[0]).amount)-(res.data[0]).brokerage))
        //console.log(thisDayBeforeyesterdaynpnl)
        
  })
},[])

// Code Ends

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
  // //console.log(weekday);  // Output: "Sunday"
  dayname.push(weekday.slice(0,3))
})

// setThisYesterdayBrokerage(thisyesterdaybrokerage);
//chart data code ends
    // //console.log(reportsBarChartData.labels)
    // //console.log(reportsBarChartData.datasets.data())
    // //console.log(reportsBarChartData.datasets)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>

      <MDBox mb={1}>
          <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  colorheight={"25rem"}
                  title="Current Month's Traderwise Net P&L"
                  description={
                    <>
                      (<strong>+20%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: tradername,
                      datasets: { label: "Gross P&L", data: thismonthtraderwisenpnl }
                    }
                  }
                />
              </MDBox>
            </Grid>

          <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  colorheight={"25rem"}
                  title="Current Month's Traderwise Transaction Cost"
                  description={
                    <>
                      (<strong>+20%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: tradername,
                      datasets: { label: "Gross P&L", data: thismonthtraderwisebrokerage }
                    }
                  }
                />
              </MDBox>
            </Grid>

            
            
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Last 5 days gross p&l"
                  description={
                    <>
                      (<strong>+10%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: datepartpnl,
                      datasets: { label: "Gross P&L", data: gpnl },
                    }
                  }
                />
              </MDBox>
            </Grid> */}
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
                gpnl={thisyesterdaygpnl >= 0 ? "+₹"+ thisyesterdaygpnl : "-₹"+ (-thisyesterdaygpnl)}
                tcost={"₹"+thisyesterdaybrokerage}
                npnl={thisyesterdaynpnl >= 0 ? "+₹"+thisyesterdaynpnl : "-₹"+ (-thisyesterdaynpnl)}
                trades={thisyesterdaytrades}
                percentage={{
                  color: "success",
                  amount: "+100%",
                  label: "than day before yesterday(Net P&L)",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                heading="Week's Summary(Till Yesterday)"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thisweekgpnl >= 0 ? "+₹"+ thisweekgpnl : "-₹"+ (-thisweekgpnl)}
                tcost={"₹"+thisweekbrokerage}
                npnl={thisweeknpnl >= 0 ? "+₹"+thisweeknpnl : "-₹"+ (-thisweeknpnl)}
                trades={thisweektrades}
                percentage={{
                  color: "error",
                  amount: "-130%",
                  label: "than last week(Net P&L)",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                heading="Month's Summary(Till Yesterday)"
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
                  color: "error",
                  amount: "-40%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                heading="Years's Summary(Till Yesterday)"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thisyeargpnl >= 0 ? "+₹"+ thisyeargpnl : "-₹"+ (-thisyeargpnl)}
                tcost={"₹"+thisyearbrokerage}
                npnl={thisyearnpnl >= 0 ? "+₹"+thisyearnpnl : "-₹"+ (-thisyearnpnl)}
                trades={thisyeartrades}
                percentage={{
                  color: "error",
                  amount: "-40%",
                  label: "than last year",
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
                heading="Day Before Yesterday's Summary"
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={thisDayBeforeyesterdaygpnl != 0 ? (thisDayBeforeyesterdaygpnl > 0 ? "+₹"+ thisDayBeforeyesterdaygpnl : "-₹"+ (-thisDayBeforeyesterdaygpnl)) : "₹" + 0}
                tcost={thisDayBeforeyesterdaybrokerage != 0 ? "₹"+thisDayBeforeyesterdaybrokerage : "₹" + 0}
                npnl={thisDayBeforeyesterdaynpnl != 0 ? (thisDayBeforeyesterdaynpnl > 0 ? "+₹"+thisDayBeforeyesterdaynpnl : "-₹"+ (-thisDayBeforeyesterdaynpnl)) : "₹" + 0}
                trades={thisDayBeforeyesterdaytrades != 0 ? thisDayBeforeyesterdaytrades : 0}
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
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={lastweekgpnl >= 0 ? "+₹"+ lastweekgpnl : "-₹"+ (-lastweekgpnl)}
                tcost={"₹"+lastweekbrokerage}
                npnl={lastweeknpnl >= 0 ? "+₹"+lastweeknpnl : "-₹"+ (-lastweeknpnl)}
                trades={lastweektrades}
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
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={lastmonthgpnl >= 0 ? "+₹"+ lastmonthgpnl : "-₹"+ (-lastmonthgpnl)}
                tcost={"₹"+lastmonthbrokerage}
                npnl={lastmonthnpnl >= 0 ? "+₹"+lastmonthnpnl : "-₹"+ (-lastmonthnpnl)}
                trades={lastmonthtrades}
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
                titlegpnl="Gross P&L "
                titletcost="Transaction Cost "
                titlenpnl="Net P&L "
                titletrades="# of Trades "
                gpnl={lastyeargpnl >= 0 ? "+₹"+ lastyeargpnl : "-₹"+ (-lastyeargpnl)}
                tcost={"₹"+lastyearbrokerage}
                npnl={lastyearnpnl >= 0 ? "+₹"+lastyearnpnl : "-₹"+ (-lastyearnpnl)}
                trades={lastyeartrades}
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