import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import uniqid from "uniqid"
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import {ListItem} from "@material-ui/core"
import Paper from '@mui/material/Paper';
import MDButton from "../../components/MDButton";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import IconButton from '@material-ui/core/IconButton';




// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";

// Dashboard components

import InstrumentDetails from "./components/InstrumentDetails";
import OverallPL from "./OverallP&L/Overall P&L";
import OverallGrid from "./OverallP&L/OverallGrid";
import MarginGrid from "./MarginDetails/MarginGrid";
import TradableInstrument from "./components/TradableInstrument/TradableInstrument";
import { Typography } from "@mui/material";

function UserPosition() {

  const uId = uniqid();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
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

  const [instrumentsData, setInstrumentsData] = useState();
  const [reRender, setReRender] = useState(true);
  const [text, setText] = useState('');
  const textRef = useRef(null);


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

  function writeText() {
    textRef.current.focus();
    setText('17300CE');
    sendSearchReq('17300CE');
  }

  function handleClear() {
    setText('');
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

  async function subscribeInstrument(instrumentData){
    const {instrument_token, tradingsymbol, name, strike, lot_size, instrument_type, exchange, expiry} = instrumentData
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

    reRender ? setReRender(false) : setReRender(true);
  }

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 40,
    lineHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0}>

        <MDBox mb={0} mt={0}>
        <Grid container spacing={3}>
          {[lightTheme].map((theme, index) => (
            <Grid item xs={12} key={index} >
              <ThemeProvider theme={theme}>
                <MDBox
                  sx={{
                    p: 1,
                    pb:2,
                    // bgcolor: 'background.default',
                    bgcolor: 'none',
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr 1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {[{elevation:2,instrument:'NIFTY 50',ltp:16000,percentageChange:20,valueChange:120},{elevation:2,instrument:'BANKNIFTY',ltp:38000,percentageChange:-25,valueChange:-134}].map((e) => (
                    <Item key={e.elevation} elevation={e.elevation}>           
                      <MDBox m={0.5} fontWeight={700}>{e.instrument}</MDBox>
                      <MDBox m={0.5} fontWeight={700}>{e.ltp}</MDBox>
                      <MDBox ml={0.5} fontWeight={700} mr={0.5} mt={0.5} mb={0.2} fontSize={10} color={e.valueChange > 0 ? "success" : "error"}>{e.valueChange>0 ? '+' : ''}{e.valueChange}</MDBox>
                      <MDBox ml={0.5} fontWeight={700} mr={0.5} mt={0.5} mb={0.2} fontSize={10} color={e.percentageChange > 0 ? "success" : "error"}>({e.percentageChange>0 ? '+' : ''}{e.percentageChange}%)</MDBox>
                    </Item>
                  ))}
                    <Item elevation={2}>           
                      <MDBox m={0.5} fontWeight={700}>P&L:</MDBox>
                      <MDBox m={0.5} fontWeight={700}>+12,300</MDBox>
                    </Item>
                </MDBox>
              </ThemeProvider>
            </Grid>
          ))}

        </Grid>

        </MDBox>

        <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
        <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" 
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined" 
          type="text"
          placeholder="Click here to search any symbol and add them in your watchlist to start trading"
          value={text}
          inputRef={textRef}
          InputProps={{
            onFocus: () => textRef.current.select(),
            endAdornment: (
              <MDButton variant="text" color="dark" onClick={handleClear}>{text && <RxCross2/>}</MDButton>
            ),
            startAdornment: (
              <>{<AiOutlineSearch/>}</>
            ),
          }}
          sx={{margin: 0, background:"white",padding : 0, borderRadius:2 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}} onChange={(e)=>{setText(e.target.value);sendSearchReq(e.target.value.toUpperCase())}}
          />
        <MDBox>
        { instrumentsData?.length > 0 &&
          (instrumentsData.map((elem)=>{
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
            return(
              
              <>
              {text && (
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
                    <Grid><MDButton size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem)}}>B</MDButton></Grid>
                    <Grid><MDButton size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem)}}>S</MDButton></Grid>
                    <Grid><MDButton size="small" color="warning" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem)}}>+</MDButton></Grid>
                  </Grid>
                  
                </Grid>
                )}
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
              <InstrumentDetails socket={socket} Render={{ reRender, setReRender }} handleClick={writeText} />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
             <OverallGrid socket={socket} Render={{ reRender, setReRender }} handleClick={writeText}/>
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
