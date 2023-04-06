import {useState, useEffect} from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
// import MDTypography from "../../../../components/MDTypography";
// import { Typography } from "@mui/material";
// import { MdAutoGraph } from "react-icons/md";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
// import data from "./data";

// function OverallCompantPNL({socket}) {
function RankTable() {
//   const { columns, rows } = data();

  let columns = [
    { Header: "Name", accessor: "name", width: "10%", align: "center" },
    { Header: "#Rank", accessor: "rank", width: "10%", align: "center" },
    { Header: "Reward", accessor: "reward", width: "10%", align: "center" },

]
let rows = [];

  return (
    <Card>
        <MDBox align-item='center'>
            <MDBox m={0.5} fontWeight={700} color="" sx={{mb: "10px", mt: "10px", ml: "30px"}}>Your rank will display here</MDBox>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
         </MDBox>
    </Card>
  );
}
export default RankTable;
