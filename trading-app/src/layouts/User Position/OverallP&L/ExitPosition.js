
import React, {useEffect, useState, useContext} from 'react'
import Card from "@mui/material/Card";
import axios from "axios";

// // Data
import { userContext } from '../../../AuthContext';
// import MDButton from '../../../components/MDButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import uniqid from "uniqid"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

function ExitPosition({product, symbol, quantity, exchange, instrumentToken}) {
  console.log("rendering in userPosition/overall: exitPosition", quantity)

    let checkBuyOrSell ;
    if(quantity > 0){
        checkBuyOrSell = "BUY"
    } else if(quantity < 0){
        checkBuyOrSell = "SELL"
    }
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    const getDetails = React.useContext(userContext);
    let uId = uniqid();
    let date = new Date();
    let createdBy = getDetails.userDetails.name;
    let userId = getDetails.userDetails.email;
    let trader = getDetails.userDetails._id;
    let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
    const [tradeData, setTradeData] = useState([]);

  
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const [regularSwitch, setRegularSwitch] = React.useState(true);
    const [appLive, setAppLive] = useState([]);
  
    const [exitPositionFormDetails, setexitPositionFormDetails] = React.useState({
      exchange: "",
      symbol: "",
      ceOrPe: "",
      buyOrSell: "",
      variety: "",
      Product: product,
      Quantity: "",
      Price: "",
      OrderType: "",
      TriggerPrice: "",
      stopLoss: "",
      validity: "",
    })
  

  
    const [filledQuantity, setFilledQuantity] = useState((Math.abs(quantity) > 1800) ? 1800 : Math.abs(quantity));

    function quantityChange(e){
      setFilledQuantity(e.target.value)
      exitPositionFormDetails.Quantity = e.target.value
    }
  
    exitPositionFormDetails.Product = product;

  
    const [market, setMarket] = React.useState('MARKET');
    exitPositionFormDetails.OrderType = market;
    const marketHandleChange = (event) => {
      setMarket(event.target.value);
      exitPositionFormDetails.OrderType = event.target.value;
    };
    const [validity, setValidity] = React.useState('DAY');
    exitPositionFormDetails.validity = validity;
    const validityhandleChange = (event) => {
      setValidity(event.target.value);
      exitPositionFormDetails.validity = event.target.value;
    };
  
    const handleClickOpen = () => {
      if(Math.abs(quantity) === 0){
        window.alert("You do not have any open position for this symbol.")
        return;
      }
      setOpen(true);
  
    }; 
  
    const handleClose = (e) => {
      setOpen(false);
    };
  
  

    useEffect(() => {
  
      axios.get(`${baseUrl}api/v1/readsetting`)
      .then((res) => {
          setAppLive(res.data);
      }).catch((err) => {
          return new Error(err);
      })

      axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
      .then((res) => {
          let dataArr = (res.data).filter((elem) => {
              return elem.status === "Active" && elem.symbol === symbol 
          })
          setTradeData(dataArr)
      }).catch((err) => {
          return new Error(err);
      })

      setTradeData([...tradeData])

    }, [])

  let lotSize = tradeData[0]?.lotSize;
  let maxLot = tradeData[0]?.maxLot;
  let finalLot = maxLot/lotSize;
  let optionData = [];
  for(let i =1; i<= finalLot; i++){
      optionData.push( <MenuItem value={i * lotSize}>{ i * lotSize}</MenuItem>)      
  }
  

  
    async function exitPosition(e, uId) {
        e.preventDefault()
        setOpen(false);
  
        //console.log("tradeData", tradeData)
  
        if(!appLive[0].isAppLive){
          window.alert("App is not Live right now. Please wait.");
          return;
        }
  
  
        exitPositionFormDetails.buyOrSell = "BUY";

        if(checkBuyOrSell === "BUY"){
            exitPositionFormDetails.buyOrSell = "SELL"
        } else if(checkBuyOrSell === "SELL"){
            exitPositionFormDetails.buyOrSell = "BUY"
        }
    
        if (regularSwitch === true) {
          exitPositionFormDetails.variety = "regular"
        }
        else {
          exitPositionFormDetails.variety = "amo"
        }
    

        exitPositionFormDetails.exchange = exchange;
        exitPositionFormDetails.symbol = symbol;
        exitPositionFormDetails.Quantity = filledQuantity;
  
        setexitPositionFormDetails(exitPositionFormDetails)


        placeOrder();
        
    }
  

    async function placeOrder() {
      let date = new Date();
      let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`
  
      const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = exitPositionFormDetails;

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
          window.alert(dataResp.error);
          ////console.log("Failed to Trade");
      } else {
          if(dataResp.massage === "COMPLETE"){
              console.log(dataResp);
              window.alert("Trade Succesfull Completed");
          } else if(dataResp.massage === "REJECTED"){
              console.log(dataResp);
              window.alert("Trade is Rejected due to Insufficient Fund");
          } else if(dataResp.massage === "AMO REQ RECEIVED"){
              console.log(dataResp);
              window.alert("AMO Request Recieved");
          } else{
              console.log("this is dataResp", dataResp)
              window.alert(dataResp.message);
          }
      }
    }



  return (
    <div>
 {/* sx={{margin: "5px"}} */}

    <MDButton size="small" sx={{marginRight:0.5,minWidth:2,minHeight:3}} color="info" onClick={handleClickOpen}> 
        E
    </MDButton>
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          {"Regular"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
            <FormControl >

              <FormLabel id="demo-controlled-radio-buttons-group" sx={{ width: "300px" }}></FormLabel>
              <RadioGroup
                disabled
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={product}
                // onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel value="MIS" control={<Radio />} label="Intraday (MIS)" />
                <FormControlLabel value="NRML" control={<Radio />} label="Overnight (NRML)" />
              </RadioGroup>
            </FormControl>

            <Box label="Open Lots" sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}>
                <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>
                  Open Lots: {Math.abs(quantity)}
                </Box>
              </Box>
           
            <Box sx={{ display: "flex", flexDirection: "row" }}>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                  <InputLabel id="demo-simple-select-standard-label" >Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Quantity"
                    value={filledQuantity}
                    
                    onChange={(e) => { quantityChange(e) }}
                    sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }}
                  >
                    {/* <MenuItem value="100">100</MenuItem>
                    <MenuItem value="150">150</MenuItem> */}
                    {optionData.map((elem)=>{
                      // //console.log("optionData", elem, filledQuantity)
                        return(
                            <MenuItem value={elem.props.value}>
                            {elem.props.children}
                            </MenuItem>
                        )
                    }) 
                    }
                  </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                <RadioGroup
                  disabled
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={market}
                  onChange={marketHandleChange}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
                  {/* <FormControlLabel value="LIMIT" control={<Radio />} label="LIMIT" /> */}
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
                  <FormControlLabel disabled value="DAY" control={<Radio />} label="DAY" />
                  <FormControlLabel disabled value="IMMEDIATE" control={<Radio />} label="IMMEDIATE" />
                  <FormControlLabel disabled value="MINUTES" control={<Radio />} label="MINUTES" />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton autoFocus variant="contained" color="info" onClick={(e) => { exitPosition(e) }}>
            EXIT
          </MDButton>
          <MDButton variant="contained" color="info" onClick={handleClose} autoFocus>
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </div >

  </div >
);

}
export default ExitPosition;
