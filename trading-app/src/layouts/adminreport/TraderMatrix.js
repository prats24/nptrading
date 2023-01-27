
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
import TraderMatrix from "./data/TraderMatrixData";

const TableThree = () => {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [traderpnldata, setTraderPNLData] = useState([]);
    const { columns, rows } = TraderMatrix();
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
    let [totalPositiveTrader, setTotalPositiveTrader] = useState(0);
    let [totalNegativeTrader, setNegativeTrader] = useState(0);
    let [totalPositivePnl, setTotalPositivePnl] = useState(0);
    let [totalNegativePnl, setNegativePnl] = useState(0);
    let [overallPnl, setOverallPnl] = useState([]);
    //console.log("Dates: "+firstDate,secondDate)
    //console.log(`${baseUrl}api/v1/tradermatrixpnlreport/${firstDate}/${secondDate}`)
   
    useEffect(()=>{
        //console.log(`${baseUrl}api/v1/tradermatrixpnlreport/${firstDate}/${secondDate}`)
        axios.get(`${baseUrl}api/v1/tradermatrixpnlreport/${firstDate}/${secondDate}`)
        .then((res)=>{
          //console.log(res.data)
          setTraderPNLData(res.data);
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
    let traderpnl = [];
    let tradermatrix = [];
    let createdBy = '';
    //console.log(traderpnldata);

    //New code for hash map of traders

    let hash = new Map();

    for (let i = traderpnldata.length - 1; i >= 0; i--) {
        if (hash.has(traderpnldata[i]._id.createdBy)) {
            let obj = hash.get(traderpnldata[i]._id.createdBy);    
                if(traderpnldata[i].gpnl >= 0) {           
                  obj.PositivePnl += traderpnldata[i].gpnl
                }
                else{
                obj.NegativePnl += traderpnldata[i].gpnl
                }
                if(traderpnldata[i].gpnl >= 0) {           
                  obj.GreenDays += 1
                }
                else{
                obj.RedDays += 1
                }
                obj.TradingDays += 1
                obj.Brokerage += traderpnldata[i].brokerage
                obj.LifetimeGPnl += traderpnldata[i].gpnl
                obj.LifetimeNPnl += Number(traderpnldata[i].npnl)
                //console.log("LTNPNL: "+obj.LifetimeNPnl,traderpnldata[i].npnl);
          } else {
            hash.set(traderpnldata[i]._id.createdBy, {
              createdBy: traderpnldata[i]._id.createdBy,
              PositivePnl : traderpnldata[i].gpnl >= 0 ? traderpnldata[i].gpnl : 0,
              NegativePnl : traderpnldata[i].gpnl >= 0 ? 0 : traderpnldata[i].gpnl,
              GreenDays : traderpnldata[i].gpnl >= 0 ? 1 : 0,
              RedDays : traderpnldata[i].gpnl >= 0 ? 0 : 1,
              Brokerage : traderpnldata[i].brokerage,
              TradingDays : 1, 
              LifetimeGPnl : traderpnldata[i].gpnl, 
              LifetimeNPnl : traderpnldata[i].npnl 
          })
          }
    }

    //console.log(hash)
    
    let pnlmatrixArr = []
    for (let value of hash.values()) {
      pnlmatrixArr.push(value);
    }

    //console.log("PNL Matrix Array: "+pnlmatrixArr[0]);


    //Code Ends

    traderpnldata?.map((elem)=>{
    
    tradername.push(elem._id);
    tradernpnl.push((elem.npnl).toFixed(0));

        totalPnl += elem.gpnl
        totalTransactionCost += elem.brokerage
        totalTrade += elem.trades
        totalnPnl += elem.npnl
        

    tradermatrix.push(JSON.parse(JSON.stringify({totalPositivePnl,totalNegativePnl,createdBy})))
    })
    
    //console.log(tradermatrix);
    
    //Sorting the array based on ratio
    pnlmatrixArr.sort((a, b) => {
      if (Math.abs(a.NegativePnl/a.PositivePnl) < Math.abs(b.NegativePnl/b.PositivePnl)) {
        return 1;
      }
      if (Math.abs(a.NegativePnl/a.PositivePnl) > Math.abs(b.NegativePnl/b.PositivePnl)) {
          return -1;
      }
      return 0;
    });
    let chartratiovalue = [];
    let charttradername = [];
    let chartprobableavgpnl = [];
    pnlmatrixArr?.map((elem)=>{
    let tpnl = {}
    totalTradingDays += 1
    if(elem.LifetimeGPnl >= 0){
      totalPositiveTrader += 1
    }
    else{
      totalNegativeTrader += 1
    }
    const npnlcolor = (elem.LifetimeNPnl) >= 0 ? "success" : "error"
    const gpnlcolor = (elem.LifetimeGPnl) >= 0 ? "success" : "error"
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][elem.dayOfWeek-1];
    let probableavgpnl = ((elem.RedDays/elem.TradingDays)*elem.NegativePnl + (elem.GreenDays/elem.TradingDays)*elem.PositivePnl)
    let ratio = 0;
    const probableavgpnlcolor = probableavgpnl >= 0 ? "success" : "error"
    let averagereddaysgpnl = elem.RedDays != 0 ? elem.NegativePnl/elem.RedDays : 0
    const averagereddaysgpnlcolor = averagereddaysgpnl >= 0 ? "success" : "error"
    
    if(elem.GreenDays == 0){
      ratio = 0;
    }
    else{
      ratio = Math.abs(elem.NegativePnl/elem.PositivePnl);
    }
    chartratiovalue.push(ratio)
    charttradername.push(elem.createdBy)
    chartprobableavgpnl.push(probableavgpnl.toFixed(0))

    tpnl.trader = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdBy}
      </MDTypography>
    );
    tpnl.ltgpnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {(elem.LifetimeGPnl) >= 0 ? "+₹" + (elem.LifetimeGPnl).toFixed(0) : "-₹" + (-elem.LifetimeGPnl).toFixed(0)}
      </MDTypography>
    );
    tpnl.ltnpnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {(elem.LifetimeNPnl) >= 0 ? "+₹" + (elem.LifetimeNPnl).toFixed(0) : "-₹" + (-elem.LifetimeNPnl).toFixed(0)}
      </MDTypography>
    );
    tpnl.cpgpnl = (
        <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
          {(elem.PositivePnl) >= 0 ? "+₹" + (elem.PositivePnl).toFixed(0) : "-₹" + (-elem.PositivePnl).toFixed(0)}
        </MDTypography>
      );
    tpnl.cngpnl = (
      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
        {(elem.NegativePnl) >= 0 ? "+₹" + (elem.NegativePnl).toFixed(0) : "-₹" + (-elem.NegativePnl).toFixed(0)}
      </MDTypography>
    );
    tpnl.ratio = (
      <MDTypography component="a" variant="caption" color={npnlcolor} backgroundColor="#f0f2f5" borderRadius={2} padding={1} fontWeight="medium">
        {ratio.toFixed(2)}
      </MDTypography>
    );
    tpnl.probablepnl = (
      <MDTypography component="a" variant="caption" color={probableavgpnlcolor} backgroundColor="#f0f2f5" borderRadius={2} padding={1} fontWeight="medium">
        {probableavgpnl >= 0 ? "+₹" + probableavgpnl.toFixed(0) : "-₹" + (-probableavgpnl).toFixed(0)}
      </MDTypography>
    );
    tpnl.tradingdays = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.TradingDays}
      </MDTypography>
    );
    tpnl.preddays = (
      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
        {((elem.RedDays/elem.TradingDays)*100).toFixed(0)}%
      </MDTypography>
    );
    tpnl.pgreendays = (
      <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
       {((elem.GreenDays/elem.TradingDays)*100).toFixed(0)}%
      </MDTypography>
    );
    tpnl.reddays = (
      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
        {elem.RedDays}
      </MDTypography>
    );
    tpnl.greendays = (
      <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
        {elem.GreenDays}
      </MDTypography>
    );
    tpnl.areddaysgpnl = (
      <MDTypography component="a" variant="caption" color={averagereddaysgpnlcolor} fontWeight="medium">
        {averagereddaysgpnl >= 0 ? "+₹" + averagereddaysgpnl.toFixed(0) : "-₹" + (-averagereddaysgpnl).toFixed(0)}
      </MDTypography>
    );
    //console.log(typeof(tpnl));
    //console.log(tpnl)
    //companypnl.push(cpnl)
    //console.log(traderpnl)
    rows.push(tpnl)

    })

    let totalgpnlcolor = totalPnl >= 0 ? "success" : "error"
    let totalnpnlcolor = totalnPnl >= 0 ? "success" : "error"
    const firstDateFormat = `${String(new Date(firstDate).getDate()).padStart(2, '0')}-${String(new Date(firstDate).getMonth() + 1).padStart(2, '0')}-${(new Date(firstDate).getFullYear())}`
    const secondDateFormat = `${String(new Date(secondDate).getDate()).padStart(2, '0')}-${String(new Date(secondDate).getMonth() + 1).padStart(2, '0')}-${(new Date(secondDate).getFullYear())}`

    return (

                <MDBox pt={6} pb={2}> 
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
                            <MDBox >
                                <Typography sx={{ margin: 2, marginRight:10, backgroundColor:"#f0f2f5", borderRadius:4, padding: 1, fontSize: 19}}>Trader Metrics (Mock)</Typography>
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
                          color="info"
                          colorheight={"25rem"}
                          title={`Trader Metrics (Mock) for the period ${firstDateFormat} to ${secondDateFormat}`}
                          description={
                            <>
                              (<strong>Ratio of red days to green days of Gross P&L</strong>)
                            </>
                          }
                          date="Look for the traders with ratio > 1"
                          chart={
                            {
                              labels: charttradername,
                              datasets: { label: "Ratio", data: chartratiovalue },
                            }
                          }
                        />
                        </MDBox>
                        </Grid> 

                        <Grid item xs={12} md={6} lg={12} mt={7}>
                      <MDBox mb={3}>
                        <ReportsBarChart
                          color="error"
                          colorheight={"25rem"}
                          title={`Trader Metrics (Mock) for the period ${firstDateFormat} to ${secondDateFormat}`}
                          description={
                            <>
                              (<strong>Probable average daily Gross P&L</strong>)
                            </>
                          }
                          date="Look for the traders with low average daily Gross P&L"
                          chart={
                            {
                              labels: charttradername,
                              datasets: { label: "Gross P&L", data: chartprobableavgpnl },
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
                                        Trader Metrics (Mock) for the period {firstDateFormat} to {secondDateFormat}
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

export default TableThree;