import React, { useEffect, useState } from 'react'
import axios from "axios"
import uniqid from "uniqid";

import MDBox from "../../../components/MDBox";

import Switch from "@mui/material/Switch";



export default function MockRealSwitch({userId, props, algoName}) {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [permissionDetail, setPermissionDetail] = useState({});
    const [tradeDetail, setTradeDetail] = useState([]);
    const [algoUsed, setAlgoUsed] = useState([]);
    const [accessTokenDetails, setAccessToken] = useState([]);
    const [apiKeyDetails, setApiKey] = useState([]);
    // const {render, setRender} = Render;
    const [reRender, setReRender] = useState(true);
    const [realTradeState, setRealTradeState] = useState(true);
    const [liveTradeDetail, setLiveTradeDetail] = useState([]);

    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const uId = uniqid();
    const createdBy = "system";
    let modifiedOn = createdOn;
    let modifiedBy = "system";
    let checkingMultipleAlgoFlag = 1;




    useEffect(()=>{

        axios.get(`${baseUrl}api/v1/getMockTradeDetailsUser/${userId}`)
        .then((res)=>{
            setTradeDetail(res.data)
            //console.log(res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/getLiveTradeDetailsUser/${userId}`)
        .then((res)=>{
            setLiveTradeDetail(res.data)
            //console.log(res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readtradingAlgo`)
        .then((res)=>{
            let dataArr = (res.data).filter((elem) => {
                return elem.status === "Active"
            })
            setAlgoUsed(dataArr)
            //console.log(res.data);
        }).catch((err)=>{
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

    }, [realTradeState])

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readpermissionbyemail/${userId}`)
        .then((res)=>{
            setPermissionDetail(res.data)
            setRealTradeState(res.data.isRealTradeEnable)
            // setRender(res.data.isRealTradeEnable)
            //console.log("tradeDetailReal", res.data);
        }).catch((err)=>{
            return new Error(err);
        })
        // reRender? setReRender(false) : setReRender(true)
    }, [])


    //console.log("rendering", userId)

    const switchButtonFunc = (checkRealTrade)=>{
        //console.log("checkRealTrade", checkRealTrade)

        if(!checkRealTrade){
            //console.log("squaring off not")
            for(let i = 0; i < tradeDetail.length; i++){
                let usedAlgoBox = algoUsed.filter((elem)=>{
                    return elem.algoName === tradeDetail[i]._id.algoBoxName;
                })
    
                let apiKeyArr = apiKeyDetails.filter((elem)=>{
                    return elem.accountId == usedAlgoBox[0]?.tradingAccount
                    
                })
    
                let accessTokenArr = accessTokenDetails.filter((elem)=>{
                    return elem.accountId == usedAlgoBox[0]?.tradingAccount
                    
                })
    
                let transaction_type = tradeDetail[i].lots > 0 ? "BUY" : "SELL";
                let quantity = Math.abs(tradeDetail[i].lots);
    
                let detailObj = {
                    symbol: tradeDetail[i]._id.symbol,
                    Product: tradeDetail[i]._id.product,
                    instrumentToken: tradeDetail[i]._id.instrumentToken,
                    exchange: tradeDetail[i]._id.exchange,
                    validity: tradeDetail[i]._id.validity,
                    OrderType: tradeDetail[i]._id.order_type,
                    variety: tradeDetail[i]._id.variety,
                    buyOrSell: transaction_type,
                    // Quantity: quantity,
                    tradeBy: tradeDetail[i]._id.name
                }

                let interval = setInterval(() => {
                    if (quantity > 1800) {
                        // console.log("quantity", 1800, (new Date()).getMilliseconds())
                      placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, transaction_type, 1800);
                      quantity = quantity - 1800;
                    } else {
                        // console.log("quantity", quantity, (new Date()).getMilliseconds())
                      placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, transaction_type, quantity);
                      clearInterval(interval);
                    }
                  }, 300);

                //   changeIsRealTrade(true)

            }
        } else{

            //console.log("squaring off")
            for(let i = 0; i < liveTradeDetail.length; i++){
                let usedAlgoBox = algoUsed.filter((elem)=>{
                    return elem.algoName === liveTradeDetail[i]._id.algoBoxName;
                })
    
                let apiKeyArr = apiKeyDetails.filter((elem)=>{
                    return elem.accountId == usedAlgoBox[0]?.tradingAccount
                    
                })
    
                let accessTokenArr = accessTokenDetails.filter((elem)=>{
                    return elem.accountId == usedAlgoBox[0]?.tradingAccount
                    
                })
    
                let transaction_type = liveTradeDetail[i].lots > 0 ? "BUY" : "SELL";
                let quantity = Math.abs(liveTradeDetail[i].lots);
    
                let detailObj = {
                    symbol: liveTradeDetail[i]._id.symbol,
                    Product: liveTradeDetail[i]._id.product,
                    instrumentToken: liveTradeDetail[i]._id.instrumentToken,
                    exchange: liveTradeDetail[i]._id.exchange,
                    validity: liveTradeDetail[i]._id.validity,
                    OrderType: liveTradeDetail[i]._id.order_type,
                    variety: liveTradeDetail[i]._id.variety,
                    buyOrSell: transaction_type,
                    // Quantity: quantity,
                    tradeBy: liveTradeDetail[i]._id.name
                }

                let new_transaction_type = (transaction_type === "SELL") ? "BUY" : "SELL";

                let interval = setInterval(() => {
                    if (quantity > 1800) {
                        // console.log("quantity", 1800, (new Date()).getMilliseconds())
                      placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, new_transaction_type, 1800);
                      quantity = quantity - 1800;
                    } else {
                        // console.log("quantity", quantity, (new Date()).getMilliseconds())
                      placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, new_transaction_type, quantity);
                      clearInterval(interval);
                    }
                  }, 300);

                //   changeIsRealTrade(false)
            }
        }


        //console.log("checkRealTrade", checkRealTrade)
        if(checkRealTrade){
            changeIsRealTrade(false)
            // setRealTradeState(false)
        } else{
            changeIsRealTrade(true)
            
        }

        props.handleSwitchChange(userId)
    }
// onChange={() => props.handleSwitchChange(user.id)}
    const placeLiveOrder = async (algoBox, detailObj, apiKeyArr, accessTokenArr, transaction_type, quantity)=>{
  
        const { exchange, symbol, buyOrSell, Product, OrderType, validity, variety, instrumentToken, tradeBy } = detailObj;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault } = algoBox;
  
        const { apiKey } = apiKeyArr[0];
        const { accessToken } = accessTokenArr[0];
  
        //console.log("detailObj", detailObj, apiKey, accessToken, algoBox)
        const res = await fetch(`${baseUrl}api/v1/switchToRealTrade`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                
                apiKey, accessToken, tradeBy,
                exchange, symbol, buyOrSell: transaction_type, realBuyOrSell: transaction_type, Quantity: quantity, realQuantity: quantity, Product, OrderType, 
                validity, variety, createdBy, userId, createdOn, uId, 
                algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount, _id, marginDeduction, isDefault}, instrumentToken
  
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

    const changeIsRealTrade = async (realTrade)=>{
        const response = await fetch(`${baseUrl}api/v1/updaterealtradeenable/email/${userId}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                modifiedOn, modifiedBy, isRealTradeEnable: realTrade
            })
        });
      
        const permissionData = await response.json();
    
        if (permissionData.status === 422 || permissionData.error || !permissionData) {
            window.alert(permissionData.error);
        }

        // render ? setRender(true) : setRender(false);
        // setTimeout(()=>{
        //     reRender? setReRender(false) : setReRender(true)
        // }, 1000) checked={render}
    
    }

    let real;
    //console.log("props", props)
    props.users.map((elem)=>{
        if(elem.userId === userId){
            real = (elem.isRealTradeEnable);
        }
    })
  return (


    props.users.map((elem)=>{
        //console.log("elem.userId === userId", elem.userId, userId)

        if(elem.userId === userId && elem.algoName === algoName){
            // real = (elem.isRealTradeEnable);
            return(
            <MDBox mt={0.5}>
            <Switch  checked={elem.isRealTradeEnable}   onChange={() => {switchButtonFunc(elem.isRealTradeEnable)}} />
            </MDBox>
            )
        }
    })

  )
}