// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";
import { useEffect, useState } from "react";

export default function MarginDetails() {

  return {
    columns: [
      { Header: "Opening Balance", accessor: "OpeningBalance", align: "center" },
      { Header: "Available Margin", accessor: "AvailableMargin", align: "center" },
      { Header: "Used Margin", accessor: "UsedMargin", align: "center" },
      { Header: "Available Cash", accessor: "AvailableCash", align: "center" },
      { Header: "Total Credits", accessor: "TotalCredits", align: "center" },
    ],

    rows: [],
  };
}
