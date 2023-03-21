import React, { useEffect, useState } from 'react'
import axios from "axios"
import uniqid from "uniqid";
import MDBox from "../../components/MDBox";
import Switch from "@mui/material/Switch";



export default function TraderSetting({userId, isRealTradeEnable}) {

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
    const [isChecked, setIsChecked] = useState(isRealTradeEnable)

    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const uId = uniqid();
    const tradeBy = "System";
    let modifiedOn = createdOn;
    let modifiedBy = "System";
    let checkingMultipleAlgoFlag = 1;

    console.log("rendering", userId)

    const switchButtonFunc = async (checkRealTrade)=>{
        console.log("checkRealTrade", checkRealTrade)

        const res = await fetch(`${baseUrl}api/v1/swichingTrade`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId, isChecked
            })
        });
        const dataResp = await res.json();
        // console.log("dataResp", dataResp)
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


        console.log("checkRealTrade", checkRealTrade)
        if(checkRealTrade){
            changeIsRealTrade(false)
            // setRealTradeState(false)
        } else{
            changeIsRealTrade(true)
            
        }

        // props.handleSwitchChange(userId)
    }
// onChange={() => props.handleSwitchChange(user.id)}
    const placeLiveOrder = async (algoBox, detailObj, apiKeyArr, accessTokenArr, transaction_type, quantity)=>{
        
        const { exchange, symbol, buyOrSell, Product, OrderType, validity, variety, instrumentToken, tradeBy } = detailObj;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount, _id, marginDeduction, isDefault } = algoBox;
  
        const { apiKey } = apiKeyArr[0];
        const { accessToken } = accessTokenArr[0];
  
        console.log("squaring off detailObj", detailObj, apiKey, accessToken, algoBox)
        const res = await fetch(`${baseUrl}api/v1/switchToRealTrade`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                
                // apiKey, accessToken, tradeBy: createdBy,
                // exchange, symbol, buyOrSell: transaction_type, realBuyOrSell: transaction_type, Quantity: quantity, realQuantity: quantity, Product, OrderType, 
                // validity, variety, createdBy: tradeBy, userId, createdOn, uId, 
                // algoBox: {algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, 
                // productChange, tradingAccount, _id, marginDeduction, isDefault}, instrumentToken, checkingMultipleAlgoFlag
  
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
        setIsChecked(realTrade)
    
    }

    // let real;
    // console.log("props", props)
    // props.users.map((elem)=>{
    //     if(elem.userId === userId){
    //         real = (elem.isRealTradeEnable);
    //     }
    // })
  return (


    // props.users.map((elem)=>{
    //     console.log("elem.userId === userId", elem.userId, userId)

    //     if(elem.userId === userId && elem.algoName === algoName){
    //         // real = (elem.isRealTradeEnable);
    //         return(
            <MDBox mt={0.5}>
            <Switch  checked={isChecked}   onChange={() => {switchButtonFunc(isChecked)}} />
            </MDBox>
    //         )
    //     }
    // })

  )
}