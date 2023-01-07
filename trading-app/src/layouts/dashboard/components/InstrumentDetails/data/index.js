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

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

// Images
import logoXD from "../../../../../assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "../../../../../assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "../../../../../assets/images/small-logos/logo-slack.svg";
import logoSpotify from "../../../../../assets/images/small-logos/logo-spotify.svg";
import logoJira from "../../../../../assets/images/small-logos/logo-jira.svg";
import logoInvesion from "../../../../../assets/images/small-logos/logo-invision.svg";
import team1 from "../../../../../assets/images/team-1.jpg";
import team2 from "../../../../../assets/images/team-2.jpg";
import team3 from "../../../../../assets/images/team-3.jpg";
import team4 from "../../../../../assets/images/team-4.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Data() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const [instrumentData, setInstrumentData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [livedata, setLiveData] = useState([]);
  let date = new Date();
  let todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`


  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
    .then((res) => {
        let dataArr = (res.data).filter((elem) => {
            return elem.status === "Active"
        })
        setInstrumentData(dataArr)
    }).catch((err) => {
        return new Error(err);
    })
    console.log("hii");
  }, [])

  let instrumentDetailArr = [];
  console.log("instrumentData", instrumentData)
  instrumentData.map((elem)=>{
    let instrumentDetailObj = {}

    instrumentDetailObj.instrument = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.instrument}
      </MDTypography>
    );
    instrumentDetailObj.symbol = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    instrumentDetailObj.quantity = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    instrumentDetailObj.contractDate = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.contractDate}
      </MDTypography>
    );
    instrumentDetailObj.avgprice = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.average_price}
      </MDTypography>
    );
    instrumentDetailObj.buy = (
      <MDButton href="../../authentication/sign-in" variant="contained" color="info" fullWidth>
        BUY
      </MDButton>     
    );
    instrumentDetailObj.sell = (
      <MDButton href="../../authentication/sign-in" variant="contained" color="error" fullWidth>
        SELL
      </MDButton> 
    );
    instrumentDetailObj.instrumentToken = (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {elem.instrumentToken}
      </MDTypography>
    );

    console.log(typeof(instrumentDetailObj));
    console.log(instrumentDetailObj)
    instrumentDetailArr.push(instrumentDetailObj)
  })

  return {
    columns: [
      { Header: "contract date", accessor: "contractDate", width: "10%", align: "center" },
      { Header: "symbol", accessor: "symbol", width: "10%", align: "center" },
      { Header: "instrument", accessor: "instrument", width: "10%", align: "center" },
      { Header: "ltp", accessor: "last_price", width: "10%", align: "center" },
      { Header: "Change(%)", accessor: "change", width: "10%", align: "center" },
      { Header: "", accessor: "buy", width: "5%", align: "center" },
      { Header: "", accessor: "sell", width: "5%", align: "center" },
    ],

    rows: instrumentDetailArr
  

  };
}
