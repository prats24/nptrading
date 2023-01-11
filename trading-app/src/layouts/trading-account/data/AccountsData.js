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

export default function AllActiveAccounts() {

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

  console.log(activeData);

  
  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)

  let activeaccountsarr = [];
  
  activeData.map((elem)=>{
    let activeaccounts = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    activeaccounts.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    activeaccounts.broker = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.brokerName}
      </MDTypography>
    );
    activeaccounts.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    activeaccounts.accountname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountName}
      </MDTypography>
    );
    activeaccounts.apikey = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiKey}
      </MDTypography>
    );
    activeaccounts.apisecret = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.apiSecret}
      </MDTypography>
    );
    activeaccounts.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    activeaccounts.createdon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );
   
    
    console.log(typeof(activeaccounts));
    console.log(activeaccounts)
    activeaccountsarr.push(activeaccounts)
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

    rows: activeaccountsarr,
  };
}
