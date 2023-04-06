import React, { useContext, useState } from "react";
import { useEffect, memo } from 'react';
import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../../../../../../AuthContext";
import MDSnackbar from '../../../../../../../components/MDSnackbar';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../../../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MDBox from '../../../../../../../components/MDBox';
import { Box, Typography } from '@mui/material';
import { marketDataContext } from "../../../../../../../MarketDataContext";


const SellModel = ({exchange, symbol, instrumentToken, symbolName, lotSize, maxLot, ltp, reRender, setReRender, fromUserPos, expiry}) => {
  console.log("rendering in userPosition: sellModel")

  // const marketDetails = useContext(marketDataContext)

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  // const { reRender, setReRender } = Render;
  const getDetails = React.useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  let createdBy = getDetails.userDetails.name;
  let userId = getDetails.userDetails.email;
  let tradeBy = getDetails.userDetails.name;
  let trader = getDetails.userDetails._id;
  let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })


  let finalLot = maxLot/lotSize;
  let optionData = [];
  for(let i =1; i<= finalLot; i++){
      optionData.push( <option value={i * lotSize}>{ i * lotSize}</option>)
      
  }



  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [regularSwitch, setRegularSwitch] = React.useState(true);

  const [sellFormDetails, setsellFormDetails] = React.useState({
    exchange: "",
    symbol: "",
    ceOrPe: "",
    buyOrSell: "",
    variety: "",
    Product: "",
    Quantity: "",
    Price: "",
    OrderType: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })


  const [value, setValue] = React.useState('NRML');
  sellFormDetails.Product = value;
  const handleChange = (event) => {
    setValue(event.target.value);
    sellFormDetails.Product = event.target.value;

  };

  const [market, setMarket] = React.useState('MARKET');
  sellFormDetails.OrderType = market;
  const marketHandleChange = (event) => {
    setMarket(event.target.value);
    sellFormDetails.OrderType = event.target.value;
  };
  const [validity, setValidity] = React.useState('DAY');
  sellFormDetails.validity = validity;
  const validityhandleChange = (event) => {
    setValidity(event.target.value);
    sellFormDetails.validity = event.target.value;
  };

  const handleClickOpen = async () => {
    if(fromUserPos){
      addInstrument();
    }
    reRender ? setReRender(false) : setReRender(true);
    setOpen(true);
  }; 

  const handleClose = async (e) => {
    if(fromUserPos){
      removeInstrument()
    }
    reRender ? setReRender(false) : setReRender(true);
    setOpen(false);
  };



  const [appLive, setAppLive] = useState([]);


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`)
    .then((res) => {
        setAppLive(res.data);
    }).catch((err) => {
        return new Error(err);
    })

  }, [getDetails])


  async function sellFunction(e, uId) {
      e.preventDefault()
      setOpen(false);

      if(!appLive[0].isAppLive){
        window.alert("App is not Live right now. Please wait.");
        return ;
      }

      sellFormDetails.buyOrSell = "SELL";
  
      if (regularSwitch === true) {
        sellFormDetails.variety = "regular"
      }
      else {
        sellFormDetails.variety = "amo"
      }

      sellFormDetails.exchange = exchange;
      sellFormDetails.symbol = symbol

      setsellFormDetails(sellFormDetails)

      placeOrder();

      let id = setTimeout(()=>{
          reRender ? setReRender(false) : setReRender(true)
      }, 1000);
      
  }

  async function placeOrder() {
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
    const res = await fetch(`${baseUrl}api/v1/placingOrder`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            
          exchange, symbol, buyOrSell, Quantity, Price, 
          Product, OrderType, TriggerPrice, stopLoss, uId,
          validity, variety, createdBy, order_id:dummyOrderId,
          userId, instrumentToken, trader

        })
    });
    const dataResp = await res.json();
    //console.log("dataResp", dataResp)
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        //console.log(dataResp.error)
        // window.alert(dataResp.error);
        openSuccessSB('error', dataResp.error)
        ////console.log("Failed to Trade");
      } else {
        if(dataResp.message === "COMPLETE"){
            // console.log(dataResp);
            openSuccessSB('complete', {symbol, Quantity})
            // window.alert("Trade Succesfull Completed");
        } else if(dataResp.message === "REJECTED"){
            // console.log(dataResp);
            openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
            // window.alert("Trade is Rejected due to Insufficient Fund");
        } else if(dataResp.message === "AMO REQ RECEIVED"){
            // console.log(dataResp);
            openSuccessSB('amo', "AMO Request Recieved")
            // window.alert("AMO Request Recieved");
        } else{
          openSuccessSB('else', dataResp.message)
          // window.alert(dataResp.message);
        }
    }
  }

  async function addInstrument(){
    const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
      method: "POST",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        instrument: symbolName, exchange, status: "Active", 
        symbol, lotSize, instrumentToken, 
        uId, contractDate: expiry, maxLot: lotSize*36, notInWatchList: true
      })
    });
  
    const data = await res.json();
    if(data.status === 422 || data.error || !data){
        window.alert(data.error);
    }else{
      // openSuccessSB();
      console.log(data.message)
    }
  }

  async function removeInstrument(){
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
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
    }
  }


  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    // console.log("Value: ",value)
    if(value === "complete"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Trade Successfull";
        messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;

    };
    if(value === "reject"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "amo"){
      messageObj.color = 'info'
      messageObj.icon = 'warning'
      messageObj.title = "AMO Requested";
      messageObj.content = content;
    };
    if(value === "else"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  // console.log("Title, Content, Time: ",title,content,time)


  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width:"500px"}}
    />
  );




  return (
    <div>
      {/* {fromUserPos ? 
      <MDBox color="light" onClick={handleClickOpen}>
        S
      </MDBox>
      :  */}
      <MDButton size="small" sx={{marginRight:0.5,minWidth:2,minHeight:3}} color="error" onClick={handleClickOpen} >
        S
      </MDButton>
      {/* } */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          {"Regular"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, marginTop: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}><Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>{symbolName}</Box> &nbsp; &nbsp; &nbsp; <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>₹{ltp}</Box></Box>
            <FormControl >

              <FormLabel id="demo-controlled-radio-buttons-group" sx={{ width: "300px" }}></FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel value="MIS" disabled="true" control={<Radio />} label="Intraday (MIS)" />
                <FormControlLabel value="NRML" disabled="true" control={<Radio />} label="Overnight (NRML)" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Quantity"
                  onChange={(e) => { { sellFormDetails.Quantity = (e.target.value) } }}
                  sx={{ margin: 1, padding: 1, }}
                >
                    {optionData.map((elem)=>{
                        return(
                            <MenuItem value={elem.props.value}>{elem.props.children}</MenuItem>
                        )
                    }) 
                    }
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic" disabled="true" label="Price" variant="standard" onChange={(e) => { { sellFormDetails.Price = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} />

              <TextField
                id="outlined-basic" disabled="true" label="Trigger Price" variant="standard" onChange={(e) => { { sellFormDetails.TriggerPrice = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, width: "300px" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={market}
                  onChange={marketHandleChange}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="MARKET" disabled="true" control={<Radio />} label="MARKET" />
                  <FormControlLabel value="LIMIT" disabled="true" control={<Radio />} label="LIMIT" />
                </RadioGroup>
              </FormControl>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  onChange={(e) => { { sellFormDetails.stopLoss = (e.target.value) } }}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="SL" disabled="true" control={<Radio />} label="SL" />
                  <FormControlLabel value="SLM" disabled="true" control={<Radio />} label="SL-M" />
                </RadioGroup>
              </FormControl>

            </Box>

            <Box>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" >Validity</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={validity}
                  onChange={validityhandleChange}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <FormControlLabel value="DAY" disabled="true" control={<Radio />} label="DAY" />
                  <FormControlLabel value="IMMEDIATE" disabled="true" control={<Radio />} label="IMMEDIATE" />
                  <FormControlLabel value="MINUTES" disabled="true" control={<Radio />} label="MINUTES" />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton autoFocus variant="contained" color="error" onClick={(e) => { sellFunction(e) }}>
            Sell
          </MDButton>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
            Close
          </MDButton>
        </DialogActions>


      </Dialog>
      {renderSuccessSB}
    </div>
  );
}

export default memo(SellModel)