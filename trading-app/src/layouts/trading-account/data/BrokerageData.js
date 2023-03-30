import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function AllActiveBrokerages() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readBrokerage`)
      .then((res)=>{
        // let data = res.data;
                setActiveData(res.data);
                console.log(activeData);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(activeData);

  
  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)

  let activebrokeragearr = [];
  
  activeData.map((elem)=>{
    let activebrokerage = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    activebrokerage.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    activebrokerage.broker = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerName}
      </MDTypography>
    );
    activebrokerage.transaction = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.transaction}
      </MDTypography>
    );
    activebrokerage.type = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.type}
      </MDTypography>
    );
    activebrokerage.exchange = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.exchange}
      </MDTypography>
    );
    activebrokerage.brokeragecharge = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerageCharge}
      </MDTypography>
    );
    activebrokerage.exchangecharge = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.exchangeCharge}
      </MDTypography>
    );
    activebrokerage.gst = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.gst}
      </MDTypography>
    );
    activebrokerage.sebicharges = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.sebiCharge}
      </MDTypography>
    );
    activebrokerage.stampdutycharges = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.stampDuty}
      </MDTypography>
    );
    activebrokerage.sst = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.sst}
      </MDTypography>
    );
    activebrokerage.ctt = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.ctt}
      </MDTypography>
    );
    activebrokerage.dpcharges = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.dpCharge}
      </MDTypography>
    );
   
    
    console.log(typeof(activebrokerage));
    console.log(activebrokerage)
    activebrokeragearr.push(activebrokerage)
  })

  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Broker", accessor: "broker", align: "center" },
      { Header: "Transaction", accessor: "transaction", align: "center" },
      { Header: "Type", accessor: "type", align: "center" },
      { Header: "Exchange", accessor: "exchange", align: "center" },
      { Header: "Brokerage Charge", accessor: "brokeragecharge", align: "center" },
      { Header: "Exchange Charge", accessor: "exchangecharge", align: "center" },
      { Header: "GST(%)", accessor: "gst", align: "center" },
      { Header: "SEBI Charges", accessor: "sebicharges", align: "center" },
      { Header: "Stamp Duty Charges", accessor: "stampdutycharges", align: "center" },
      { Header: "SST", accessor: "sst", align: "center" },
      { Header: "CTT", accessor: "ctt", align: "center" },
      { Header: "DP Charges", accessor: "dpcharges", align: "center" },
    ],

    rows: activebrokeragearr,
  };
}
