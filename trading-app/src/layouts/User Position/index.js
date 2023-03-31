import React, { useEffect, useState, useRef,useContext } from "react";
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
import Paper from '@mui/material/Paper';
import MDButton from "../../components/MDButton";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';





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
import { userContext } from "../../AuthContext";
import BuyModel from "./components/InstrumentDetails/data/BuyModel";
import SellModel from "./components/InstrumentDetails/data/SellModel";
import MDSnackbar from "../../components/MDSnackbar";



function UserPosition() {

  const uId = uniqid();
  const getDetails = useContext(userContext);
  const [reRender, setReRender] = useState(true);
  let [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [instrumentsData, setInstrumentsData] = useState([]);
  const [buttonStates, setButtonStates] = useState({});
  const [userInstrumentData, setUserInstrumentData] = useState([]);
  const [text,setText] = useState('');

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

      // const intervalId = setInterval(() => {
      //   if(PAGE_SIZE == page){
      //     clearInterval(intervalId);
      //   }
        
      //   setLoading(true);

        sendRequest(data)
        
      // }, 500);
  

      
  

      
    }, 1000);
  }

  let textRef = useRef(null);
  function writeText() {
    textRef.current.focus();
    setText('17300CE');
    sendSearchReq('17300CE');
  }

  function handleClear() {
    setText('');
  }

  function sendRequest(data){

    if(data == ""){
      setInstrumentsData([])
      return;
    }

    axios.get(`${baseUrl}api/v1/tradableInstruments?search=${data}&page=${1}&size=${PAGE_SIZE}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      console.log("instrumentData", res.data)
      // setInstrumentsData(res.data)
      setInstrumentsData(prevData => [...prevData, ...(res.data)]);
      


    }).catch((err)=>{
      console.log(err);
    }).finally(() => setLoading(false));

  }

  //--Scroll pagination code

  const handleScroll = () => {

    console.log("in scroll function",  window.innerHeight + document.documentElement.scrollTop ,
    document.documentElement.offsetHeight)
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {

      console.log("in scroll function page", page)
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`${baseUrl}api/v1/tradableInstruments?search=${"17000"}&page=${page+1}&size=${PAGE_SIZE}`);
      const newData = await response.json();
      setInstrumentsData(prevData => [...prevData, ...newData]);
      setLoading(false);
    };

    fetchData();
  }, [page]);







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
        openSuccessSB();
        console.log(data.message) 
      }
      
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
      }else {
          openSuccessSB();
      }
      
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
                    <Grid><MDButton size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem)}}>
                      B
                    </MDButton></Grid>
                    <Grid><MDButton size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem)}}>
                      S
                    </MDButton></Grid>
                    {perticularInstrumentData.length ?
                    <Grid lg={2.2}><MDButton size="small" color="secondary" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem, "Remove")}}>-</MDButton></Grid>//{isAdded ? "Remove" : "Add"}
                    :
                    <Grid lg={2.2}><MDButton size="small" color="warning" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem, "Add")}}>+</MDButton></Grid>
                    }
                  </Grid>

                  
                </Grid>
                )}
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
