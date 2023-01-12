import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

export default function MockCompanyPNL() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [companypnldata, setCompanyPNLData] = useState([]);
  let numberOfClickForRemoveNext = 0
  const limit = 10;

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/daywisecompanypnl`)
      .then((res)=>{
        console.log(res.data)
        setCompanyPNLData(res.data);
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(companypnldata);

  let companypnl = [];
  
  companypnldata.map((elem)=>{
    let cpnl = {}
    const gpnlcolor = (-elem.amount) >= 0 ? "success" : "error"
    //const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
    const npnlcolor = ((-elem.amount) - elem.brokerage) >= 0 ? "success" : "error"

    cpnl.date = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem._id.date}
      </MDTypography>
    );
    cpnl.gpnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {(-elem.amount) >= 0 ? "+₹" + (-elem.amount).toFixed(0) : "-₹" + (elem.amount).toFixed(0)}
      </MDTypography>
    );
    cpnl.tcost = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{elem.brokerage.toFixed(0)}
      </MDTypography>
    );
    cpnl.npnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {((-elem.amount) - elem.brokerage) >= 0 ? "+₹" + ((-elem.amount) - elem.brokerage).toFixed(0) : "-₹" + -((-elem.amount) - elem.brokerage).toFixed(0)}
      </MDTypography>
    );
    console.log(typeof(cpnl));
    console.log(cpnl)
    companypnl.push(cpnl)
    console.log(companypnl)
    companypnl.sort((a, b) => {
      if (a.date.props.children < b.date.props.children) {
        return 1;
      }
      if (a.date.props.children > b.date.props.children) {
          return -1;
      }
      return 0;
    });
  })


  return {

    columns: [
      { Header: "date", accessor: "date", align: "center" },
      { Header: "Gross P&L", accessor: "gpnl", align: "center" },
      { Header: "Transaction Cost", accessor: "tcost", align: "center" },
      { Header: "Net P&L", accessor: "npnl", align: "center" },
    ],

      rows: companypnl

  };
}
