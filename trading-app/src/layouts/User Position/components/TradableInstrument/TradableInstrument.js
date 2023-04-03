import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components

// import MDButton from "../";
import MDButton from "../../../../components/MDButton";
import MDSnackbar from "../../../../components/MDSnackbar";
import { userContext } from "../../../../AuthContext";




// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
// import { userContext } from "../../AuthContext";
import BuyModel from "../InstrumentDetails/data/BuyModel";
import SellModel from "../InstrumentDetails/data/SellModel";
import { marketDataContext } from "../../../../MarketDataContext";
// import MDSnackbar from "../../../../components/MDSnackbar";
import uniqid from "uniqid"


const initialState = {
  instrumentsData: [],
  successSB: false,
  text: '',
  timeoutId: null,
  addOrRemoveCheck: null,
  userInstrumentData: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'setEmptyInstrumentsData':
      return { ...state, instrumentsData: action.payload };
    case 'setInstrumentsData':
      return { ...state, instrumentsData: action.payload };
    case 'openSuccess':
      return { ...state, successSB: action.payload };
    case 'closeSuccess':
      return { ...state, successSB: action.payload };
    case 'setText':
      return { ...state, text: action.payload };
    case 'setEmptyText':
      return { ...state, text: action.payload };
    case 'setValueInText':
      return { ...state, text: action.payload };
    case 'setAddOrRemoveCheckFalse':
      return { ...state, addOrRemoveCheck: action.payload };
    case 'setAddOrRemoveCheckTrue':
      return { ...state, addOrRemoveCheck: action.payload };
    case 'setUserInstrumentData':
      return { ...state, userInstrumentData: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


function TradableInstrument({socket, reRender, setReRender, isGetStartedClicked, setIsGetStartedClicked}) {

  console.log("rendering in userPosition: TradableInstrument")
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let textRef = useRef(null);
  const PAGE_SIZE = 20;
  // const getDetails = useContext(userContext);
  const marketDetails = useContext(marketDataContext)
  const [timeoutId, setTimeoutId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSuccessSB = () => {
    return dispatch({ type: 'openSuccess', payload: true });
  }
  const closeSuccessSB = () => {
    return dispatch({ type: 'closeSuccess', payload: false });
  }

  useEffect(()=>{
    if(isGetStartedClicked){
      textRef.current.focus();
      // setValueInText
      dispatch({ type: 'setValueInText', payload: 'NIFTY' });
      // setText('17300CE');
      sendSearchReq('NIFTY');
      setIsGetStartedClicked(false)
    }
  })


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/instrumentDetails`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res) => {
        //console.log("live price data", res)
        dispatch({ type: 'setUserInstrumentData', payload: (res.data) });
        // setUserInstrumentData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender])

  // let writeText = () => {


  // }
  // function writeText() {

  // }


  function sendSearchReq(e) {
    // let newData += data
    // clear previous timeout if there is one
    const value = e?.target?.value ? e.target.value : e;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        sendRequest(value);
      }, 400)
    );
  }

  function handleClear() {
    // setText('');
    dispatch({ type: 'setEmptyText', payload: '' });
    dispatch({ type: 'setEmptyInstrumentsData', payload: [] });
  }

  function sendRequest(data){


    console.log("input value", data)
    if(data == ""){
      dispatch({ type: 'setEmptyInstrumentsData', payload: [] });
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
      dispatch({ type: 'setInstrumentsData', payload: (res.data) });


    }).catch((err)=>{
      console.log(err);
    })
  }

  async function subscribeInstrument(instrumentData, addOrRemove){

    const {instrument_token, tradingsymbol, name, strike, lot_size, instrument_type, exchange, expiry} = instrumentData

    // socket.emit("subscribeToken", instrument_token);
    
    
    if(addOrRemove === "Add"){
      dispatch({ type: 'setAddOrRemoveCheckTrue', payload: true });
      // setAddOrRemoveCheck(true);
      console.log(instrumentData)
      const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          instrument: `${strike} ${instrument_type}`, exchange, status: "Active", symbol: tradingsymbol, lotSize: lot_size, instrumentToken: instrument_token, uId: uniqid(), contractDate: expiry, maxLot: lot_size*36
        })
      });
    
      const data = await res.json();
      //console.log(data);
      if(data.status === 422 || data.error || !data){
          window.alert(data.error);
      }else{
        // let instrumentTokenArr = [];
        // instrumentTokenArr.push(instrument_token)
        // socket.emit("subscribeToken", instrumentTokenArr);
        console.log("instrument_token data from socket", instrument_token)
        openSuccessSB();
        console.log(data.message)
      }
      
    } else{
      dispatch({ type: 'setAddOrRemoveCheckFalse', payload: false });

      // setAddOrRemoveCheck(false);
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
          // let instrumentTokenArr = [];
          // instrumentTokenArr.push(instrument_token)
          // socket.emit("unSubscribeToken", instrumentTokenArr);
          openSuccessSB();
      }
      
    }
    reRender ? setReRender(false) : setReRender(true);
  }

  async function subscribeInstrumentFromBuySell(elem){
    const {instrument_token, exchange} = elem

    const res = await fetch(`${baseUrl}api/v1/subscribeInstrument`, {
      method: "POST",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        instrumentToken: instrument_token, exchange
      })
    });
  
    const data = await res.json();
    //console.log(data);
    if(data.status === 422 || data.error || !data){
        window.alert(data.error);
    }else{
      let instrumentTokenArr = [];
      instrumentTokenArr.push(instrument_token)
      // socket.emit("subscribeToken", instrumentTokenArr);
      console.log("instrument_token data from socket", instrument_token)
      // openSuccessSB();
      console.log(data.message)
    }

  }

  let content = `Instrument ${state.addOrRemoveCheck ? "Added" : "Removed"}`
  let color = state.addOrRemoveCheck ? "success" : "error"
  const renderSuccessSB = (
    <MDSnackbar
      color={color}
      icon="check"
      // title={title}
      content={content}
      // dateTime={timestamp}
      open={state.successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${state.addOrRemoveCheck ? "green" : "red"}`, borderRadius: "15px"}}
    />
  );

 

  return (
    <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" 
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined" 
          type="text"
          placeholder="Click here to search any symbol and add them in your watchlist to start trading"
          value={state.text}
          inputRef={textRef}
          InputProps={{
            onFocus: () => textRef.current.select(),
            endAdornment: (
              <MDButton variant="text" color="dark" onClick={handleClear}>{state.text && <RxCross2/>}</MDButton>
            ),
            startAdornment: (
              <>{<AiOutlineSearch/>}</>
            ),
          }}
          sx={{margin: 0, background:"white",padding : 0, borderRadius:2 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}} onChange={(e)=>{dispatch({ type: 'setText', payload: e.target.value });sendSearchReq(e)}} //e.target.value.toUpperCase()
          />
        <MDBox>
        { state.instrumentsData?.length > 0 &&
          (state.instrumentsData.map((elem)=>{
            let perticularInstrumentData = state.userInstrumentData.filter((subElem)=>{
              return subElem.instrumentToken === elem.instrument_token
            })

            let perticularMarketData = marketDetails.marketData.filter((subElem)=>{
              return subElem.instrument_token === elem.instrument_token
            })
            console.log("perticularMarketData", perticularMarketData)
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
              {state.text && (
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
                    <Grid><MDButton size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrumentFromBuySell(elem)}}>
                      <BuyModel reRender={reRender} setReRender={setReRender} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={elem.lot_size*36} ltp={(perticularMarketData[0]?.last_price)?.toFixed(2)} fromUserPos={true} socket={socket}/>
                    </MDButton></Grid>
                    <Grid><MDButton size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} >
                      <SellModel reRender={reRender} setReRender={setReRender} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={elem.lot_size*36} ltp={(perticularMarketData[0]?.last_price)?.toFixed(2)} fromUserPos={true} socket={socket}/>
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
)
}

export default TradableInstrument;
