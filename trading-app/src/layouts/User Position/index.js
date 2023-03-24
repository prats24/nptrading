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

function UserPosition() {
  const uId = uniqid();
  const getDetails = useContext(userContext);
  const [reRender, setReRender] = useState(true);

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
  const [buttonStates, setButtonStates] = useState({});

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


    // console.log("data", data.toUpperCase())

    if(data == ""){
      setInstrumentsData([])
      return;
    }


    axios.get(`${baseUrl}api/v1/tradableInstruments?search=${data}`, {
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
        console.log(data.message)
        
        
      }
      const id = instrument_token;
      const currentButtonState = buttonStates[id];
      setButtonStates({
        ...buttonStates,
        [id]: !currentButtonState,
      });
    } else{
      const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrument_token}`, {
        method: "PATCH",
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
      }
    }



  
    reRender ? setReRender(false) : setReRender(true);
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={1}>

        <MDBox sx={{backgroundColor:"#C0C0C0", display:"flex", borderRadius:2, marginBottom:2}}>
        <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" label="Search Symbol and add them to start trading" variant="outlined" type="text"
          sx={{margin: 0, padding : 1 ,width:"100%"}} onChange={(e)=>{sendSearchReq(e.target.value.toUpperCase())}}/>
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
            } //justifyContent = "space-around" border= "1px solid grey"
            const isAdded = buttonStates[id] || false;
            return(
              <>
                <Grid container lg={12} key={elem._id} sx={{fontSize:15}}  display="flex" gap="15px" alignItems="center" flexDirection="row" justifyContent="space-between" border="1px solid grey" padding="2px" >
                  <Grid lg={2.2}>{elem.name}</Grid>
                  <Grid lg={2.2}>{formattedDate}</Grid>
                  <Grid lg={2.2}>{elem.tradingsymbol}</Grid>
                  <Grid lg={2.2}>{elem.exchange}</Grid>
                  {perticularInstrumentData.length ?
                  <Grid lg={2.2}><MDButton size="small" onClick={()=>{subscribeInstrument(elem, "Remove")}}>Remove</MDButton></Grid>//{isAdded ? "Remove" : "Add"}
                  :
                  <Grid lg={2.2}><MDButton size="small" onClick={()=>{subscribeInstrument(elem, "Add")}}>Add</MDButton></Grid>
                  }
                  
                </Grid>
              </>
            )
          }))
        }
        </MDBox>
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
