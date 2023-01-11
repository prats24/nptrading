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

export default function AllActiveAccessTokens() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  const [inactiveData, setInactiveData] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readRequestToken`)
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

  let activeparameterarr = [];
  
  activeData.map((elem)=>{
    let activeparameter = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    activeparameter.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    activeparameter.accountid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accountId}
      </MDTypography>
    );
    activeparameter.accesstoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.accessToken}
      </MDTypography>
    );
    activeparameter.requesttoken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.requestToken}
      </MDTypography>
    );
    activeparameter.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    activeparameter.generatedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.generatedOn}
      </MDTypography>
    );
   
    
    console.log(typeof(activeparameter));
    console.log(activeparameter)
    activeparameterarr.push(activeparameter)
  })

  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Account ID", accessor: "accountid", align: "center" },
      { Header: "Access Token", accessor: "accesstoken", align: "center" },
      { Header: "Request Token", accessor: "requesttoken", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Generated On", accessor: "generatedon", align: "center" },
     
    ],

    rows: activeparameterarr,
  };
}
