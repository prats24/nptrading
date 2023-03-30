
// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

import { useEffect, useState, memo } from "react";
import axios from "axios";
import BuyModel from "./BuyModel";
import SellModel from "./SellModel";
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


function Data(reRender, socket) {

  console.log("user position rendering in data")

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const [instrumentData, setInstrumentData] = useState([]);
  // const [marketData, setMarketData] = useState([]);
  // const [livedata, setLiveData] = useState([]);

  // const Company = ({ image, name }) => (
  //   <MDBox display="flex" alignItems="center" lineHeight={1}>
  //     <MDAvatar src={image} name={name} size="sm" />
  //     <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
  //       {name}
  //     </MDTypography>
  //   </MDBox>
  // );

  console.log(reRender)

  useEffect(()=>{
    console.log("user position rendering in data in useEffect")

    axios.get(`${baseUrl}api/v1/instrumentDetails`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res) => {

        console.log("rows data inside", res.data)
        let instrumentTokenArr = [];
        (res.data).map((elem)=>{
          instrumentTokenArr.push(elem.instrumentToken)
        })

        socket.emit("subscribeToken", instrumentTokenArr);
        setInstrumentData(res.data)
    }).catch((err) => {
        return new Error(err);
    })
  }, [reRender])

    let instrumentDetailArr = [];
    console.log("rows data", instrumentData, reRender)
    instrumentData.map((elem)=>{
    let instrumentDetailObj = {}

    const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
    const percentagechangecolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    instrumentDetailObj.instrument = (
      <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.instrument}
      </MDTypography>
    );
    instrumentDetailObj.symbol = (
      <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    instrumentDetailObj.quantity = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    instrumentDetailObj.contractDate = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {elem.contractDate}
      </MDTypography>
    );
    // instrumentDetailObj.avgprice = (
    //   <MDTypography variant="caption" color="text" fontWeight="medium">
    //     ₹{elem.average_price}
    //   </MDTypography>
    // );
    // instrumentDetailObj.buy = (
    //     <BuyModel symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot}/>
    // );
    
    // instrumentDetailObj.sell = (
    //   <SellModel symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={elem.instrument} lotSize={elem.lotSize} maxLot={elem.maxLot}/>
    // );

    instrumentDetailObj.instrumentToken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.instrumentToken}
      </MDTypography>
    );
    instrumentDetailObj.chart = (
      <MDTypography component="a" href="https://in.investing.com/indices/s-p-cnx-nifty-chart" target="_blank" variant="caption" color="text" fontWeight="medium">
        <TrendingUpIcon fontSize="medium"/>
      </MDTypography>
    );

    //console.log(typeof(instrumentDetailObj));
    //console.log(instrumentDetailObj)
    instrumentDetailArr.push(instrumentDetailObj)
    })

  return {
    columns: [
      { Header: "contract date", accessor: "contractDate", width: "10%", align: "center" },
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "ltp", accessor: "last_price", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },
      { Header: "Chart", accessor: "chart", width: "5%", align: "center" },
      { Header: "buy", accessor: "buy", width: "5%", align: "center" },
      { Header: "sell", accessor: "sell", width: "5%", align: "center" },
      { Header: "remove", accessor: "remove", width: "5%", align: "center" }
    ],

    rows: instrumentDetailArr,
    instrumentData: instrumentData
  };
}

export default Data;
