/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";
import { useEffect } from "react";
import axios from "axios";

function InstrumentDetails({socket}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      console.log("this is live market data", data);
      setMarketData(data);
      // setDetails.setMarketData(data);
    })
  }, [])

  console.log("marketData", marketData)
  let ltpArr = [];
  
  rows.map((elem)=>{
    let ltpObj = {};
    marketData.map((subelem)=>{
      const percentagechangecolor = (((subelem.last_price - subelem.average_price) / subelem.average_price)*100) > 0 ? "success" : "error"
      if(elem.instrumentToken.props.children === subelem.instrument_token){
        elem.last_price = (
            <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
              {"₹"+(subelem.last_price).toFixed(2)}
            </MDTypography>
          );
          if(subelem.change){
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
                {((subelem.change).toFixed(2))+"%"}
              </MDTypography>
            );
          } else{
            elem.change = (
              <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
                {(((subelem.last_price - subelem.average_price) / subelem.average_price)*100).toFixed(2)+"%"}
              </MDTypography>
            );
          }
      }
    })
    ltpArr.push(ltpObj);
  })

  const newRows = rows.concat(ltpArr);
  console.log("row", rows, ltpArr, newRows)

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Instrument Details
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <CheckCircleIcon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
            
            </CheckCircleIcon>
            <MDTypography variant="button" fontWeight="regular" color="success">
              &nbsp;<strong>System Live</strong>
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
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

export default InstrumentDetails;


