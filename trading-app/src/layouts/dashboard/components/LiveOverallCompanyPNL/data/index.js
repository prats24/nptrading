// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

export default function data() {
    
  return {
    columns: [
      { Header: "contract date", accessor: "contractdate", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "avg. price", accessor: "avgprice", width: "10%", align: "center" },
      { Header: "ltp", accessor: "ltp", width: "10%", align: "center" },
      { Header: "gross p&l", accessor: "gpnl", width: "10%", align: "center" },
      { Header: "transaction cost", accessor: "tcost", width: "10%", align: "center" },
      { Header: "net p&l", accessor: "npnl", width: "10%", align: "center" },
    ],

    rows: [   
      // {
      //   contractdate: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       12-01-2023
      //     </MDTypography>
      //   ),
      //   instrument: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       18500 CE
      //     </MDTypography>
      //   ),
      //   symbol: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       NIFTY05JAN18500CE
      //     </MDTypography>
      //   ),
      //   avgprice: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       ₹134.56
      //     </MDTypography>
      //   ),
      //   ltp: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       ₹140.56
      //     </MDTypography>
      //   ),
      //   gpnl: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹1,40,405.56
      //     </MDTypography>
      //   ),
      //   tcost: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹40,405.56
      //     </MDTypography>
      //   ),
      //   npnl: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹1,00,000.00
      //     </MDTypography>
      //   ),
      // },

      // {
      //   contractdate: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       12-01-2023
      //     </MDTypography>
      //   ),
      //   instrument: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       18400 PE
      //     </MDTypography>
      //   ),
      //   symbol: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       NIFTY05JAN18400PE
      //     </MDTypography>
      //   ),
      //   avgprice: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       ₹164.76
      //     </MDTypography>
      //   ),
      //   ltp: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       ₹145.43
      //     </MDTypography>
      //   ),
      //   gpnl: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹1,20,405.56
      //     </MDTypography>
      //   ),
      //   tcost: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹20,405.56
      //     </MDTypography>
      //   ),
      //   npnl: (
      //     <MDTypography variant="caption" color="text" fontWeight="medium">
      //       +₹1,00,000.00
      //     </MDTypography>
      //   ),
      // },

    ],


  };
}
