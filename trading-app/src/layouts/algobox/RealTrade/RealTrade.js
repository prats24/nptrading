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
    const [mockTradeData, setMockTradeData] = useState([]);
    const [realTradeData, setRealTradeData] = useState([]);
    let buttoncolor = buttonText == "ON" ? "success" : "error"

    const [companyTrade, setCompanyTrade] = useState({
        realSymbol: "",
        exchange: "",
        realBuyOrSell: "",
        OrderType: "MARKET",
        realQuantity: "",
        Product: "MIS",
        validity: "DAY",
        variety: "regular"
    })

    let date = new Date();
    let todayDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let fake_date = "10-12-2022"
    let fake_date1 = "9-12-2022"

    const uId = uniqid();
    const createdOn = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const tradeBy = "Admin"
    let modifiedOn = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let modifiedBy = "Admin";
  

    const allUserRunningPnl = [];
    const companyAllRunningPnl = [];
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

        axios.get(`${baseUrl}api/v1/getMockTradeDetailsAllUser`)
        .then((res) => {
            setMockTradeData(res.data)
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/getLiveTradeDetailsAllUser`)
        .then((res) => {
            setRealTradeData(res.data)
        }).catch((err)=>{
            return new Error(err);
        })

    }, [])

    console.log("mappedUser", mappedUser);

    // mappedUser.map((elem)=>{
    //     // console.log(oneUserRunningPnl(elem));
    //     // allUserRunningPnl.push(oneUserRunningPnl(elem))
    //     axios.get(`${baseUrl}api/v1/readmocktradeuserDate/${elem.userId}`)
    //     .then((res) => {
    //         // let singleUserPnl = (res.data).filter((element)=>{
    //         //     return element.order_timestamp.includes(todayDate) && element.status === "COMPLETE" && element.userId === elem.userId;
    //         // })
    //         // setSingleUserPnl(data);

    //         let hash = mappedUserHelper(res.data, elem);
    //         // console.log(hash);
    //         let runningPnl = [];
    //         for (let value of hash.values()){
    //             runningPnl.push(value);
    //         }
    
    //         // console.log(runningPnl);
    //         allUserRunningPnl.push(runningPnl)
    //         console.log(allUserRunningPnl);

    //     }).catch((err)=>{
    //         return new Error(err);
    //     })


    //     axios.get(`${baseUrl}api/v1/companylivetradedatatodaywithemail/${elem.userId}`)
    //     .then((res) => {
    //         let singleUserCompanyPnl = (res.data).filter((element)=>{
    //             return element.createdOn.includes(todayDate) && element.status === "COMPLETE" && element.userId === elem.userId;
    //         })

    //         let hash = mappedUserHelper(singleUserCompanyPnl, elem);
    //         // console.log(hash);
    //         let runningPnl = [];
    //         for (let value of hash.values()){
    //             runningPnl.push(value);
    //         }
    
    //         // console.log(runningPnl);
    //         companyAllRunningPnl.push(runningPnl)
    //         // console.log(companyAllRunningPnl);

    //     }).catch((err)=>{
    //         return new Error(err);
    //     })
    // })

    // function mappedUserHelper(tradeDataArr, mappedUserElem){
    //     let hash = new Map();
    //     for(let i = tradeDataArr.length-1; i >= 0 ; i--){
    //         if(hash.has(tradeDataArr[i].symbol)){
    //             let obj = hash.get(tradeDataArr[i].symbol);
    //             if(Number(tradeDataArr[i].Quantity) + Number(obj.Quantity) === 0){
    //                 obj.average_price = 0;
    //             }else{
    //                 obj.average_price = ((Number(obj.average_price) * Number(obj.Quantity)) 
    //                                 + (Number(tradeDataArr[i].average_price) * Number(tradeDataArr[i].Quantity)))/(Number(tradeDataArr[i].Quantity) 
    //                                 + Number(obj.Quantity));
    //             }
    //             obj.Quantity = Number(obj.Quantity) + Number(tradeDataArr[i].Quantity)
    //             if(Number(obj.Quantity) > 0){
    //                 obj.buyOrSell = "BUY";
    //             } else if((obj.Quantity) < 0){
    //                 obj.buyOrSell = "SELL"
    //             } 

    //         } else{
    //             hash.set(tradeDataArr[i].symbol, {
    //                 buyOrSell : tradeDataArr[i].buyOrSell,
    //                 Quantity : Number(tradeDataArr[i].Quantity),
    //                 average_price: Number(tradeDataArr[i].average_price),
    //                 Product: tradeDataArr[i].Product,
    //                 symbol: tradeDataArr[i].symbol,
    //                 userId: mappedUserElem.userId,
    //                 userName: mappedUserElem.userName,
    //                 exchange: tradeDataArr[i].exchange
    //             })
    //         }
    //     }
    //     return hash;
    // }

    // console.log("tradingAlgo", tradingAlgo)

    function MockToReal(data, isSquaringOff){
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
                    createdBy: elem._id.name,
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

    // function squareOffTrade(data){
    //     companyTrade.realSymbol = data.symbol;
    //     companyTrade.exchange = data.exchange;
    //     companyTrade.realQuantity = data.Quantity;
    //     companyTrade.OrderType = data.order_type;
    //     companyTrade.Product = data.Product;
    //     companyTrade.validity = data.validity;
    //     companyTrade.variety = data.variety;

    //     if(data.buyOrSell === "BUY"){
    //         companyTrade.realBuyOrSell = "SELL";
    //     } else{
    //         companyTrade.realBuyOrSell = "BUY";
    //     }

    //     let perticularAlgo = tradingAlgo.filter((elem)=>{
    //         return elem._id === id && elem.status === "Active";
    //     })
    //     accessTokenDetails = accessTokenDetails.filter((element) => {
    //         return perticularAlgo[0].tradingAccount === element.accountId
    //     })
    //     setAccessToken(accessTokenDetails);
    //     apiKeyDetails = apiKeyDetails.filter((element) => {
    //         return perticularAlgo[0].tradingAccount === element.accountId
    //     })
    //     setApiKey(apiKeyDetails);

    //     setCompanyTrade(companyTrade)

    //     sendOrderReq(data.userName, data.userId)
    // }

    // function takeTradeTurnOn(){
    //     console.log("allUserRunningPnl", allUserRunningPnl);
    //     allUserRunningPnl.map((elem)=>{
    //         elem.map((subElem)=>{
    //             MockToReal(subElem);
    //         })
    //     })
    // }

    // function takeTradeTurnOff(){
    //     // console.log("companyAllRunningPnl", companyAllRunningPnl);
    //     companyAllRunningPnl.map((elem)=>{
    //         elem.map((subElem)=>{
    //             // console.log("subElem", subElem);
    //             // console.log("elem", elem);
    //             squareOffTrade(subElem);
    //         })
    //     })
    // }

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
            MockToReal(realTradeData, true)
        } else{
            changeAllUserRealTrade(true)
            realTrade.current = true;
            MockToReal(mockTradeData, false)
        }
        
        // console.log(realTrade.current);
        patchReqForRealTradeSwitching(id, realTrade.current);

        // if(realTrade.current){
        //     console.log("when turn on");
        //     takeTradeTurnOn();
        // } else{
        //     console.log("when turn off");
        //     takeTradeTurnOff();
        // }

        reRender ? setReRender(false) : setReRender(true)
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
  
        const { exchange, symbol, buyOrSell, Quantity, Product, OrderType, validity, variety, instrumentToken, createdBy, userId } = detailObj;
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




