import React, { useContext, useState } from "react";
import { useEffect } from 'react';
import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../../../../AuthContext";

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
import MDButton from '../../../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MDBox from '../../../../../components/MDBox';
import { Box, Typography } from '@mui/material';

const SellModel = ({exchange, symbol, instrumentToken, symbolName, lotSize, maxLot, ltp}) => {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  // const { reRender, setReRender } = Render;
  const getDetails = React.useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  let createdBy = getDetails.userDetails.name;
  let userId = getDetails.userDetails.email;
  let totalAmount = 0;
  let tradeBy = getDetails.userDetails.name;
  let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
  let isCompany = false;
 

  const [userPermission, setUserPermission] = useState([]);
  const [bsBtn, setBsBtn] = useState(true)
  const [modal, setModal] = useState(false);


  const [selected, setSelected] = useState("NRML");

  let [accessTokenDetails, setAccessToken] = useState([]);
  let [apiKeyDetails, setApiKey] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [brokerageData, setBrokerageData] = useState([]);
  const [tradingAlgoData, setTradingAlgoData] = useState([]);
  const [pageRender, setPageRander] = useState();
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

  // let lotSize = lotsize;
  // let maxLot = maxlot;
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

  const [otmDetailsForm, setOtmDetailsForm] = React.useState({
    otm: "",
    otm_quantity: "",
    otm_token: ""
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

  const handleClickOpen = () => {
    setOpen(true);

  }; 

  const handleClose = (e) => {
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
                return elem.status === "Active"
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
            // window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readtradingAlgo`)
        .then((res) => {
            setTradingAlgoData(res.data);
        }).catch((err) => {
            return new Error(err);
        })





    setTradeData([...tradeData])

    //////console.log(perticularInstrumentData);
}, [getDetails])

useEffect(()=>{
  axios.get(`${baseUrl}api/v1/userwiseOtm/${userId}`)
  .then((res) => {
      setOtmData(res.data);
  }).catch((err) => {
      return new Error(err);
  })
},[otmDetailsForm])

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
        //////console.log(elem);
        // if(elem.isTradeEnable){

            if (elem.transactionChange === "TRUE") {
                companyTrade.realBuyOrSell = "BUY"
            } else {
                companyTrade.realBuyOrSell = "SELL"
            }

            companyTrade.realSymbol = sellFormDetails.symbol

            companyTrade.realQuantity = elem.lotMultipler * (sellFormDetails.Quantity);
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
            if(elem.marginDeduction){
              let temp_otm_quantity = companyTrade.realQuantity
              if(elem.transactionChange === "TRUE"){
                // here trade gona buy hence otm will be sell side.

                // agar kisi ek instrument ke 50 sell kiye then 50 otm buy
                // another instrument ke bhi 50 sell kiye then 50 otm buy again
                // now 1st wale ke 100 buy krta hu then this logic buy 50 + 50 otm
                for( let subElem of otmData){
                  if(subElem.runningLots){
                    //console.log("temp_otm_quantity", temp_otm_quantity, Math.abs(subElem.runningLots))
                    if(temp_otm_quantity > (subElem.runningLots)){
                      otmDetailsForm.otm = subElem._id.otm;
                      otmDetailsForm.otm_quantity = -(Math.abs(subElem.runningLots));
                      otmDetailsForm.otm_token = subElem._id.otm_token;
                      setOtmDetailsForm(otmDetailsForm)
                      
                      mockOtmTradeCompany(elem);
                      temp_otm_quantity = temp_otm_quantity - Math.abs(subElem.runningLots)
                      
                    } else{
                      otmDetailsForm.otm = subElem._id.otm;
                      otmDetailsForm.otm_quantity = -(Math.abs(temp_otm_quantity));
                      otmDetailsForm.otm_token = subElem._id.otm_token;
                      setOtmDetailsForm(otmDetailsForm)
                      
                      mockOtmTradeCompany(elem);
                      temp_otm_quantity = temp_otm_quantity - Math.abs(subElem.runningLots)
                      break;
                    }
                  }
                }
              } else{
                
                  let particulerInstrument = tradeData.filter((elem)=>{
                    return elem.instrumentToken === instrumentToken;
                  }) 
                  otmDetailsForm.otm = particulerInstrument[0].otm;
                  otmDetailsForm.otm_quantity = -(companyTrade.realQuantity);
                  otmDetailsForm.otm_token = particulerInstrument[0].otmToken;

                  setOtmDetailsForm(otmDetailsForm)
              }

            }

            //console.log("otmDetailsForm", otmDetailsForm)

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

  async function sellFunction(e, uId) {
      e.preventDefault()
      setOpen(false);

      if(!appLive[0].isAppLive){
        window.alert("App is not Live right now. Please wait.");
        return ;
      }

      if(!tradeEnable){
        ////console.log("tradeEnable", tradeEnable)
        window.alert("Your trade is disable, please contact to authorise person");
        return;
    }

      sellFormDetails.buyOrSell = "SELL";
  
      if (regularSwitch === true) {
        sellFormDetails.variety = "regular"
      }
      else {
        sellFormDetails.variety = "amo"
      }
  
      // setsellFormDetails(sellFormDetails);



      sellFormDetails.exchange = exchange;
      sellFormDetails.symbol = symbol


      // Algo box applied here....

      if (userPermissionAlgo.length && !isCompany) {
        setsellFormDetails(sellFormDetails)
          // if(!isCompany){
          //     mockTradeUser("no");
          // }
          tradingAlgo();
      } else {
          companyTrade.realBuyOrSell = "SELL";
          companyTrade.realSymbol = sellFormDetails.symbol
          companyTrade.realQuantity = sellFormDetails.Quantity;
          
          setCompanyTrade(companyTrade)
          setsellFormDetails(sellFormDetails)

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
      // }, 1000);
      
  }

  async function sendOrderReq(algoBox) {
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
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

  const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
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

  async function mockOtmTradeCompany(algoBox){
    
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
    const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
    const { realBuyOrSell, realQuantity } = companyTrade;
    const {otm, otm_quantity, otm_token} = otmDetailsForm;
    //console.log("otm, otm_quantity, otm_token", otm, otm_quantity, otm_token)

      const res = await fetch(`${baseUrl}api/v1/mockOtmtradecompany`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            exchange, symbol, buyOrSell, realBuyOrSell, Quantity, realQuantity, Price, Product, OrderType, TriggerPrice, 
            stopLoss, validity, variety, createdBy, userId, createdOn, uId, 
            algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
            productChange, tradingAccount}, order_id:dummyOrderId, instrumentToken, otm, otm_quantity, otm_token
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
      <MDButton variant="contained" color="error" onClick={handleClickOpen} fullWidth>
        SELL
      </MDButton>
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
                <FormControlLabel value="MIS" control={<Radio />} label="Intraday (MIS)" />
                <FormControlLabel value="NRML" control={<Radio />} label="Overnight (NRML)" />
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
                id="outlined-basic" label="Price" variant="standard" onChange={(e) => { { sellFormDetails.Price = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} />

              <TextField
                id="outlined-basic" label="Trigger Price" variant="standard" onChange={(e) => { { sellFormDetails.TriggerPrice = (e.target.value) } }}
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
                  <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
                  <FormControlLabel value="LIMIT" control={<Radio />} label="LIMIT" />
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
                  <FormControlLabel value="SL" control={<Radio />} label="SL" />
                  <FormControlLabel value="SLM" control={<Radio />} label="SL-M" />
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
                  <FormControlLabel value="DAY" control={<Radio />} label="DAY" />
                  <FormControlLabel value="IMMEDIATE" control={<Radio />} label="IMMEDIATE" />
                  <FormControlLabel value="MINUTES" control={<Radio />} label="MINUTES" />
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
    </div>
  );
}

export default SellModel