import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
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

export default function Data() {

  const [tradersData, setTradersData] = useState([])
    const [tradergpnl, setTraderGPNL] = useState([])
    const [tradernpnl, setTraderNPNL] = useState([])
    const [traderbrokerge, setTraderBrokerage] = useState([])
    const [tradertrades, setTraderTrades] = useState([])
    const [tradername, setTraderName] = useState([])

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(()=>{

      axios.get(`${baseUrl}api/v1/gettopfivelossmakingtradersthismonthmock`)
      .then((res)=>{
          console.log("Data: "+res.data)
          setTradersData(res.data);
          for(let item of res.data)
          {
            setTraderName((prev)=>{return[...prev,(item._id)]})
            setTraderGPNL((prev)=>{return[...prev,item.gpnl]})
            setTraderNPNL((prev)=>{return[...prev,(item.npnl).toFixed(0)]})
            setTraderTrades((prev)=>{return[...prev,(item.trades)]})
            setTraderBrokerage((prev)=>{return[...prev,(item.brokerage)]}) 
          }
      }).catch((err)=>{
          window.alert("Error in Fetching top 5 loss making traders data");
          return new Error(err);
      })
    },[])

    let tradersrowdata = [];
  
  tradersData?.map((elem)=>{
    let tdata = {}
    const npnlcolor = elem.npnl >= 0 ? "success" : "error"
    const gpnlcolor = elem.gpnl >= 0 ? "success" : "error"

    tdata.trader = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem._id}
      </MDTypography>
    );
    tdata.gpnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {elem.gpnl >= 0 ? "+₹" + (elem.gpnl).toFixed(0) :  "-₹" + (-elem.gpnl).toFixed(0)}
      </MDTypography>
    );
    tdata.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{(elem.brokerage).toFixed(0)}
      </MDTypography>
    );
    tdata.npnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {elem.npnl >= 0 ? "+₹" + (elem.npnl).toFixed(0) :  "-₹" + (-elem.npnl).toFixed(0)}
      </MDTypography>
    );
    tdata.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.trades}
      </MDTypography>
    );

    console.log(typeof(tdata));
    console.log(tdata)
    tradersrowdata.push(tdata)
  })
  


  return {
    columns: [
      { Header: "Trader Name", accessor: "trader", width: "10%", align: "left" },
      { Header: "gross p&l", accessor: "gpnl", width: "10%", align: "left" },
      { Header: "transaction cost", accessor: "brokerage", width: "10%", align: "center" },
      { Header: "net p&l", accessor: "npnl", width: "10%", align: "center" },
      { Header: "# of traders", accessor: "trades", width: "10%", align: "center" },
    ],

    rows: tradersrowdata,
  };
}
