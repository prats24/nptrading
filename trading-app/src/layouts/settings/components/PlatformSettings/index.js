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
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

import React, {useState, useEffect, useContext} from 'react'

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import axios from "axios";
import { userContext } from '../../../../AuthContext';

function PlatformSettings() {
  const [reRender, setReRender] = useState(true);
  const [settingData, setSettingData] = useState([]);
  let date = new Date();
  let modifiedOn = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  const getDetails = useContext(userContext)
  let modifiedBy = getDetails.userDetails.name;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  

  useEffect(()=>{
  axios.get(`${baseUrl}api/v1/readsetting`)
  .then((res)=>{
      setSettingData(res.data)
      console.log(res.data);
  }).catch((err)=>{
      window.alert("Server Down");
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
              window.alert("App is Live Now");
          } else{
              window.alert("App Live is Disabled");
          }
      }
      reRender ? setReRender(false) : setReRender(true)
  }


  console.log(settingData)
 
  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          App Settings
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.isAppLive} onChange={() => {isAppLiveFunc(settingData[0]._id, settingData[0].isAppLive)}}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {(settingData[0]?.isAppLive ? "App is Live" : "App is Offline")}
              
            </MDTypography>
          </MDBox>
        </MDBox>
        {/* <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={answersPost} onChange={() => setAnswersPost(!answersPost)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my weekly P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={!mentionsMe} onChange={() => setMentionsMe(mentionsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my monthly P&L report
            </MDTypography>
          </MDBox>
        </MDBox> */}
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
