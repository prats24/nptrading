
import {useState, useEffect} from "react"
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";

// Data
import MockTraderPNLTWiseData from "./data/MockTraderPNLTWiseData";

const TableFour = () => {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [traderpnldata, setTraderPNLData] = useState([]);
    const { columns, rows } = MockTraderPNLTWiseData();
    let date = new Date();
    let valueInDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()-1).padStart(2, '0')}`
    let valueInStartDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    const [firstDate, setFirstDate] = useState(valueInStartDate);
    const [secondDate, setSecondDate] = useState(valueInDate);
    let totalPnl = 0;
    let totalnPnl = 0;
    let totalTransactionCost = 0;
    let totalTrade = 0;
    let totalTradingDays = 0;
    let totalPositiveTrader = 0;
    let totalNegativeTrader = 0;
   
    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/traderwisetraderpnlreport/${firstDate}/${secondDate}`)
        .then((res)=>{
          //console.log(res.data)
          setTraderPNLData(res.data);
        }).catch((err)=>{
            //window.alert("Server Down");
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
        //console.log(e.target.value);
      }
      function endDate(e){
        e.preventDefault();
        if(e.target.value < firstDate){
          window.alert("Please select a valid range");
          return;
        }
        setSecondDate(e.target.value)
        //console.log(e.target.value);
      }
    
    let tradername = [];
    let tradernpnl = [];
    //console.log(traderpnldata);
    traderpnldata?.map((elem)=>{
    let tpnl = {}
    tradername.push(elem._id);
    tradernpnl.push((elem.npnl).toFixed(0));

        totalPnl += elem.gpnl
        totalTransactionCost += elem.brokerage
        totalTrade += elem.trades
        totalnPnl += elem.npnl
        totalTradingDays += 1
        if(elem.npnl >= 0){
            totalPositiveTrader += 1
        }
        else{
            totalNegativeTrader += 1
        }
    const gpnlcolor = (elem.gpnl) >= 0 ? "success" : "error"
    //const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
    const npnlcolor = (elem.npnl) >= 0 ? "success" : "error"

    tpnl.trader = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem._id}
      </MDTypography>
    );
    tpnl.gpnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {(elem.gpnl) >= 0 ? "+₹" + (elem.gpnl).toFixed(0) : "-₹" + (-elem.gpnl).toFixed(0)}
        </MDTypography>
      );
    tpnl.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{(elem.brokerage).toFixed(0)}
      </MDTypography>
    );
    tpnl.npnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {(elem.npnl) >= 0 ? "+₹" + (elem.npnl).toFixed(0) : "-₹" + (-elem.npnl).toFixed(0)}
      </MDTypography>
    );
    tpnl.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.trades}
      </MDTypography>
    );

    rows.push(tpnl)

    })

    let totalgpnlcolor = totalPnl >= 0 ? "success" : "error"
    let totalnpnlcolor = totalnPnl >= 0 ? "success" : "error"

    return (

                <MDBox pt={1} pb={2}> 
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
                            <MDBox >
                                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:2, padding: 0.5, fontSize: 15}}>Trader Wise Company P&L Report (Mock)</Typography>
                            </MDBox>
                            <MDBox >
                                <Typography sx={{ margin: 2, padding: 0.5, backgroundColor:"#f0f2f5", borderRadius:2, fontSize: 15 }}>Start Date</Typography>
                                </MDBox>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 2, padding: 0.5 }} onChange={(e)=>{startDate(e)}} value={firstDate}/>
                        
                            <MDBox >
                                <Typography color="dark" sx={{ margin: 2, padding: 0.5, backgroundColor:"#f0f2f5", borderRadius:2, fontSize: 15 }}>End Date</Typography>
                                </MDBox>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 2, padding: 0.5 }} onChange={(e)=>{endDate(e)}} value={secondDate}/>
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
                                <MDTypography variant="h6" textAlign="center" py={1}>Green Traders (C)</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="success" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalPositiveTrader}</MDTypography>
                            </MDBox>
                            <MDBox >
                                <MDTypography variant="h6" textAlign="center" py={1}>Red Traders (C)</MDTypography>
                                <MDTypography variant="h6" textAlign="center" color="error" backgroundColor="#e0e1e5" borderRadius="5px" marginBottom="10px" py={1}>{totalNegativeTrader}</MDTypography>
                            </MDBox>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mt={7}>
                      <MDBox mb={3}>
                        <ReportsBarChart
                          color="warning"
                          colorheight={"25rem"}
                          title="Traders Net P&L Trader Side (Mock)"
                          description={
                            <>
                              (<strong>+10%</strong>) increase than previous last 5 days.
                            </>
                          }
                          date="updated just now"
                          chart={
                            {
                              labels: tradername,
                              datasets: { label: "Net P&L", data: tradernpnl },
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
                                        Trader Wise P&L Trader Side (Mock)
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

export default TableFour;