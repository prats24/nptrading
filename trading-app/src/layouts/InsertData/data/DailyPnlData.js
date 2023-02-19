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

  let dailyPnlData = [];
  
  

  return {
    columns: [
      { Header: "timestamp", accessor: "_id",align: "center" },
      { Header: "Gross P&L", accessor: "pnl",align: "center" },
      { Header: "traders", accessor: "traders",align: "center" },
      { Header: "trades", accessor: "trades", align: "center"},
    ],

    rows: [],
  };
}