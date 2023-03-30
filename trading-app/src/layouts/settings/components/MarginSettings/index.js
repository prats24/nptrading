// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import masterCardLogo from "../../../../assets/images/logos/mastercard.png";
import visaLogo from "../../../../assets/images/logos/visa.png";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";

import React, {useState, useEffect, useContext} from 'react'

import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "../../../../context";

// Material Dashboard 2 React components
import axios from "axios";
import { userContext } from '../../../../AuthContext';

function MarginSettings() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [reRender, setReRender] = useState(true);
  const [settingData, setSettingData] = useState([]);
  let date = new Date();
  let modifiedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

  const getDetails = useContext(userContext)
  let modifiedBy = getDetails.userDetails.name;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  

  useEffect(()=>{
  axios.get(`${baseUrl}api/v1/readsetting`)
  .then((res)=>{
      setSettingData(res.data)
      console.log(res.data);
  }).catch((err)=>{
      //window.alert("Server Down");
      return new Error(err);
  })
  },[reRender])



  async function isAppLiveFunc(id, appLive){
      if(appLive){
          appLive = false
      } else{
          appLive = true
      }
      const res = await fetch(`${baseUrl}api/v1/applive/${id}`, {
          method: "PATCH",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              isAppLive: appLive, modifiedBy, modifiedOn
          })
      });
      const dataResp = await res.json();
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          // console.log("Failed to Edit");
      } else {
          if(appLive){
              window.alert("Trading Enabled");
          } else{
              window.alert("Trading Disabled");
          }
      }
      reRender ? setReRender(false) : setReRender(true)
  }


  console.log(settingData)
 
  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Margin Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Trade Margin Settings
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.isAppLive} onChange={() => {isAppLiveFunc(settingData[0]._id, settingData[0].isAppLive)}}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(settingData[0]?.isAppLive ? "Trading Enabled" : "Trading Disabled")}    
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={true}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(true ? "Cron Job Email Notifications On" : "Cron Job Email Notifications Off")}    
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={true}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(true ? "Daily Report Email On" : "Daily Report Email Off")}    
            </MDTypography>
          </MDBox>
        </MDBox>
        <Card id="delete-account">
        </Card>
      </MDBox>
    </Card>
  );
}

export default MarginSettings;
