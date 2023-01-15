import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// Images
import team2 from "../../../../assets/images/team-2.jpg";
import team3 from "../../../../assets/images/team-3.jpg";
import team4 from "../../../../assets/images/team-4.jpg";

import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function AllActiveAccessTokens() {



  return {
    columns: [
      { Header: "Edit", accessor: "edit", align: "center" },
      { Header: "Account ID", accessor: "accountid", align: "center" },
      { Header: "Access Token", accessor: "accesstoken", align: "center" },
      { Header: "Request Token", accessor: "requesttoken", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Generated On", accessor: "generatedon", align: "center" },
     
    ],

    rows: [],
  };
}
