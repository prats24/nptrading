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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "../../examples/Lists/ProfilesList";
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";
import Card from "@mui/material/Card";
// import DataTable from '../../../examples/Tables/DataTable';

// Overview page components
// import Header from "./components/Header";
// import PlatformSettings from "./components/PlatformSettings";

// Data
// import profilesListData from "./data/profilesListData";

// Images
import UserReportData from "./data/authorsTableData";
import DataTable from "../../examples/Tables/DataTable";
import UserReportProject from "./data/projectsTableData";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import {useState, useContext, useEffect} from "react"
import {userContext} from "../../AuthContext"
import axios from "axios";


function UserReport() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { columns, rows } = UserReportData();
  const { columns: pColumns, rows: pRows } = UserReportProject();

  let date = new Date();
  let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const [firstDate, setFirstDate] = useState(valueInDate);
  const [secondDate, setSecondDate] = useState(valueInDate);
  const getDetails = useContext(userContext);
  let [totalPnl, setPnl] = useState(0);
  let [totalTransactionCost, setCost] = useState(0);
  let [totalTrade, setTrade] = useState(0);
  let [totalTradingDays, setTradingDay] = useState(0);
  let [overallPnl, setOverallPnl] = useState([]);

  useEffect(()=>{
    pnlCalculation(valueInDate, valueInDate)
      totalPnl = 0;
      totalTransactionCost = 0;
      totalTrade = 0;
      totalTradingDays = 0;
      overallPnl = 0;
  },[getDetails])

  console.log(getDetails)

  function startDate(e){
    e.preventDefault();
    if(e.target.value > secondDate){
      window.alert("Please select a valid range");
      return;
    }
    setFirstDate(e.target.value)
    pnlCalculation(e.target.value, secondDate)
    totalPnl = 0;
    totalTransactionCost = 0;
    totalTrade = 0;
    totalTradingDays = 0;
    overallPnl = 0;
    console.log(e.target.value);
  }
  function endDate(e){
    e.preventDefault();
    if(e.target.value < firstDate){
      window.alert("Please select a valid range");
      return;
    }
    setSecondDate(e.target.value)
    pnlCalculation(firstDate, e.target.value)
    totalPnl = 0;
    totalTransactionCost = 0;
    totalTrade = 0;
    totalTradingDays = 0;
    overallPnl = 0;
    console.log(e.target.value);
  }

  function pnlCalculation(firstDate, secondDate){
    axios.get(`${baseUrl}api/v1/getuserreportdatewise/${getDetails.userDetails.email}/${firstDate}/${secondDate}`)
    .then((res) => {
      let data = res.data;
      let hash = new Map();

      for (let i = data.length - 1; i >= 0; i--) {
          if (hash.has(data[i]._id.date)) {
              let obj = hash.get(data[i]._id.date);
              if (data[i]._id.buyOrSell === "BUY") {
                  if (obj.totalBuy === undefined || obj.totalBuyLot === undefined) {
                      obj.totalBuy = Number(data[i].amount)
                      obj.totalBuyLot = (Number(data[i].lots))
                  } else {
                      obj.totalBuy = obj.totalBuy + Number(data[i].amount)
                      obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].lots))
                  }

                  obj.brokerage += data[i].brokerage;
                  obj.noOfTrade = data[i].noOfTrade;

              } if (data[i]._id.buyOrSell === "SELL") {
                  if (obj.totalSell === undefined || obj.totalSellLot === undefined) {

                      obj.totalSell = Number(data[i].amount)
                      obj.totalSellLot = (Number(data[i].lots))
                  } else {

                      obj.totalSell = obj.totalSell + Number(data[i].amount)
                      obj.totalSellLot = obj.totalSellLot + (Number(data[i].lots))
                  }

                  obj.brokerage += data[i].brokerage;
                  obj.noOfTrade = data[i].noOfTrade;

              }
          } else {
              if (data[i]._id.buyOrSell === "BUY") {
                  hash.set(data[i]._id.date, {
                      totalBuy: Number(data[i].amount),
                      totalBuyLot: (Number(data[i].lots)),
                      totalSell: 0,
                      totalSellLot: 0,
                      date: data[i]._id.date,
                      brokerage: data[i].brokerage,
                      noOfTrade: data[i].noOfTrade,
                  })
              } if (data[i]._id.buyOrSell === "SELL") {
                  hash.set(data[i]._id.date, {
                      totalSell: Number(data[i].amount),
                      totalSellLot: (Number(data[i].lots)),
                      totalBuy: 0,
                      totalBuyLot: 0,
                      date: data[i]._id.date,
                      brokerage: data[i].brokerage,
                      noOfTrade: data[i].noOfTrade,
                  })
              }
          }
      }

      console.log(hash)
      
      let pnlArr = []
      for (let value of hash.values()) {
        pnlArr.push(value);
      }

      setOverallPnl(pnlArr)

      console.log(overallPnl)

      pnlArr.map((elem, index) => {

        totalPnl += (elem.totalBuy + elem.totalSell)
        totalTransactionCost += elem.brokerage;
        totalTrade += elem.noOfTrade
        totalTradingDays += 1
      })
      setPnl(totalPnl); setCost(totalTransactionCost); setTrade(totalTrade); setTradingDay(totalTradingDays)
      console.log(totalPnl, totalTransactionCost, totalTrade, totalTradingDays)


    }).catch((err) => {
        return new Error(err);
    })
  }

  const totalpnlcolor = -totalPnl >= 0 ? "success" : "error"
  const totalnpnlcolor = ((-totalPnl)-totalTransactionCost) >= 0 ? "success" : "error"
  console.log(overallPnl)

  overallPnl.sort((a, b) => {
    // let first = a.date.split("-")
    // a.date = `${first[2]}-${first[1]}-${first[0]}`

    // let second = a.date.split("-")
    // b.date = `${second[2]}-${second[1]}-${second[0]}`

    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
        return 1;
    }
    return 0;
  });

  let graphdatearray = []
  let graphbrokeragearray = []

  overallPnl.map((elem)=>{
    let obj={}
    let updatedValue = (-(elem.totalBuy+elem.totalSell));

    const gpnlcolor = -(elem.totalBuy+elem.totalSell) >= 0 ? "success" : "error"
    const npnlcolor = -((elem.totalBuy+elem.totalSell)-(elem.brokerage)) >= 0 ? "success" : "error"
    obj.name = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {getDetails.userDetails.name}
      </MDTypography>
    );
    obj.date = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {elem.date}
      </MDTypography>
    );
    obj.grossPnl = (
      <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
        {updatedValue > 0.00 ? "+₹" + (updatedValue.toFixed(0)): "-₹" + ((-updatedValue).toFixed(0))}
      </MDTypography>
    );
    obj.brokerage = (
      <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
        {"₹"+(elem.brokerage).toFixed(0)}
      </MDTypography>
    );
    obj.netPnl = (
      <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
        {/* {((updatedValue)-(elem.brokerage)).toFixed(0)} */}
        {((updatedValue)-(elem.brokerage)) > 0.00 ? "+₹" + (((updatedValue)-(elem.brokerage)).toFixed(0)): "-₹" + ((-((updatedValue)-(elem.brokerage))).toFixed(0))}
      </MDTypography>
    );
    obj.noOfTrade = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {elem.noOfTrade}
      </MDTypography>
    );
    obj.lotUsed = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {Math.abs(elem.totalBuyLot)+Math.abs(elem.totalSellLot)}
      </MDTypography>
    );

    graphdatearray.push(elem.date);
    graphbrokeragearray.push(elem.brokerage);
    rows.push(obj);
    
  })

  console.log(rows)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} >
            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Start Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
           
              <MDBox >
                <Typography color="dark" sx={{ margin: 1, padding: 1, fontSize: 19 }}>End Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} onChange={(e)=>{endDate(e)}} value={secondDate}/>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} xl={12} >
            <Card sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', marginTop: 1 }}>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" color={totalpnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalPnl >= 0 ? "+₹" + totalPnl.toFixed(0) : "-₹" + (-totalPnl).toFixed(0)}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Transaction Cost</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>₹{totalTransactionCost.toFixed(2)}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Net P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" color={totalnpnlcolor} py={1}>{(totalPnl-totalTransactionCost) >= 0 ? "+₹" + (totalPnl-totalTransactionCost).toFixed(0) : "-₹" + -(totalPnl-totalTransactionCost).toFixed(0)}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Total Trades</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalTrade}</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" textAlign="center" py={1}>Trading Days</MDTypography>
                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalTradingDays}</MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <MDBox pt={6} pb={3}>

      <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={6}>
                <ReportsBarChart
                  color="success"
                  colorheight="12.5rem"
                  title="Transaction Cost"
                  // description={
                  //   <>
                  //     (<strong>+20%</strong>) increase than previous last 5 days.
                  //   </>
                  // }
                  date="updated just now"
                  chart={{
                    labels: graphdatearray,
                    datasets: { label: "Transaction Cost", data: graphbrokeragearray },
                  }}
                />
              </MDBox>
            </Grid>

        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={1}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{
                  display: 'flex',
                  justifyContent: "space-between",
                }}>

                <MDTypography variant="h6" color="white" py={1}>
                  Reports
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserReport;
