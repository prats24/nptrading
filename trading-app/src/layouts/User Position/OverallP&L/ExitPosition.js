
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




// import Button from '@mui/material/Button';

function ExitPosition({product, symbol, quantity, exchange, instrumentToken}) {

    let checkBuyOrSell ;
    if(quantity > 0){
        checkBuyOrSell = "BUY"
    } else if(quantity < 0){
        checkBuyOrSell = "SELL"
    }
    //console.log("data from props", exchange, symbol, instrumentToken, product)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    const getDetails = React.useContext(userContext);
    let uId = uniqid();
    let date = new Date();
    // let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    let createdBy = getDetails.userDetails.name;
    let userId = getDetails.userDetails.email;
    // let totalAmount = 0;
    // let tradeBy = getDetails.userDetails.name;
    let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
    let isCompany = false;
   
  
    const [userPermission, setUserPermission] = useState([]);
    // const [bsBtn, setBsBtn] = useState(true)
    const [modal, setModal] = useState(false);
  
  
    // const [selected, setSelected] = useState("NRML");
  
    let [accessTokenDetails, setAccessToken] = useState([]);
    let [apiKeyDetails, setApiKey] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    // const [brokerageData, setBrokerageData] = useState([]);
    const [tradingAlgoData, setTradingAlgoData] = useState([]);
    const [otmData, setOtmData] = useState([]);
    const [companyTrade, setCompanyTrade] = useState({
        realBuyOrSell: "",
        realSymbol: "",
        realQuantity: "",
        realInstrument: "",
        realBrokerage: "",
        realAmount: "",
        real_last_price: "",
    })
  
    // let lotSize = lotSize;
    // let maxLot = maxLot;

  
  
  
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
  
    const [otmDetailsForm, setOtmDetailsForm] = React.useState({
      otm: "",
      otm_quantity: "",
      otm_token: ""
    })
  
    const [filledQuantity, setFilledQuantity] = useState((Math.abs(quantity) > 1800) ? 1800 : Math.abs(quantity));

    function quantityChange(e){
      setFilledQuantity(e.target.value)
      exitPositionFormDetails.Quantity = e.target.value
    }
  
    const [value, setValue] = React.useState('NRML');
    exitPositionFormDetails.Product = product;
    // const handleChange = (event) => {
    //   setValue(event.target.value);
    //   exitPositionFormDetails.Product = product;
  
    // };
  
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
  
      axios.get(`${baseUrl}api/v1/readRequestToken`)
          .then((res) => {
              let activeAccessToken = (res.data).filter((elem) => {
                  return elem.status === "Active"
              })
              setAccessToken(activeAccessToken);
          }).catch((err) => {
              return new Error(err);
          })
      axios.get(`${baseUrl}api/v1/readAccountDetails`)
          .then((res) => {
              let activeApiKey = (res.data).filter((elem) => {
                  return elem.status === "Active"
              })
              setApiKey(activeApiKey);
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
  
  
          axios.get(`${baseUrl}api/v1/readpermission`)
          .then((res) => {
          let perticularUser = (res.data).filter((elem) => {
              //////console.log(elem.userId, userId);
              return elem.userId === userId;
          })
          setUserPermission(perticularUser);
          }).catch((err) => {
              // //window.alert("Server Down");
              return new Error(err);
          })
  
          axios.get(`${baseUrl}api/v1/readtradingAlgo`)
          .then((res) => {
              setTradingAlgoData(res.data);
          }).catch((err) => {
              return new Error(err);
          })
  
          axios.get(`${baseUrl}api/v1/readsetting`)
          .then((res) => {
              setAppLive(res.data);
          }).catch((err) => {
              return new Error(err);
          })
  
  
          
  
      setTradeData([...tradeData])
  
      //////console.log(perticularInstrumentData);
    }, [])

  let lotSize = tradeData[0]?.lotSize;
  let maxLot = tradeData[0]?.maxLot;
  let finalLot = maxLot/lotSize;
  let optionData = [];
  for(let i =1; i<= finalLot; i++){
      optionData.push( <MenuItem value={i * lotSize}>{ i * lotSize}</MenuItem>)      
  }
  

  
  // ////console.log(tradingAlgoData, userPermission);
  
    const tradingAlgoArr = [];
    apiKeyDetails.map((elem) => {
        accessTokenDetails.map((subelem) => {
            tradingAlgoData.map((element) => {
                if (element.status === "Active" && subelem.accountId == element.tradingAccount && elem.accountId == element.tradingAccount) {
                    tradingAlgoArr.push(element);
                }
            })
        })
    })
  
  
    const userPermissionAlgo = [];
    for (let elem of tradingAlgoArr) {
        for (let subElem of userPermission) {
            if (elem.algoName === subElem.algoName && subElem.isTradeEnable) {
                userPermissionAlgo.push(elem)
            }
        }
    }
  
  
    let tradeEnable ;
    userPermission.map((elem)=>{
        ////console.log(elem)
        if(elem.isTradeEnable){
            tradeEnable = true;
        }
    })
  
    function tradingAlgo() {
      // if (userPermissionAlgo.length) {
      userPermissionAlgo.map((elem) => {
  
              if (elem.transactionChange === "TRUE") {
                    if(checkBuyOrSell === "BUY"){
                        companyTrade.realBuyOrSell = "BUY"
                    } else if(checkBuyOrSell === "SELL"){
                        companyTrade.realBuyOrSell = "SELL"
                    }
                  
              } else {
                if(checkBuyOrSell === "BUY"){
                    companyTrade.realBuyOrSell = "SELL"
                } else if(checkBuyOrSell === "SELL"){
                    companyTrade.realBuyOrSell = "BUY"
                }
              }
  
              companyTrade.realSymbol = symbol
  
              companyTrade.realQuantity = elem.lotMultipler * filledQuantity;
              accessTokenDetails = accessTokenDetails.filter((element) => {
                  return elem.tradingAccount === element.accountId
              })
              setAccessToken(accessTokenDetails);
              apiKeyDetails = apiKeyDetails.filter((element) => {
                  return elem.tradingAccount === element.accountId
              })
              setApiKey(apiKeyDetails);
              
              setCompanyTrade(companyTrade)
              //////console.log("companyTrade", companyTrade);
              //console.log("userPermission", userPermission)
  

  
              userPermission.map((subElem)=>{
                  if(subElem.algoName === elem.algoName){
                      if(subElem.isRealTradeEnable || elem.isRealTrade){
                          sendOrderReq(elem);
                      } else{
                          mockTradeCompany(elem);
                      }
                  }
              })
          setModal(!modal);
      })
    }
  
    async function exitPosition(e, uId) {
        e.preventDefault()
        setOpen(false);
  
        //console.log("tradeData", tradeData)
  
        if(!appLive[0].isAppLive){
          window.alert("App is not Live right now. Please wait.");
          return;
        }
  
        if(!tradeEnable){
          ////console.log("tradeEnable", tradeEnable)
          window.alert("Your trade is disable, please contact to authorise person");
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
    
        // setexitPositionFormDetails(exitPositionFormDetails);
  
  
  
        exitPositionFormDetails.exchange = exchange;
        exitPositionFormDetails.symbol = symbol;
        exitPositionFormDetails.Quantity = filledQuantity;
  
  
        // Algo box applied here....
  
        if (userPermissionAlgo.length && !isCompany) {
          setexitPositionFormDetails(exitPositionFormDetails)
            // if(!isCompany){
            //     mockTradeUser("no");
            // }
            tradingAlgo();
        } else {
            companyTrade.realBuyOrSell = "BUY";
            companyTrade.realSymbol = symbol
            companyTrade.realQuantity = filledQuantity;
            
            setCompanyTrade(companyTrade)
            setexitPositionFormDetails(exitPositionFormDetails)
  
            const fakeAlgo = {
                algoName: "no algo",
                transactionChange: "no algo",
                instrumentChange: "no algo",
                exchangeChange: "no algo",
                lotMultipler: "no algo",
                productChange: "no algo",
                tradingAccount: "no algo"
            }
  
            if(isCompany){
                mockTradeCompany(fakeAlgo);
            } else{
                window.alert("Your Trade is Disabled, contact authorize person")
            }
  
            // mockTradeCompany(fakeAlgo, "no");
            setModal(!modal);
        } 
  
        // rerenderParentCallback();
        // let id = setTimeout(()=>{
        //     reRender ? setReRender(false) : setReRender(true)
        // }, 1500);
        
    }
  
    async function sendOrderReq(algoBox) {
        let date = new Date();
        let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`
  
        const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = exitPositionFormDetails;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
        const { realBuyOrSell, realQuantity } = companyTrade;
  
        const { apiKey } = apiKeyDetails[0];
        const { accessToken } = accessTokenDetails[0];
  
        const res = await fetch(`${baseUrl}api/v1/placeorder`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                
                apiKey, accessToken, userId,
                exchange, symbol, buyOrSell, realBuyOrSell, Quantity, realQuantity, Price, Product, OrderType, TriggerPrice, 
                stopLoss, validity, variety, createdBy, userId, createdOn, uId, 
                algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount}, order_id:dummyOrderId, instrumentToken
  
            })
        });
        const dataResp = await res.json();
        ////console.log("dataResp", dataResp)
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            ////console.log(dataResp.error)
            window.alert(dataResp.error);
            //////console.log("Failed to Trade");
        } else {
            if(dataResp.massage === "COMPLETE"){
                //console.log(dataResp);
                window.alert("Trade Succesfull Completed");
            } else if(dataResp.massage === "REJECTED"){
                //console.log(dataResp);
                window.alert("Trade is Rejected due to Insufficient Fund");
            } else if(dataResp.massage === "AMO REQ RECEIVED"){
                //console.log(dataResp);
                window.alert("AMO Request Recieved");
            } else{
                //console.log("this is dataResp", dataResp)
                window.alert("on order placing nothing happen");
            }
        }
    }
  
    async function mockTradeCompany(algoBox){
      
      let date = new Date();
      let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`
  
      const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = exitPositionFormDetails;
      const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
      const { realBuyOrSell, realQuantity } = companyTrade;
      const {otm, otm_quantity, otm_token} = otmDetailsForm;
  
        const res = await fetch(`${baseUrl}api/v1/mocktradecompany`, {
          method: "POST",
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              exchange, symbol, buyOrSell, realBuyOrSell, Quantity, realQuantity, Price, Product, OrderType, TriggerPrice, 
              stopLoss, validity, variety, createdBy, userId, createdOn, uId, 
              algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
              productChange, tradingAccount}, order_id:dummyOrderId, instrumentToken,
               otm, otm_quantity, otm_token
          })
        });
        const dataResp = await res.json();
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
        } else {
            window.alert("Trade succesfull");
        }
  
      
    }



  return (
    <div>


    <MDButton variant="contained" color="info" onClick={handleClickOpen} fullWidth>
        Exit Position
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
