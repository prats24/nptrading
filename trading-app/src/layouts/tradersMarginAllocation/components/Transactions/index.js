import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DataTable from "../../../../examples/Tables/DataTable";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "../Transaction";
import TransactionData from './data/transactionData';

function Transactions() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [traderPNLDetails, settraderPNLDetails] = useState([]);
  const { columns, rows } = TransactionData();

  useEffect(()=>{
      axios.get(`${baseUrl}api/v1/getTraderPNLAndTotalCreditData`)
        .then((res)=>{
                // console.log(res.data);
                settraderPNLDetails(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Margin Details");
            return new Error(err);
        })
  })


  // traderPNLDetails.map((elem)=>{
  //   let obj = {};
  //   let pnlAmountString = elem.npnl ? (elem.npnl >= 0 ? "+₹" + (elem.npnl.toFixed(0)).toLocaleString() : "-₹" + (-(elem.npnl.toFixed(0))).toLocaleString()) : 0
  //   let totalCreditString = elem.totalCredit ? (elem.totalCredit >= 0 ? "+₹" + (elem.totalCredit).toLocaleString() : "-₹" + (-(elem.totalCredit)).toLocaleString()) : 0
  //   let availableMarginString = elem.availableMargin ? (elem.availableMargin >= 0 ? "+₹" + (elem.availableMargin.toFixed(0)).toLocaleString() : "-₹" + (-(elem.availableMargin.toFixed(0))).toLocaleString()) : 0
  //   let color = elem.npnl >= 0 ? "success" : "error"
  //   let colorTotal = elem.totalCredit >= 0 ? "success" : "error"

  //   obj = (
  //     <Transaction
  //       color={color}
  //       colorTotal={colorTotal}
  //       icon={<CurrencyRupeeIcon/>}
  //       name={elem.traderName}
  //       // description={datestring + " Transaction ID: " + elem.transactionId}
  //       value={pnlAmountString}
  //       valueTotal={totalCreditString}
  //       valueTotalAvailable={availableMarginString}
  //       />
  //     );
  //   rows.push(obj);
  // })



  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Net P&L, Total Credit & Available Margin Details
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Lifetime Credits
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        {/* <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            latest
          </MDTypography>
        </MDBox> */}
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
          color="info"
          colorTotal="info"
          colorTotalAvailable="info"
          namecolor="info"
          // colorTotal={colorTotal}
          icon={<CurrencyRupeeIcon/>}
          name="Trader Name"
          // description={datestring + " Transaction ID: " + elem.transactionId}
          value="Net P&L"
          valueTotal="Total Credit"
          valueTotalAvailable="Available Margin"
          />
          {/* {rows} */}
          {
            traderPNLDetails.map((elem)=>{
              let obj = {};
              let pnlAmountString = elem.npnl ? (elem.npnl >= 0 ? "+₹" + (elem.npnl.toFixed(0)).toLocaleString() : "-₹" + (-(elem.npnl.toFixed(0))).toLocaleString()) : 0
              let totalCreditString = elem.totalCredit ? (elem.totalCredit >= 0 ? "+₹" + (elem.totalCredit).toLocaleString() : "-₹" + (-(elem.totalCredit)).toLocaleString()) : 0
              let availableMarginString = elem.availableMargin ? (elem.availableMargin >= 0 ? "+₹" + (elem.availableMargin.toFixed(0)).toLocaleString() : "-₹" + (-(elem.availableMargin.toFixed(0))).toLocaleString()) : 0
              let color = elem.npnl >= 0 ? "success" : "error"
              let colorTotal = elem.totalCredit >= 0 ? "success" : "error"
              let colorTotalAvailable = elem.availableMargin >= 0 ? "success" : "error"
              obj = (
                <Transaction
                  color={color}
                  colorTotal={colorTotal}
                  colorTotalAvailable = {colorTotalAvailable}
                  icon={<CurrencyRupeeIcon/>}
                  name={elem.traderName}
                  // description={datestring + " Transaction ID: " + elem.transactionId}
                  value={pnlAmountString}
                  valueTotal={totalCreditString}
                  valueTotalAvailable={availableMarginString}
                  />
              );
              return obj;
            })
          }
        </MDBox>
        {/* <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            all
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="stoxhero"
            description="26 March 2020, at 13:45 PM"
            value="+ ₹ 750"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="stoxhero"
            description="26 March 2020, at 12:30 PM"
            value="+ ₹ 1,000"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="stoxhero"
            description="26 March 2020, at 08:30 AM"
            value="+ ₹ 2,500"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="stoxhero"
            description="26 March 2020, at 05:00 AM"
            value="+ ₹ 2,500"
          />
        </MDBox> */}
      </MDBox>
    </Card>
  );
}

export default Transactions;
