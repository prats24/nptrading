import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react'
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid";
import MDButton from "../../../components/MDBox";


export default function RealTrade({Render, id, buttonTextBool, tradingAlgo}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const getDetails = useContext(userContext);
    const { reRender, setReRender } = Render;
    let realTrade = useRef(buttonTextBool);
    let buttonText = buttonTextBool ? "ON" : "OFF"
    const [mappedUser, setMappedUser] = useState([]);
    let [accessTokenDetails, setAccessToken] = useState([]);
    let [apiKeyDetails, setApiKey] = useState([]);
    let buttoncolor = buttonText == "ON" ? "success" : "error"


    let date = new Date();

    const uId = uniqid();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}:${String(date.getMilliseconds()).padStart(2, '0')}`

    const createdBy = getDetails.userDetails.name;
    let modifiedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let modifiedBy = getDetails.userDetails.name;
  

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readpermission`)
        .then((res)=>{
            let permissionData = res.data

            let perticularAlgo = tradingAlgo.filter((elem)=>{
                return elem._id === id && elem.status === "Active";
            })
    
            let mappedUser = permissionData.filter((elem)=>{
                return perticularAlgo[0].algoName === elem.algoName;
            })

            setMappedUser(mappedUser);


    
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readRequestToken`)
        .then((res) => {
            let activeAccessToken = (res.data).filter((elem)=>{
                return elem.status === "Active"
            })
            setAccessToken(activeAccessToken);
        }).catch((err)=>{
            
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readAccountDetails`)
        .then((res) => {
            let activeApiKey = (res.data).filter((elem)=>{
                return elem.status === "Active"
            })
            setApiKey(activeApiKey);
        }).catch((err)=>{
            
            return new Error(err);
        })

    }, [])


    function takingTradeHelper(data, isSquaringOff){
        data.map((elem)=>{
            if(elem.lots && elem._id.algoBoxName === tradingAlgo[0].algoName){

                let apiKeyArr = apiKeyDetails.filter((elem)=>{
                    return elem.accountId == tradingAlgo[0]?.tradingAccount
                })
    
                let accessTokenArr = accessTokenDetails.filter((elem)=>{
                    return elem.accountId == tradingAlgo[0]?.tradingAccount
                })
    
                let transaction_type = elem.lots > 0 ? "BUY" : "SELL";
                let quantity = Math.abs(elem.lots);
                let detailObj = {
                    symbol: elem._id.symbol,
                    Product: elem._id.product,
                    instrumentToken: elem._id.instrumentToken,
                    exchange: elem._id.exchange,
                    validity: elem._id.validity,
                    OrderType: elem._id.order_type,
                    variety: elem._id.variety,
                    buyOrSell: transaction_type,
                    Quantity: quantity,
                    tradeBy: elem._id.name,
                    userId: elem._id.userId
                }

                if(isSquaringOff){
                    let new_transaction_type = (transaction_type === "SELL") ? "BUY" : "SELL";
                    placeLiveOrder(tradingAlgo[0], detailObj, apiKeyArr, accessTokenArr, new_transaction_type)
                } else{
                    placeLiveOrder(tradingAlgo[0], detailObj, apiKeyArr, accessTokenArr, transaction_type)
                }

            }
        })

    }


    function changeAllUserRealTrade(realTrade){
        mappedUser.map(async (elem)=>{
            const response = await fetch(`${baseUrl}api/v1/updaterealtradeenable/${elem.userId}`, {
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
        })
    }

    function functionality(){

        if(realTrade.current){
            // real trade off meaning squaring off from all trade
            changeAllUserRealTrade(false)
            realTrade.current = false;
            axios.get(`${baseUrl}api/v1/getLiveTradeDetailsAllUser`)
            .then((res) => {
                takingTradeHelper(res.data, true)
            }).catch((err)=>{
                return new Error(err);
            })
            
        } else{
            changeAllUserRealTrade(true)
            realTrade.current = true;
            axios.get(`${baseUrl}api/v1/getMockTradeDetailsAllUser`)
            .then((res) => {
                takingTradeHelper(res.data, false)
            }).catch((err)=>{
                return new Error(err);
            })
        }
        
        patchReqForRealTradeSwitching(id, realTrade.current);

        reRender ? setReRender(false) : setReRender(true);
    }


    async function patchReqForRealTradeSwitching(id, realTrade){
        const res = await fetch(`${baseUrl}api/v1/readtradingAlgo/${id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                realTrade
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Edit");
        } else {
            // console.log(dataResp);
            window.alert("Switched succesfull");
            // console.log("Edit succesfull");
        }
        reRender ? setReRender(false) : setReRender(true)
    }

    const placeLiveOrder = async (algoBox, detailObj, apiKeyArr, accessTokenArr, transaction_type)=>{
  
        const { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, instrumentToken, tradeBy, userId } = detailObj;
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

  return (
    <>
    <MDButton variant="outlined" bgColor="white" color={buttoncolor} fontWeight="medium" sx={{width: "50px", cursor: "pointer"}} onClick={()=>{functionality()}}>
    {buttonText}
    </MDButton>
        
    </>
  )
}




