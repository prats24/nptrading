import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon  from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import TimelineItem from "../../examples/Timeline/TimelineItem";
import MDTypography from "../../components/MDTypography";



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

function AdminDashboard() {
  const { pnl, pnlpoints } = reportsLineChartData;
  const {labels, datasets} = reportsBarChartData;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
 
    const [livegpnl, setliveGpnlarray] = useState([]);
    const [livenpnl, setliveNpnlarray] = useState([]);
    const [livebrokerage, setliveBrokeragearray] = useState([]);
    const [livepnldate, setlivePNLDatearray] = useState([]);

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
    const [LastFiveTradesarr, setLastFiveTradesarr] = useState([]);
    const [CreatedBy, setCreatedBy] = useState([]);
    const [Quantity, setQuantity] = useState([]);
    const [Type, setType] = useState([]);
    const [Symbol, setSymbol] = useState([]);
    const [TradeTime, setTradeTime] = useState([]);
    const [monthPNLData, setMonthPNLData] = useState([]);
    const [monthgpnl, setMonthGpnlarray] = useState([]);
    const [monthnpnl, setMonthNpnlarray] = useState([]);
    const [monthbrokerage, setMonthBrokeragearray] = useState([]);
    const [monthpnldate, setMonthPNLDatearray] = useState([]);
    const [livemonthgpnl, setliveMonthGpnlarray] = useState([]);
    const [livemonthnpnl, setliveMonthNpnlarray] = useState([]);
    const [livemonthbrokerage, setliveMonthBrokeragearray] = useState([]);
    const [livemonthpnldate, setliveMonthPNLDatearray] = useState([]);

    
    let dayname = [];
    let livedayname = [];

  //
   //This week pnl details code starts
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getmocktradecompanydetailsthisweek`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        //console.log((res.data).length !== 0);
          
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
          
          // setThisYesterdayPNLData(res.data) 
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
        //console.log("Last 5 days Chart Data: "+res.data);
        setPNLData(res.data) 
        for(let item of res.data)
        {
          setBrokeragearray((prev)=>{return[...prev,(item.brokerage).toFixed(0)]})
          setPNLDatearray((prev)=>{return[...prev,item._id.date]})
          setGpnlarray((prev)=>{return[...prev,(-item.amount).toFixed(0)]})
          setNpnlarray((prev)=>{return[...prev,((-item.amount)-item.brokerage).toFixed(0)]})
          
        }
    })

    axios.get(`${baseUrl}api/v1/getpnllivetradecompanylastfivedays`)
    .then((res)=>{
        //console.log("Last 5 days Chart Data Live: "+res.data);
        setPNLData(res.data) 
        for(let item of res.data)
        {
          setliveBrokeragearray((prev)=>{return[...prev,(item.brokerage).toFixed(0)]})
          setlivePNLDatearray((prev)=>{return[...prev,item._id.date]})
          setliveGpnlarray((prev)=>{return[...prev,(-item.amount).toFixed(0)]})
          setliveNpnlarray((prev)=>{return[...prev,((-item.amount)-item.brokerage).toFixed(0)]})
          
        }
    })

    axios.get(`${baseUrl}api/v1/getlastfivemocktradecompany`)
  .then((res)=>{
      //console.log(res.data)
      // setLastFiveTrades(res.data) 
      for(let item of res.data)
      {
        setLastFiveTradesarr(res.data)
        setCreatedBy((prev)=>{return[...prev,(item.createdBy)]})
        setQuantity((prev)=>{return[...prev,item.Quantity]})
        setType((prev)=>{return[...prev,item.buyOrSell]})
        setSymbol((prev)=>{return[...prev,item.symbol]})
        setTradeTime((prev)=>{return[...prev,item.trade_time]})
      }
  })

    axios.get(`${baseUrl}api/v1/getpnlmocktradecompanydailythismonth`)
    .then((res)=>{
        //console.log("This month Chart Data: "+res.data);
        setMonthPNLData(res.data) 
        for(let item of res.data)
        {
          setMonthBrokeragearray((prev)=>{return[...prev,(item.brokerage).toFixed(0)]})
          setMonthPNLDatearray((prev)=>{return[...prev,item._id.date]})
          setMonthGpnlarray((prev)=>{return[...prev,(-item.amount).toFixed(0)]})
          setMonthNpnlarray((prev)=>{return[...prev,((-item.amount)-item.brokerage).toFixed(0)]})
          
        }
    })

    axios.get(`${baseUrl}api/v1/getpnllivetradecompanydailythismonth`)
    .then((res)=>{
        //console.log("This month Chart Data live: "+res.data);
        setMonthPNLData(res.data) 
        for(let item of res.data)
        {
          setliveMonthBrokeragearray((prev)=>{return[...prev,(item.brokerage).toFixed(0)]})
          setliveMonthPNLDatearray((prev)=>{return[...prev,item._id.date]})
          setliveMonthGpnlarray((prev)=>{return[...prev,(-item.amount).toFixed(0)]})
          setliveMonthNpnlarray((prev)=>{return[...prev,((-item.amount)-item.brokerage).toFixed(0)]})
          
        }
    })


},[])

let monthpnldatestring = []
monthpnldate.map((elem)=>{
  // const date = new Date(elem);
  monthpnldatestring.push(elem.slice(-2));
})

let livemonthpnldatestring = []
livemonthpnldate.map((elem)=>{
  // const date = new Date(elem);
  livemonthpnldatestring.push(elem.slice(-2));
})

let datepartlivepnl = [];
livepnldate.map((elem)=>{
  // const date = new Date(elem);
  datepartlivepnl.push(elem.slice(-2));
})

let datepartpnl = [];
pnldate.map((elem)=>{
  // const date = new Date(elem);
  datepartpnl.push(elem.slice(-2));
})

pnldate.map((elem)=>{
  const date = new Date(elem);
  const dayOfWeek = date.getDay();
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  //console.log(weekday);  // Output: "Sunday"
  dayname.push(weekday.slice(0,3))
})

livepnldate.map((elem)=>{
  const date = new Date(elem);
  const dayOfWeek = date.getDay();
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  //console.log(weekday);  // Output: "Sunday"
  livedayname.push(weekday.slice(0,3))
})

 //Latest five orders code satrt

// useEffect(()=>{
//   axios.get(`${baseUrl}api/v1/getlastfivemocktradecompany`)
//   .then((res)=>{
//       //console.log(res.data)
//       setLastFiveTrades(res.data) 
//       for(let item of res.data)
//       {
//         setCreatedBy((prev)=>{return[...prev,(item.createdBy)]})
//         setQuantity((prev)=>{return[...prev,item.Quantity]})
//         setType((prev)=>{return[...prev,item.buyOrSell]})
//         setSymbol((prev)=>{return[...prev,item.symbol]})
//         setTradeTime((prev)=>{return[...prev,item.trade_time]})
//       }
//   })
// },[])

//console.log(LastFiveTradesarr);
// setCreatedBy(CreatedBy); && Symbol.length > 5 && 
if(Type.length != 0 ){
  let buysell1 = Type[0] == "BUY" ? "bought" : "sold"
  var title1 = `${CreatedBy[0]} ${buysell1} ${Math.abs(Quantity[0])} quantity of ${Symbol[0]}`
  var title1_time = String(TradeTime[0]).split(" ")
  title1_time = title1_time[1]
  //console.log(Symbol[0])
  

  let buysell2 = Type[1] == "BUY" ? "bought" : "sold"
  var title2 = `${CreatedBy[1]} ${buysell2} ${Math.abs(Quantity[1])} quantity of ${Symbol[1]}`
  var title2_time = String(TradeTime[1]).split(" ")
  title2_time = title2_time[1]
  //let instrumentcolor2 = Symbol[1].slice(-2) == "CE" ? "success" : "error"

  let buysell3 = Type[2] == "BUY" ? "bought" : "sold"
  var title3 = `${CreatedBy[2]} ${buysell3} ${Math.abs(Quantity[2])} quantity of ${Symbol[2]}`
  var title3_time = String(TradeTime[2]).split(" ")
  title3_time = title3_time[1]
  //let instrumentcolor3 = Symbol[2].slice(-2) == "CE" ? "success" : "error"

  let buysell4 = Type[3] == "BUY" ? "bought" : "sold"
  var title4 = `${CreatedBy[3]} ${buysell4} ${Math.abs(Quantity[3])} quantity of ${Symbol[3]}`
  var title4_time = String(TradeTime[3]).split(" ")
  title4_time = title4_time[1]
  //let instrumentcolor4 = Symbol[3].slice(-2) == "CE" ? "success" : "error"

  let buysell5 = Type[4] == "BUY" ? "bought" : "sold"
  var title5 = `${CreatedBy[4]} ${buysell5} ${Math.abs(Quantity[4])} quantity of ${Symbol[4]}`
  var title5_time = String(TradeTime[4]).split(" ")
  title5_time = title5_time[1]
}
// let instrumentcolor1 = Symbol[0].slice(-2) == "CE" ? "success" : "error"
// let instrumentcolor2 = Symbol[1].slice(-2) == "CE" ? "success" : "error"
// let instrumentcolor3 = Symbol[2].slice(-2) == "CE" ? "success" : "error"
// let instrumentcolor4 = Symbol[3].slice(-2) == "CE" ? "success" : "error"
// let instrumentcolor5 = Symbol[4].slice(-2) == "CE" ? "success" : "error"

//Code ends latest 5 orders

//chart data code ends


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>

      <MDBox mb={3}>
          <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  colorheight="12.5rem"
                  title="Last 5 days net p&l (Mock)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
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
                  colorheight="12.5rem"
                  title="Last 5 days Transaction Cost (Mock)"
                  description={
                    <>
                      (<strong>+20%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
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
                  colorheight="12.5rem"
                  title="Last 5 days gross p&l (Mock)"
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
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={1}>

          <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  colorheight="12.5rem"
                  title="Last 5 days net p&l (Live)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: datepartlivepnl,
                      datasets: { label: "Net P&L", data: livenpnl },
                    }
                  }
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  colorheight="12.5rem"
                  title="Last 5 days Transaction Cost (Live)"
                  description={
                    <>
                      (<strong>+20%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={{
                    labels: livedayname,
                    datasets: { label: "Transaction Cost", data: livebrokerage },
                  }}
                />
              </MDBox>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  colorheight="12.5rem"
                  title="Last 5 days gross p&l (Live)"
                  description={
                    <>
                      (<strong>+10%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: datepartlivepnl,
                      datasets: { label: "Gross P&L", data: livegpnl },
                    }
                  }
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mb={1}>
          <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  colorheight="25rem"
                  title="This month's daily net p&l (Mock)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: monthpnldatestring,
                      datasets: { label: "Net P&L", data: monthnpnl },
                    }
                  }
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mb={1} mt={3}>
          <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  colorheight="25rem"
                  title="This month's daily net p&l (Live)"
                  description={
                    <>
                      (<strong>+15%</strong>) increase than previous last 5 days.
                    </>
                  }
                  date="updated yesterday"
                  chart={
                    {
                      labels: livemonthpnldatestring,
                      datasets: { label: "Net P&L", data: livemonthnpnl },
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
                titletcost="Trans. Cost "
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
            <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Latest Orders (Today)
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              130
            </MDTypography>{" "}
            orders so far
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        { title1 ?
          <>
        <TimelineItem
          color="success"
          icon="notifications"
          title= {title1}
          dateTime={title1_time}
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title={title2}
          dateTime={title2_time}
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title={title3}
          dateTime={title3_time}
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title={title4}
          dateTime={title4_time}
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title={title5}
          dateTime={title5_time}
          lastItem
        />
        </> :
                <MDTypography variant="h6" fontWeight="small" verticalAlign="middle" horizontalAlign="middle">
                
              </MDTypography>}
      </MDBox>
    </Card>
            </Grid>
          </Grid>
        </MDBox>
        
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminDashboard;