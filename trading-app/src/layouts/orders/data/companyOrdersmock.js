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
//
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

export default function CompanyOrdersMock() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [data, setData] = useState([]);
  const [clickToRemove, setclickToRemove] = useState(1);
  const [skip, setSkip] = useState(0);
  let numberOfClickForRemoveNext = 0
  const limit = 10;

  useEffect(()=>{

      axios.get(`${baseUrl}api/v1/readmocktradecompanypagination/${skip}/${limit}`)
      // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
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
    corders.type = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.buyOrSell}
      </MDTypography>
    );
    corders.quantity = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    corders.avgprice = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.average_price}
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
      { Header: "type", accessor: "type", align: "center" },
      { Header: "quantity", accessor: "quantity", align: "center" },
      { Header: "avg. price", accessor: "avgprice", align: "center" },
    ],

      rows: companyorders

  };
}
