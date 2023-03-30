
// @mui material components
import MDTypography from "../../../../../components/MDTypography";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Data() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    
  const [instrumentData, setInstrumentData] = useState([]);

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
  }, [])

    let instrumentDetailArr = [];
    //console.log("instrumentData", instrumentData)
    instrumentData.map((elem)=>{
    let instrumentDetailObj = {}

    const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
    // const percentagechangecolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

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

    instrumentDetailObj.instrumentToken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.instrumentToken}
      </MDTypography>
    );

    instrumentDetailArr.push(instrumentDetailObj)
  })

  return {
    columns: [
      { Header: "contract date", accessor: "contractDate", width: "10%", align: "center" },
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "ltp", accessor: "last_price", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },
      // { Header: "buy", accessor: "buy", width: "5%", align: "center" },
      // { Header: "sell", accessor: "sell", width: "5%", align: "center" },
    ],

    rows: instrumentDetailArr,
    instrumentData: instrumentData
  };
}
