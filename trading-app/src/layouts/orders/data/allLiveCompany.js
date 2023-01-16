import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import MDBadge from "../../../components/MDBadge";

// Images
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";
import { json } from "react-router-dom";

export default function AllCompanyOrdersLive() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [data, setData] = useState([]);
  const [clickToRemove, setclickToRemove] = useState(1);
  const [skip, setSkip] = useState(0);
  let numberOfClickForRemoveNext = 0
  const limit = 10;

  useEffect(()=>{

      // axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      axios.get(`${baseUrl}api/v1/readlivetradecompanyagg`)
      .then((res)=>{

          setData(res.data);
      }).catch((err)=>{
          window.alert("Server Down");
          return new Error(err);
      })
  },[])

  console.log(data);

  
  // numberOfClickForRemoveNext = Math.ceil(((orderCountHistoryCompany))/limit);
  // console.log(numberOfClickForRemoveNext, clickToRemove, orderCountHistoryCompany)

  let companyorders = [];
  
  data.map((elem)=>{
    let corders = {}
    const typecolor = elem.buyOrSell == "BUY" ? "info" : "error"
    const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
    const quantitycolor = elem.Quantity > 0 ? "info" : "error"

    corders.trader = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.createdBy}
      </MDTypography>
    );
    corders.orderid = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.order_id}
      </MDTypography>
    );
    corders.ordertimestamp = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.order_timestamp}
      </MDTypography>
    );
    corders.type = (
      <MDTypography component="a" href="#" variant="caption" color={typecolor} fontWeight="medium">
        {elem.buyOrSell}
      </MDTypography>
    );
    corders.instrument = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    corders.product = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.Product}
      </MDTypography>
    );
    corders.quantity = (
      <MDTypography component="a" href="#" variant="caption" color={quantitycolor} fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    corders.avgprice = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        ₹{elem.average_price.toFixed(2)}
      </MDTypography>
    );
    corders.amount = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.amount >= 0 ? "₹" + elem.amount.toFixed(2) : "₹" + (-elem.amount).toFixed(2)}
      </MDTypography>
    );
    corders.status = (
      <MDTypography component="a" href="#" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    corders.algoname = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.algoBox.algoName}
      </MDTypography>
    );
    corders.account = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.placed_by}
      </MDTypography>
    );
    console.log(typeof(corders));
    console.log(corders)
    companyorders.push(corders)
  })

  return {

    columns: [
      { Header: "trader", accessor: "trader", align: "center" },
      { Header: "orderid", accessor: "orderid", align: "center" },
      { Header: "order timestamp", accessor: "ordertimestamp", align: "center" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "instrument", accessor: "instrument", align: "center" },
      { Header: "product", accessor: "product", align: "center" },
      { Header: "quantity", accessor: "quantity", align: "center" },
      { Header: "avg. price", accessor: "avgprice", align: "center" },
      { Header: "amount", accessor: "amount", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "algo name", accessor: "algoname", align: "center" },
      { Header: "account", accessor: "account", align: "center" },
    ],

      rows: companyorders

  };
}
