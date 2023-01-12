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

export default function AllInactiveAccounts() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readAccountDetails`)
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

  let inactiveaccountsarr = [];
  
  inactiveData.map((elem)=>{
    let inactiveaccounts = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    inactiveaccounts.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    inactiveaccounts.broker = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerName}
      </MDTypography>
    );
    inactiveaccounts.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    inactiveaccounts.accountname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountName}
      </MDTypography>
    );
    inactiveaccounts.apikey = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiKey}
      </MDTypography>
    );
    inactiveaccounts.apisecret = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiSecret}
      </MDTypography>
    );
    inactiveaccounts.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    inactiveaccounts.createdon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );
   
    
    console.log(typeof(inactiveaccounts));
    console.log(inactiveaccounts)
    inactiveaccountsarr.push(inactiveaccounts)
  })


  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Broker", accessor: "broker", align: "center" },
      { Header: "Account ID", accessor: "accountid", align: "center" },
      { Header: "Account Name", accessor: "accountname", align: "center" },
      { Header: "API Key", accessor: "apikey", align: "center" },
      { Header: "API Secret", accessor: "apisecret", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Created On", accessor: "createdon", align: "center" },
    ],

    rows: inactiveaccountsarr,
  };
}
