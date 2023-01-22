
import {useState, useEffect} from "react"
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import Header from "./Header";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";

// Data
import MockCompanyPNLData from "./data/MockCompanyPNLData";

const TableOne = () => {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [companypnldata, setCompanyPNLData] = useState([]);
    const { columns, rows } = MockCompanyPNLData();
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    let valueInStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    const [firstDate, setFirstDate] = useState(valueInStartDate);
    const [secondDate, setSecondDate] = useState(valueInDate);
    let [totalPnl, setPnl] = useState(0);
    let [totalnPnl, setnPnl] = useState(0);
    let [totalTransactionCost, setCost] = useState(0);
    let [totalTrade, setTrade] = useState(0);
    let [totalTradingDays, setTradingDay] = useState(0);
    let [totalGreenDays, setGreenDays] = useState(0);
    let [totalRedDays, setRedDays] = useState(0);
    let [greenDaysPnl, setGreenDaysPnl] = useState(0);
    let [redDaysPnl, setRedDaysPnl] = useState(0);
    let [greenDaysAvgPnl, setGreenDaysAvgPnl] = useState(0);
    let [redDaysAvgPnl, setRedDaysAvgPnl] = useState(0);
    let [overallPnl, setOverallPnl] = useState([]);
    console.log("Dates: "+firstDate,secondDate)
    console.log(`${baseUrl}api/v1/companypnlreport/${firstDate}/${secondDate}`)
   
    useEffect(()=>{
        console.log(`${baseUrl}api/v1/companypnlreport/${firstDate}/${secondDate}`)
        axios.get(`${baseUrl}api/v1/companypnlreport/${firstDate}/${secondDate}`)
        .then((res)=>{
          console.log(res.data)
          setCompanyPNLData(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[firstDate,secondDate])
  
    

    function startDate(e){
        e.preventDefault();
        if(e.target.value > secondDate){
          window.alert("Please select a valid range");
          return;
        }
        setFirstDate(e.target.value)
        console.log(e.target.value);
      }
      function endDate(e){
        e.preventDefault();
        if(e.target.value < firstDate){
          window.alert("Please select a valid range");
          return;
        }
        setSecondDate(e.target.value)
        console.log(e.target.value);
      }
    
    let pnldate = [];
    let companynpnl = [];
    let companypnl = [];
    console.log(companypnldata);
    companypnldata?.map((elem)=>{
    let cpnl = {}
    pnldate.push(elem._id.date);
    companynpnl.push((elem.npnl).toFixed(0));
        totalPnl += elem.gpnl
        totalTransactionCost += elem.brokerage
        totalTrade += elem.trades
        totalnPnl += elem.npnl
        totalTradingDays += 1
        if(elem.npnl >= 0){
          totalGreenDays += 1
          greenDaysPnl += elem.npnl
          }
          else{
              totalRedDays += 1
              redDaysPnl += elem.npnl
          }
        greenDaysAvgPnl = (greenDaysPnl/totalGreenDays).toFixed(0);
        redDaysAvgPnl = (redDaysPnl/totalRedDays).toFixed(0);
    const gpnlcolor = (elem.gpnl) >= 0 ? "success" : "error"
    const npnlcolor = (elem.npnl) >= 0 ? "success" : "error"
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem.dayOfWeek-1];

    cpnl.date = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem._id.date}
      </MDTypography>
    );
    cpnl.weekday = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {weekday}
        </MDTypography>
      );
    cpnl.gpnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {(elem.gpnl) >= 0 ? "+₹" + (elem.gpnl).toFixed(0) : "-₹" + (-elem.gpnl).toFixed(0)}
      </MDTypography>
    );
    cpnl.tcost = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{elem.brokerage.toFixed(0)}
      </MDTypography>
    );
    cpnl.npnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {(elem.npnl) >= 0 ? "+₹" + (elem.npnl).toFixed(0) : "-₹" + (-elem.npnl).toFixed(0)}
      </MDTypography>
    );
    cpnl.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.trades}
      </MDTypography>
    );
    console.log(typeof(cpnl));
    console.log(cpnl)
    //companypnl.push(cpnl)
    console.log(companypnl)
    rows.push(cpnl)

    })

    let totalgpnlcolor = totalPnl >= 0 ? "success" : "error"
    let totalnpnlcolor = totalnPnl >= 0 ? "success" : "error"

    return (

                <MDBox pt={6} pb={2}> 
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
                            <MDBox >
                                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:4, padding: 1, fontSize: 19}}>Company Day Wise P&L Report (Mock)</Typography>
                            </MDBox>
                            <MDBox >
                                <Typography sx={{ margin: 2, padding: 1, backgroundColor:"#f0f2f5", borderRadius:4, fontSize: 19 }}>Start Date</Typography>
                                </MDBox>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 2, padding: 1 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
                        
                            <MDBox >
                                <Typography color="dark" sx={{ margin: 2, padding: 1, backgroundColor:"#f0f2f5", borderRadius:4, fontSize: 19 }}>End Date</Typography>
                                </MDBox>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 2, padding: 1 }} onChange={(e)=>{endDate(e)}} value={secondDate}/>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={12} xl={12} >
                            <Card sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', marginTop: 1 }}>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Gross P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color={totalgpnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalPnl >= 0 ? "+₹" + totalPnl.toFixed(0) : "-₹" + (-totalPnl).toFixed(0)}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>Transaction Cost</MDTypography>
                                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>₹{totalTransactionCost.toFixed(2)}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>&nbsp;&nbsp;&nbsp;&nbsp;Net P&L&nbsp;&nbsp;&nbsp;&nbsp;</MDTypography>
                                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" color={totalnpnlcolor} py={1}>{(totalnPnl) >= 0 ? "+₹" + (totalnPnl).toFixed(0) : "-₹" + -(totalnPnl).toFixed(0)}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>Total Trades</MDTypography>
                                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalTrade}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>Trading Days</MDTypography>
                                <MDTypography variant="h6" textAlign="center" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalTradingDays}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>(+)Days</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="success" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalGreenDays}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>(-)Days</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="error" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalRedDays}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>(+)Days Avg Net P&L</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="success" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{"+₹" + greenDaysAvgPnl}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>(-)Days Avg Net P&L</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="error" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{"-₹" + (-redDaysAvgPnl)}</MDTypography>
                            </MDBox>
                            </Card>
                        </Grid>
                    </Grid>

                     <Grid item xs={12} md={6} lg={12} mt={7}>
                      <MDBox mb={3}>
                        <ReportsLineChart
                          color="success"
                          colorheight={"25rem"}
                          title="Company Net P&L (Mock)"
                          description={
                            <>
                              (<strong>+10%</strong>) increase than previous last 5 days.
                            </>
                          }
                          date="updated yesterday"
                          chart={
                            {
                              labels: pnldate,
                              datasets: { label: "Net P&L", data: companynpnl },
                            }
                          }
                        />
                      </MDBox>
                    </Grid> 

                    <Grid container spacing={6} mt={1}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Company Day Wise P&L (Mock)
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns, rows }}
                                        showTotalEntries={false}
                                        isSorted={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox> 
    )
}

export default TableOne;