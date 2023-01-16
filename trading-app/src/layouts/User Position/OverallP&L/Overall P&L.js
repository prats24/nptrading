/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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


export default function OverallPL() {
  

  return {
    columns: [
      { Header: "Product", accessor: "Product", width: "10%", align: "center" },
      { Header: "Instrument", accessor: "symbol", width: "10%", align: "center" },
      { Header: "Quantity", accessor: "Quantity", width: "10%", align: "center" },
      { Header: "Avg. Price", accessor: "avgPrice", width: "10%", align: "center" },
      { Header: "LTP", accessor: "last_price", width: "10%", align: "center" },
      { Header: "Gross P&L", accessor: "grossPnl", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },
    ],

    rows: [

    ],
  };
}
