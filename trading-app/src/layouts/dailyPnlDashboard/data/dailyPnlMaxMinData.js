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

export default function DailyPnlMaxMinData() {

  let dailyPnlData = [];
  
  

  return {
    columns: [
      { Header: "date", accessor: "date",align: "center" },
      { Header: "weekday", accessor: "weekday",align: "center" },
      { Header: "Gross P&L", accessor: "gpnl",align: "center" },
      { Header: "Gross Max P&L", accessor: "maxpnl",align: "center" },
      { Header: "Gross Min P&L", accessor: "minpnl", align: "center"},
    ],

    rows: [],
  };
}