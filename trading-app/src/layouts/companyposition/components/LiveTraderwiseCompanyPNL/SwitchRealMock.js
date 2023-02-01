import React, { useEffect, useState } from 'react'
import axios from "axios"
import uniqid from "uniqid";

import MDBox from "../../../../components/MDBox";

import Switch from "@mui/material/Switch";


export default function SwitchRealMock({userId, Render}) {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [permissionDetail, setPermissionDetail] = useState({});
    const [tradeDetail, setTradeDetail] = useState([]);
    const [algoUsed, setAlgoUsed] = useState([]);
    const [accessTokenDetails, setAccessToken] = useState([]);
    const [apiKeyDetails, setApiKey] = useState([]);
    const {render, setRender} = Render;

    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const uId = uniqid();
    const createdBy = "system";
    let modifiedOn = createdOn;
    let modifiedBy = "system";

  

    useEffect(()=>{

        axios.get(`${baseUrl}api/v1/getMockTradeDetailsUser/${userId}`)
        .then((res)=>{
            setTradeDetail(res.data)
            console.log(res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readpermissionbyemail/${userId}`)
        .then((res)=>{
            setPermissionDetail(res.data)
            console.log("tradeDetailReal", res.data);
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readtradingAlgo`)
        .then((res)=>{
            setAlgoUsed(res.data)
            console.log(res.data);
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

    }, [render])

    // console.log("tradeDetailReal", permissionDetail)

    const switchButtonFunc = (checkRealTrade)=>{
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

            let transaction_type = tradeDetail[i]._id.lots > 0 ? "BUY" : "SELL";
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
                Quantity: quantity,
                tradeBy: tradeDetail[i]._id.name
            }

            if(checkRealTrade){
                let new_transaction_type = (transaction_type === "SELL") ? "BUY" : "SELL";
                placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, new_transaction_type)
            } else{
                placeLiveOrder(usedAlgoBox[0], detailObj, apiKeyArr, accessTokenArr, transaction_type)
            }
        }

        console.log("checkRealTrade", checkRealTrade)
        if(checkRealTrade){
            changeIsRealTrade(false)
        } else{
            changeIsRealTrade(true)
        }
    }

    const placeLiveOrder = async (algoBox, detailObj, apiKeyArr, accessTokenArr, transaction_type)=>{
  
        const { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, instrumentToken, tradeBy } = detailObj;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
  
        const { apiKey } = apiKeyArr[0];
        const { accessToken } = accessTokenArr[0];
  
        console.log("detailObj", detailObj, apiKey, accessToken, algoBox)
        const res = await fetch(`${baseUrl}api/v1/switchToRealTrade`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                
                apiKey, accessToken, tradeBy,
                exchange, symbol, buyOrSell: transaction_type, realBuyOrSell: transaction_type, Quantity, realQuantity: Quantity, Product, OrderType, 
                validity, variety, createdBy, userId, createdOn, uId, 
                algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                productChange, tradingAccount}, instrumentToken
  
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
                window.alert("on order placing nothing happen");
            }
        }
    }

    const changeIsRealTrade = async (realTrade)=>{
        const response = await fetch(`${baseUrl}api/v1/updaterealtradeenable/${userId}`, {
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

        // render ? setRender(false) : setRender(true);
    }

    console.log("permissionDetail", permissionDetail)
  return (
    <MDBox mt={0.5}>
        <Switch checked={permissionDetail.isRealTradeEnable} onChange={() => {switchButtonFunc(permissionDetail.isRealTradeEnable)}} />
    </MDBox>
  )
}


