import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
//

// Material Dashboard 2 React components

import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import EditSharpIcon from '@mui/icons-material/EditSharp';


export default function AllInActiveInstruments() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
      .then((res)=>{
        let data = res.data;
                let active = data.filter((elem) => {
                    return elem.status === "Active"
                })
                setActiveData(active);
                console.log(active);

                let inActive = data.filter((elem) => {
                    return elem.status === "Inactive"
                })
                setInactiveData(inActive);
                console.log(inactiveData);
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(inactiveData);

  
  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)

  let inactiveinsturmentsarr = [];
  
  inactiveData.map((elem)=>{
    let inactiveinstruments = {}
    const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
    
    inactiveinstruments.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    inactiveinstruments.instruments = (
      <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    inactiveinstruments.contractdate = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.contractDate}
      </MDTypography>
    );
    inactiveinstruments.exchange = (
      <MDTypography component="a" href="#" variant="caption" color={exchangecolor} fontWeight="medium">
        {elem.exchange}
      </MDTypography>
    );
    inactiveinstruments.lotsize = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.lotSize}
      </MDTypography>
    );
    inactiveinstruments.maxquantity = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.maxLot}
      </MDTypography>
    );
    inactiveinstruments.status = (
      <MDTypography component="a" href="#" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    inactiveinstruments.createdon = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );
   
    
    console.log(typeof(inactiveinstruments));
    console.log(inactiveinstruments)
    inactiveinsturmentsarr.push(inactiveinstruments)
  })

  return {

    columns: [
        { Header: "Edit", accessor: "edit", align: "center", width:"3%" },
        { Header: "Instruments", accessor: "instruments", align: "center" },
        { Header: "Contract Date", accessor: "contractdate", align: "center" },
        { Header: "Exchange", accessor: "exchange", align: "center" },
        { Header: "Lot Size", accessor: "lotsize", align: "center" },
        { Header: "Max Quantity", accessor: "maxquantity", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Created On", accessor: "createdon", align: "center" },
        
      ],

      rows: inactiveinsturmentsarr

  };
}
