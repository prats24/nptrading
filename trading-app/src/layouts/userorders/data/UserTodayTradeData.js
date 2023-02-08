import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from '../../../AuthContext';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";




export default function UserTodayTradeData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [data, setData] = useState([]);
  const getDetails = useContext(userContext);
  console.log("getDetails", getDetails)

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/gettodaysmocktradesparticularuser/${getDetails.userDetails.email}`)
      .then((res)=>{
        //console.log(res.data)
          setData(res.data);
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[getDetails])

  //console.log(data);

  let todaysorders = [];
  
  data.map((elem)=>{
    let torders = {}
    const typecolor = elem.buyOrSell == "BUY" ? "info" : "error"
    const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
    const quantitycolor = elem.Quantity > 0 ? "info" : "error"

    torders.trader = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdBy}
      </MDTypography>
    );
    torders.orderid = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.order_id}
      </MDTypography>
    );
    torders.ordertimestamp = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.order_timestamp}
      </MDTypography>
    );
    torders.type = (
      <MDTypography component="a" variant="caption" color={typecolor} fontWeight="medium">
        {elem.buyOrSell}
      </MDTypography>
    );
    torders.instrument = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    torders.product = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.Product}
      </MDTypography>
    );
    torders.quantity = (
      <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    torders.avgprice = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{elem.average_price.toFixed(2)}
      </MDTypography>
    );
    torders.amount = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.amount >= 0 ? "₹" + elem.amount.toFixed(2) : "₹" + (-elem.amount).toFixed(2)}
      </MDTypography>
    );
    torders.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
    
    console.log(typeof(torders));
    console.log(torders)
    todaysorders.push(torders)
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
    ],

      rows: todaysorders,

  };
}
