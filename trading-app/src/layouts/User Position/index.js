import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import uniqid from "uniqid"
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';




// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";


// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";

// Dashboard components

import InstrumentDetails from "./components/InstrumentDetails";
import OverallPL from "./OverallP&L/Overall P&L";
import OverallGrid from "./OverallP&L/OverallGrid";
import MarginGrid from "./MarginDetails/MarginGrid";
import TradableInstrument from "./components/TradableInstrument/TradableInstrument";
import { userContext } from "../../AuthContext";
import BuyModel from "./components/InstrumentDetails/data/BuyModel";
import SellModel from "./components/InstrumentDetails/data/SellModel";
import MDSnackbar from "../../components/MDSnackbar";



function UserPosition() {
  
  const theme = createTheme({
    components: {
      MuiGrid: {
        styleOverrides: {
          root: {
            color: 'white',
          },
        },
      },
    },
  });

  const uId = uniqid();
  const getDetails = useContext(userContext);
  const [reRender, setReRender] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  const [userInstrumentData, setUserInstrumentData] = useState([]);
  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("hi", true)
    })
    socket.on("noToken", (data) => {
      window.alert(data);
    })
    socket.on("wrongToken", (data) => {
      window.alert(data);
    })

  }, []);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getInstrument/${getDetails.userDetails._id}`)
    .then((res) => {
        //console.log("live price data", res)
        setUserInstrumentData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender])

  const [instrumentsData, setInstrumentsData] = useState();

  // const [buttonStates, setButtonStates] = useState({});
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  let [addOrRemoveCheck, setAddOrRemoveCheck]  = useState();
  const PAGE_SIZE = 10;


  let timeoutId; // store the timeout id

  function sendSearchReq(data) {
    // clear previous timeout if there is one
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // set a new timeout to send the request after 1 second
    timeoutId = setTimeout(() => {
      sendRequest(data);
    }, 1000);
  }

  function sendRequest(data){

    if(data == ""){
      setInstrumentsData([])
      return;
    }


    axios.get(`${baseUrl}api/v1/tradableInstruments?search=${data}&page=${page}&size=${PAGE_SIZE}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      console.log("instrumentData", res.data)
      setInstrumentsData(res.data)


    }).catch((err)=>{
      console.log(err);
    })

  }

  async function subscribeInstrument(instrumentData, addOrRemove){
    const {instrument_token, tradingsymbol, name, strike, lot_size, instrument_type, exchange, expiry} = instrumentData

    if(addOrRemove === "Add"){
      setAddOrRemoveCheck(true);
      console.log(instrumentData)
      const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          instrument: `${strike} ${instrument_type}`, exchange, status: "Active", symbol: tradingsymbol, lotSize: lot_size, instrumentToken: instrument_token, uId, contractDate: expiry, maxLot: 1800
        })
      });
    
      const data = await res.json();
      //console.log(data);
      if(data.status === 422 || data.error || !data){
          window.alert(data.error);
          // setInvalidDetail(`Email or Password is incorrect`);
      }else{
  
        // this function is extracting data of user who is logged in
        // await userDetail();
        openSuccessSB();
        console.log(data.message)
        
        
      }
      // const id = instrument_token;
      // const currentButtonState = buttonStates[id];
      // setButtonStates({
      //   ...buttonStates,
      //   [id]: !currentButtonState,
      // });
      
    } else{
      setAddOrRemoveCheck(false);
      const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrument_token}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
          isAddedWatchlist: false
        })
      });
  
      const permissionData = await response.json();
      console.log("remove", permissionData)
      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
          //console.log("Failed to Edit");
      }else {
        // window.alert(permissionData.massage);
          //console.log(permissionData);
          // window.alert("Edit succesfull");
          //console.log("Edit succesfull");
          openSuccessSB();
      }
      
    }

    reRender ? setReRender(false) : setReRender(true);
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage(page => page + 1);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // let title = "App " + appstatus
  // let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = addOrRemoveCheck ? "Added" : "Removed"
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      // title={title}
      content={content}
      // dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={1}>

        <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
        <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" label="Click here to search any symbol and add them in your watchlist to start trading" variant="outlined" type="text"
          sx={{margin: 0, padding : 1 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}} onChange={(e)=>{sendSearchReq(e.target.value.toUpperCase())}}/>
        <MDBox>
        { instrumentsData?.length > 0 &&
          (instrumentsData.map((elem)=>{
            let perticularInstrumentData = userInstrumentData.filter((subElem)=>{
              return subElem.instrumentToken === elem.instrument_token
            })
            const id = elem.instrument_token;
            const date = new Date(elem.expiry);
            const day = date.getDate();
            const options = { month: 'short' };
            const month = new Intl.DateTimeFormat('en-US', options).format(date);
            const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}`;

            function getOrdinalSuffix(day) {
              const suffixes = ['th', 'st', 'nd', 'rd'];
              const v = day % 100;
              return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
            } 
            return(
              <>
                <Grid container lg={12} key={elem._id}
                sx={{
                  fontSize:13,
                  display:"flex",
                  gap:"10px",
                  alignItems:"center",
                  flexDirection:"row",
                  justifyContent:"space-between",
                  border:"0.25px solid white",
                  borderRadius:2,
                  color:"white",
                  padding:"0.5px",
                  '&:hover': {
                    backgroundColor: 'lightgray',
                    cursor: 'pointer',
                    fontWeight: 600
                  }
                }}
                >
                  <Grid sx={{color:"white", textAlign:"center", display: { xs: 'none', lg: 'block' }}} xs={0} lg={2.2}>{elem.name}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{formattedDate}</Grid>
                  <Grid xs={5} lg={2.2}>{elem.tradingsymbol}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{elem.exchange}</Grid>
                  <Grid xs={5} lg={2} mr={4} display="flex" justifyContent="space-between">
                    <Grid><MDButton size="small" color="info" ml={1} onClick={()=>{subscribeInstrument(elem)}}>
                      B
                    </MDButton></Grid>
                    <Grid><MDButton size="small" color="error" ml={1} onClick={()=>{subscribeInstrument(elem)}}>
                      S
                    </MDButton></Grid>
                    {perticularInstrumentData.length ?
                    <Grid lg={2.2}><MDButton size="small" color="secondary" ml={1} onClick={()=>{subscribeInstrument(elem, "Remove")}}>-</MDButton></Grid>//{isAdded ? "Remove" : "Add"}
                    :
                    <Grid lg={2.2}><MDButton size="small" color="warning" ml={1} onClick={()=>{subscribeInstrument(elem, "Add")}}>+</MDButton></Grid>
                    }
                  </Grid>

                  {loading && <MDBox>Loading...</MDBox>}
                  {error && <MDBox>Error!</MDBox>}
                  
                </Grid>
                {renderSuccessSB}
              </>
            )
          }))
        }
        </MDBox>
        {/* <TradableInstrument instrumentsData={instrumentsData} reRender={reRender} setReRender={setReRender} uId={uId} /> */}
        </MDBox>
        </MDBox>

        <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <InstrumentDetails socket={socket} Render={{ reRender, setReRender }} />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
             <OverallGrid socket={socket} Render={{ reRender, setReRender }}/>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MarginGrid/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;
