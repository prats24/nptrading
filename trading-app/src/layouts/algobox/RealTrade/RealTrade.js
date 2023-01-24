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
    const [tradeData, setTradeData] = useState([]);
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
    const createdBy = getDetails.userDetails.name;

    const allUserRunningPnl = [];
    const companyAllRunningPnl = [];
    // useEffect(()=>{
    //     axios.get(`${baseUrl}api/v1/readpermission`)
    //     .then((res)=>{
    //         let permissionData = res.data

    //         let perticularAlgo = tradingAlgo.filter((elem)=>{
    //             return elem._id === id && elem.status === "Active";
    //         })
    
    //         let mappedUser = permissionData.filter((elem)=>{
    //             return perticularAlgo[0].algoName === elem.algoName;
    //         })

    //         setMappedUser(mappedUser);


    
    //     }).catch((err)=>{
    //         window.alert("Server Down");
    //         return new Error(err);
    //     })

    //     axios.get(`${baseUrl}api/v1/readRequestToken`)
    //     .then((res) => {
    //         let activeAccessToken = (res.data).filter((elem)=>{
    //             return elem.status === "Active"
    //         })
    //         setAccessToken(activeAccessToken);
    //     }).catch((err)=>{
            
    //         return new Error(err);
    //     })

    //     axios.get(`${baseUrl}api/v1/readAccountDetails`)
    //     .then((res) => {
    //         let activeApiKey = (res.data).filter((elem)=>{
    //             return elem.status === "Active"
    //         })
    //         setApiKey(activeApiKey);
    //     }).catch((err)=>{
            
    //         return new Error(err);
    //     })

    //     axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
    //     .then((res) => {
    //         let dataArr = (res.data).filter((elem) => {
    //             return elem.status === "Active"
    //         })
    //         setTradeData(dataArr)
    //     }).catch((err)=>{
            
    //         return new Error(err);
    //     })

    // }, [])

    // console.log("mappedUser", mappedUser);

    mappedUser.map((elem)=>{
        // console.log(oneUserRunningPnl(elem));
        // allUserRunningPnl.push(oneUserRunningPnl(elem))
        axios.get(`${baseUrl}api/v1/readmocktradeuserDate/${elem.userId}`)
        .then((res) => {
            // let singleUserPnl = (res.data).filter((element)=>{
            //     return element.order_timestamp.includes(todayDate) && element.status === "COMPLETE" && element.userId === elem.userId;
            // })
            // setSingleUserPnl(data);

            let hash = mappedUserHelper(res.data, elem);
            // console.log(hash);
            let runningPnl = [];
            for (let value of hash.values()){
                runningPnl.push(value);
            }
    
            // console.log(runningPnl);
            allUserRunningPnl.push(runningPnl)
            console.log(allUserRunningPnl);

        }).catch((err)=>{
            return new Error(err);
        })


        axios.get(`${baseUrl}api/v1/companylivetradedatatodaywithemail/${elem.userId}`)
        .then((res) => {
            let singleUserCompanyPnl = (res.data).filter((element)=>{
                return element.createdOn.includes(todayDate) && element.status === "COMPLETE" && element.userId === elem.userId;
            })

            let hash = mappedUserHelper(singleUserCompanyPnl, elem);
            // console.log(hash);
            let runningPnl = [];
            for (let value of hash.values()){
                runningPnl.push(value);
            }
    
            // console.log(runningPnl);
            companyAllRunningPnl.push(runningPnl)
            // console.log(companyAllRunningPnl);

        }).catch((err)=>{
            return new Error(err);
        })
    })

    function mappedUserHelper(tradeDataArr, mappedUserElem){
        let hash = new Map();
        for(let i = tradeDataArr.length-1; i >= 0 ; i--){
            if(hash.has(tradeDataArr[i].symbol)){
                let obj = hash.get(tradeDataArr[i].symbol);
                if(Number(tradeDataArr[i].Quantity) + Number(obj.Quantity) === 0){
                    obj.average_price = 0;
                }else{
                    obj.average_price = ((Number(obj.average_price) * Number(obj.Quantity)) 
                                    + (Number(tradeDataArr[i].average_price) * Number(tradeDataArr[i].Quantity)))/(Number(tradeDataArr[i].Quantity) 
                                    + Number(obj.Quantity));
                }
                obj.Quantity = Number(obj.Quantity) + Number(tradeDataArr[i].Quantity)
                if(Number(obj.Quantity) > 0){
                    obj.buyOrSell = "BUY";
                } else if((obj.Quantity) < 0){
                    obj.buyOrSell = "SELL"
                } 

            } else{
                hash.set(tradeDataArr[i].symbol, {
                    buyOrSell : tradeDataArr[i].buyOrSell,
                    Quantity : Number(tradeDataArr[i].Quantity),
                    average_price: Number(tradeDataArr[i].average_price),
                    Product: tradeDataArr[i].Product,
                    symbol: tradeDataArr[i].symbol,
                    userId: mappedUserElem.userId,
                    userName: mappedUserElem.userName,
                    exchange: tradeDataArr[i].exchange
                })
            }
        }
        return hash;
    }

    function takingTrade(data){
        console.log("inside taking trade")
        let perticularAlgo = tradingAlgo.filter((elem)=>{
            return elem._id === id && elem.status === "Active";
        })
    
        if (perticularAlgo[0].transactionChange === "TRUE") {
            if(data.buyOrSell === "SELL"){
                companyTrade.realBuyOrSell = "BUY"
            } else{
                companyTrade.realBuyOrSell = "SELL"
            }
        } else {
            companyTrade.realBuyOrSell = data.buyOrSell
        }

        companyTrade.realSymbol = data.symbol
        companyTrade.exchange = data.exchange;

        companyTrade.realQuantity = perticularAlgo[0].lotMultipler * Math.abs(data.Quantity);
        accessTokenDetails = accessTokenDetails.filter((element) => {
            return perticularAlgo[0].tradingAccount === element.accountId
        })
        setAccessToken(accessTokenDetails);
        apiKeyDetails = apiKeyDetails.filter((element) => {
            return perticularAlgo[0].tradingAccount === element.accountId
        })
        setApiKey(apiKeyDetails);

        setCompanyTrade(companyTrade)
        // console.log(JSON.parse(JSON.stringify(companyTrade)));

        sendOrderReq(data.userName, data.userId);

    }

    function squareOffTrade(data){
        companyTrade.realSymbol = data.symbol;
        companyTrade.exchange = data.exchange;
        companyTrade.realQuantity = data.Quantity;
        companyTrade.OrderType = data.order_type;
        companyTrade.Product = data.Product;
        companyTrade.validity = data.validity;
        companyTrade.variety = data.variety;

        if(data.buyOrSell === "BUY"){
            companyTrade.realBuyOrSell = "SELL";
        } else{
            companyTrade.realBuyOrSell = "BUY";
        }

        let perticularAlgo = tradingAlgo.filter((elem)=>{
            return elem._id === id && elem.status === "Active";
        })
        accessTokenDetails = accessTokenDetails.filter((element) => {
            return perticularAlgo[0].tradingAccount === element.accountId
        })
        setAccessToken(accessTokenDetails);
        apiKeyDetails = apiKeyDetails.filter((element) => {
            return perticularAlgo[0].tradingAccount === element.accountId
        })
        setApiKey(apiKeyDetails);

        setCompanyTrade(companyTrade)

        sendOrderReq(data.userName, data.userId)
    }

    function takeTradeTurnOn(){
        console.log("allUserRunningPnl", allUserRunningPnl);
        allUserRunningPnl.map((elem)=>{
            elem.map((subElem)=>{
                takingTrade(subElem);
            })
        })
    }

    function takeTradeTurnOff(){
        // console.log("companyAllRunningPnl", companyAllRunningPnl);
        companyAllRunningPnl.map((elem)=>{
            elem.map((subElem)=>{
                // console.log("subElem", subElem);
                // console.log("elem", elem);
                squareOffTrade(subElem);
            })
        })
    }

    function functionality(){

        if(realTrade.current){
            realTrade.current = false;
        } else{
            realTrade.current = true;
        }
        
        // console.log(realTrade.current);
        patchReq(id, realTrade.current);

        if(realTrade.current){
            console.log("when turn on");
            takeTradeTurnOn();
        } else{
            console.log("when turn off");
            takeTradeTurnOff();
        }

        reRender ? setReRender(false) : setReRender(true)
    }

    async function patchReq(id, realTrade){
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

    async function sendOrderReq(name, userId, algoBox, realTrade) {
        // const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety, last_price, instrumentToken } = Details;
        const { algoName, transactionChange, instrumentChange, exchangeChange, lotMultipler, productChange, tradingAccount } = algoBox;
        const { realBuyOrSell, realSymbol, realQuantity, realInstrument, realBrokerage, realAmount, real_last_price } = companyTrade;
        
        const { apiKey } = apiKeyDetails[0];
        const { accessToken } = accessTokenDetails[0];
        console.log("inside sendOrder")
        const res = await fetch(`${baseUrl}api/v1/placeorder`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({

            })
        });
        const dataResp = await res.json();
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            // console.log("Failed to Trade");
        } else {
            // console.log(dataResp);
            // window.alert("Trade succesfull");
            console.log("entry succesfull");
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




