// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

export default function data() {
    
  return {
    columns: [
      { Header: "Trader Name", accessor: "traderName", width: "15%", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", width: "15%", align: "center" },
      { Header: "# of Trades", accessor: "noOfTrade", width: "15%", align: "center" },
      { Header: "Running Lots", accessor: "runningLots", width: "15%", align: "center" },
      { Header: "Lots Used", accessor: "lotUsed", width: "15%", align: "center" },
      { Header: "Brokegrage", accessor: "brokerage", width: "15%", align: "center" },
      { Header: "Net P&L", accessor: "netPnl", width: "15%", align: "center" },
      { Header: "Details", accessor: "view", width: "3%", align: "center" },
      { Header: "Orders", accessor: "orders", width: "3%", align: "center" },
    ],

    rows: [
      

    ],


  };
}
