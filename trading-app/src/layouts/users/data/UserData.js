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

export default function AllActiveUsers() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [activeData, setActiveData] = useState([]);
  // const [inactiveData, setInactiveData] = useState([]);

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readuserdetails`)
      .then((res)=>{
        let data = res.data;
                let active = data.filter((elem) => {
                    return elem.status === "Active"
                })
                setActiveData(active);
                console.log(active);

                // let inActive = data.filter((elem) => {
                //     return elem.status === "Inactive"
                // })
                // setInactiveData(inActive);
                // console.log(inactiveData);
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(activeData);
  // console.log(inactiveData);

  
  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)

  let activeusersarr = [];
  
  activeData.map((elem)=>{
    let activeusers = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
    const statuscolor = elem.status == "Active" ? "success" : "error"
    // const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"

    activeusers.edit = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <EditSharpIcon/>
        </MDButton>
      );
    activeusers.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.name}
      </MDTypography>
    );
    activeusers.designation = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.designation}
      </MDTypography>
    );
    activeusers.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.email}
      </MDTypography>
    );
    activeusers.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.mobile}
      </MDTypography>
    );
    activeusers.gender = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.gender}
      </MDTypography>
    );
    activeusers.tradingexp = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.trading_exp}
      </MDTypography>
    );
    activeusers.location = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.location}
      </MDTypography>
    );
    activeusers.doj = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.joining_date}
      </MDTypography>
    );
    activeusers.role = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.role}
      </MDTypography>
    );
    activeusers.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
   
    
    console.log(typeof(activeusers));
    console.log(activeusers)
    activeusersarr.push(activeusers)
  })

  return {
    columns: [
      { Header: "Edit", accessor: "edit",align: "center" },
      { Header: "Name", accessor: "name",align: "center" },
      { Header: "Designation", accessor: "designation",align: "center" },
      { Header: "Email ID", accessor: "email", align: "center"},
      { Header: "Mobile No.", accessor: "mobile", align: "center"},
      { Header: "Gender", accessor: "gender", align: "center"},
      { Header: "Trading Exp.", accessor: "tradingexp",align: "center" },
      { Header: "Location", accessor: "location",align: "center" },
      { Header: "Date of Joining", accessor: "doj", align: "center"},
      { Header: "Role", accessor: "role", align: "center"},
      { Header: "Status", accessor: "status", align: "center"},
    ],

    rows: activeusersarr,
  };
}