import React, {useEffect, useState, useContext} from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from "axios";

// Material Dashboard 2 React components

// Material Dashboard 2 React example components
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


// Data

import OverallPL from './Overall P&L';
import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { userContext } from '../../../AuthContext';
import MDButton from '../../../components/MDButton';
import Button from '@mui/material/Button';

const OverallGrid = ({socket, Render}) => {
    // const { columns, rows } = authorsTableData();
    const { columns, rows } = OverallPL();
    const getDetails = useContext(userContext);
    console.log("getDetails", getDetails)
    const { reRender, setReRender } = Render

    const [menu, setMenu] = useState(null);

    const openMenu = ({ currentTarget }) => setMenu(currentTarget);
    const closeMenu = () => setMenu(null);
  
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [overallPnlArr, setOverallPnlArr] = useState([]);
    const [liveDetail, setLiveDetail] = useState([]);
    const [avgPrice, setAvgPrice] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [instrumentData, setInstrumentData] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [lastestTradeTimearr, setLatestTradeTimearr] = useState([]);
    const [lastestTradeTime, setLatestTradeTime] = useState([]);
    const [lastestTradeBy, setLatestTradeBy] = useState([]);
    const [lastestTradeSymbol, setLatestTradeSymbol] = useState([]);
    const [lastestTradeType, setLatestTradeType] = useState([]);
    const [lastestTradeQunaity, setLatestTradeQuantity] = useState([]);
    const [lastAvgPriceArr, setLastAvgPriceArr] = useState([]);
    // const lastestTradeTime = '';
  
  
    var Total = 0;
    let avgPriceArr = [];
    let liveDetailsArr = [];
    let overallPnl = [];
    let totalTransactionCost = 0;
    let totalGrossPnl = 0;
    
  
  
  
  
    // Get Latest Trade Time Stamp code ends
  
    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/getliveprice`)
      .then((res) => {
          //console.log("live price data", res)
          setMarketData(res.data);
          // setDetails.setMarketData(data);
      }).catch((err) => {
          return new Error(err);
      })
  
      socket.on("tick", (data) => {
        //console.log("this is live market data", data);
        setMarketData(data);
        // setDetails.setMarketData(data);
      })
    }, [])
  
    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
      .then((res) => {
          let dataArr = (res.data).filter((elem) => {
              return elem.status === "Active"
          })
          setInstrumentData(dataArr)
      }).catch((err) => {
          return new Error(err);
      })
    }, [reRender])
  
    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/getavgpricemocktradeparticularuser/${getDetails.userDetails.email}`)
      .then((res) => {
        setLastAvgPriceArr(res.data);
      }).catch((err) => {
          return new Error(err);
      })
  
      axios.get(`${baseUrl}api/v1/getoverallpnlmocktradeparticularusertoday/${getDetails.userDetails.email}`)
      .then((res) => {
          setTradeData(res.data);
      }).catch((err) => {
          return new Error(err);
      })
  
        let hash = new Map();
  
        for(let i = tradeData.length-1; i >= 0 ; i--){ 
            if(hash.has(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product)){
                let obj = hash.get(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product);
                if(tradeData[i]._id.buyOrSell === "BUY"){
                    if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                        obj.totalBuy = Number(tradeData[i].amount)
                        obj.totalBuyLot = (Number(tradeData[i].lots))
                    } else{
                        obj.totalBuy = obj.totalBuy + Number(tradeData[i].amount)
                        obj.totalBuyLot = obj.totalBuyLot + (Number(tradeData[i].lots)) 
                    }
  
                    //console.log("obj.totalBuy", obj.totalBuy, "totalBuyLot", obj.totalBuyLot)
                } if(tradeData[i]._id.buyOrSell === "SELL"){
                    if( obj.totalSell === undefined || obj.totalSellLot === undefined){
  
                        obj.totalSell = Number(tradeData[i].amount)
                        obj.totalSellLot = (Number(tradeData[i].lots)) 
                    } else{
  
                        obj.totalSell = obj.totalSell + Number(tradeData[i].amount)
                        obj.totalSellLot = obj.totalSellLot + (Number(tradeData[i].lots)) 
                    }
  
                    //console.log("obj.totalSell", obj.totalSell, "totalSellLot", obj.totalSellLot)
                }
            }  else{
                if(tradeData[i]._id.buyOrSell === "BUY"){
                    hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                        totalBuy : Number(tradeData[i].amount),
                        totalBuyLot : (Number(tradeData[i].lots)),
                        totalSell: 0,
                        totalSellLot: 0,
                        symbol: tradeData[i]._id.symbol,
                        Product: tradeData[i]._id.Product
                    });
                    // hashForProduct.set(tradeData[i]._id.Product);
  
                }if(tradeData[i]._id.buyOrSell === "SELL"){
                    hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                        totalSell : Number(tradeData[i].amount),
                        totalSellLot : (Number(tradeData[i].lots)),
                        totalBuy : 0,
                        totalBuyLot: 0,
                        symbol: tradeData[i]._id.symbol,
                        Product: tradeData[i]._id.Product
                    });
                    // hashForProduct.set(data[i].Product);
                    
                }
            }
        }
  
        
        for (let value of hash.values()){
            overallPnl.push(value);
        }
  
        
        overallPnl.map((elem)=>{
            //console.log("52");
            instrumentData.map((element)=>{
                //console.log("53");
                if(element.symbol === elem.symbol){
                    //console.log("line 54");
                    marketData.map((subElem)=>{
                        if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                            //console.log(subElem);
                            liveDetailsArr.push(subElem)
                        }
                    })
                }
            })
        })
  
           // Get Lastest Trade timestamp
      axios.get(`${baseUrl}api/v1/getlastestmocktradeparticularuser/${getDetails.userDetails.email}`)
      // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
      .then((res)=>{
          console.log(res.data);
          setLatestTradeTimearr(res.data);
          setLatestTradeTime(res.data.trade_time) ;
          setLatestTradeBy(res.data.createdBy) ;
          setLatestTradeType(res.data.buyOrSell) ;
          setLatestTradeQuantity(res.data.Quantity) ;
          setLatestTradeSymbol(res.data.symbol) ;
            console.log(lastestTradeTimearr);
      }).catch((err) => {
        return new Error(err);
    })
  
        setLatestTradeTime(lastestTradeTime);
  
        setOverallPnlArr(overallPnl);
  
        setLiveDetail(liveDetailsArr);
  
    }, [marketData, getDetails, reRender])
  
    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])
  
    tradeData.map((elem)=>{
        totalTransactionCost += Number(elem.brokerage);
    })

  
    console.log("lastAvgPriceArr", lastAvgPriceArr, overallPnlArr, tradeData)
      overallPnlArr.map((subelem, index)=>{
        let obj = {};
        let tempavgPriceArr = lastAvgPriceArr.filter((element)=>{
          return (subelem.symbol === element._id.symbol) && (subelem.Product === element._id.product);
        })
  
        console.log("tempavgPriceArr", tempavgPriceArr)
  
        let updatedValue = (-(subelem.totalBuy+subelem.totalSell-(subelem.totalBuyLot+subelem.totalSellLot)*liveDetail[index]?.last_price));
        totalGrossPnl += updatedValue;
        const instrumentcolor = subelem.symbol.slice(-2) === "CE" ? "success" : "error"
        const quantitycolor = (subelem.totalBuyLot + subelem.totalSellLot) >= 0 ? "success" : "error"
        const gpnlcolor = updatedValue > 0 ? "success" : "error"
        const pchangecolor = (liveDetail[index]?.change) >= 0 ? "success" : "error"
        const productcolor =  subelem.Product === "NRML" ? "info" : subelem.Product == "MIS" ? "warning" : "error"
        const pchangecolor1 = (liveDetail[index]?.change) >= 0 ? "success" : "error"
        const pchangecolor2 = (((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100) >= 0 ? "success" : "error"
  
        obj.Product = (
          <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
            {(subelem.Product)}
          </MDTypography>
        );
  
        obj.symbol = (
          <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
            {(subelem.symbol)}
          </MDTypography>
        );
  
        obj.Quantity = (
          <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
            {subelem.totalBuyLot + subelem.totalSellLot}
          </MDTypography>
        );
  
        obj.avgPrice = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+tempavgPriceArr[0].average_price.toFixed(2)}
          </MDTypography>
        );
  
        if(!(liveDetail[index]?.last_price)){
          obj.last_price = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
              {"₹"+(liveDetail[index]?.last_price)}
            </MDTypography>
          );
        } else{
          obj.last_price = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
              {"₹"+(liveDetail[index]?.last_price).toFixed(2)}
            </MDTypography>
          );
        }
  
        obj.grossPnl = (
          <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
            {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
          </MDTypography>
        );
  
        if((liveDetail[index]?.change)){
          obj.change = (
            <MDTypography component="a" variant="caption" color={pchangecolor1} fontWeight="medium">
              {(liveDetail[index]?.change) >= 0 ? "+" + (liveDetail[index]?.change).toFixed(2)+"%" : (liveDetail[index]?.change).toFixed(2)+"%"}
            </MDTypography>
          );
        } else{
          obj.change = (
            <MDTypography component="a" variant="caption" color={pchangecolor2} fontWeight="medium">
              {(((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100) >= 0 ?  "+" + (((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%" : (((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%"}
            </MDTypography>
          );
        };
        obj.exit = (
          <MDButton variant="contained" color="info">Exit Position</MDButton>
        );
        //console.log(obj)
        rows.push(obj);
      })
  
  
    let obj = {};
    let totalnpnlcolor1 = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
    let totalgpnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  
    obj.Product = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {}
      </MDTypography>
    );
  
    obj.symbol = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        {}
      </MDTypography>
    );
  
    obj.Quantity = (
      <MDTypography component="a" variant="caption"  fontWeight="medium">
        Transaction Cost
      </MDTypography>
    );
  
    obj.avgPrice = (
      <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        {"₹"+(totalTransactionCost).toFixed(2)}
      </MDTypography>
    );
  
    obj.last_price = (
      <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
        Gross P&L
      </MDTypography>
    );
  
  
    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={totalgpnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
      </MDTypography>
    );
  
    obj.change = (
      <MDTypography component="a" variant="caption" color={totalnpnlcolor1} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
      </MDTypography>
    );
  
    rows.push(obj);


    return (<>
                <MDBox pt={4} pb={2}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={1}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                      }}>

                                    <MDTypography variant="h6" color="white" py={1}>
                                        Overall P&L
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{columns, rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid> 
                </MDBox> 
                </>
    )
}

export default OverallGrid;