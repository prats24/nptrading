import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import DataTable from "../../../examples/Tables/DataTable";
let Tdata = [];

export function TransactionCostData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try{
      socket = io.connect(`${baseUrl1}`)
  } catch(err){
      throw new Error(err);
  }

  
  // const [tcost, setTCost] = useState();

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/tcmocktradecompanylastfivedays`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        // setTCost(res.data);
        Tdata = res.data
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })
},[])

  console.log(Tdata);

  
  // return {
  //   labels: ["M", "T", "W", "T", "F"],
  //   datasets: { label: "Transaction Cost", data: Tdata },
  // };
}

