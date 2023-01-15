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

export default function DailyPnlData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [Data, setData] = useState([]);

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/dailypnldata`)
      .then((res)=>{
                setData(res.data);
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(Data);


  let dailyPnlData = [];
  
  Data.map((elem)=>{
    let pnldata = {}
    // const exchangecolor = elem.exchange == "NFO" ? "info" : "error"
      pnldata.timestamp = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem._id}
        </MDTypography>
      );
      pnldata.gpnl = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.pnl.toFixed(0)}
        </MDTypography>
      );
      pnldata.traders = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.traders}
      </MDTypography>
    );
    pnldata.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.trades}
      </MDTypography>
    );
   
    
    console.log(typeof(pnldata));
    console.log(pnldata)
    dailyPnlData.push(pnldata)
  })

  return {
    columns: [
      { Header: "timestamp", accessor: "timestamp",align: "center" },
      { Header: "Gross P&L", accessor: "gpnl",align: "center" },
      { Header: "traders", accessor: "traders",align: "center" },
      { Header: "trades", accessor: "trades", align: "center"},
    ],

    rows: dailyPnlData,
  };
}