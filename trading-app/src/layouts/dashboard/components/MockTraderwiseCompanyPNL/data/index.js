// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

export default function data() {
    
  return {
    columns: [
      { Header: "tradername", accessor: "tradername", width: "10%", align: "center" },
      { Header: "trades", accessor: "trades", width: "10%", align: "center" },
      { Header: "running lots", accessor: "runninglots", width: "10%", align: "center" },
      { Header: "lots used", accessor: "lotsused", width: "10%", align: "center" },
      { Header: "ltp", accessor: "ltp", width: "10%", align: "center" },
      { Header: "gross p&l", accessor: "gpnl", width: "10%", align: "center" },
      { Header: "transaction cost", accessor: "tcost", width: "10%", align: "center" },
      { Header: "net p&l", accessor: "npnl", width: "10%", align: "center" },
    ],

    rows: [
      {
        tradername: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Prateek P
          </MDTypography>
        ),
        trades: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            10
          </MDTypography>
        ),
        runninglots: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            350
          </MDTypography>
        ),
        lotsused: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            3500
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹140.56
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,40,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹40,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,00,000.00
          </MDTypography>
        ),
      },

      {
        tradername: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Vijay V
          </MDTypography>
        ),
        trades: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            15
          </MDTypography>
        ),
        runninglots: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            450
          </MDTypography>
        ),
        lotsused: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            3000
          </MDTypography>
        ),
        ltp: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹144.56
          </MDTypography>
        ),
        gpnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹1,20,405.56
          </MDTypography>
        ),
        tcost: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹40,405.56
          </MDTypography>
        ),
        npnl: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            +₹80,000.00
          </MDTypography>
        ),
      },

    ],


  };
}
