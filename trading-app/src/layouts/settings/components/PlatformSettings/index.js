// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MDAlert from "../../../../components/MDAlert";
import MDSnackbar from "../../../../components/MDSnackbar";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { MdModeEditOutline } from 'react-icons/md';

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

function PlatformSettings() {

  const [AppStartTime, setAppStartTime] = React.useState(dayjs('2018-01-01T00:00:00.000Z'));
  const [AppEndTime, setAppEndTime] = React.useState(dayjs('2018-01-01T00:00:00.000Z'));
  const [appLiveValue, setAppLiveValue] = useState();
  const [editable, setEditable] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [reRender, setReRender] = useState(true);
  const [settingData, setSettingData] = useState([]);
  let date = new Date();
  let modifiedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`

  const getDetails = useContext(userContext)
  let modifiedBy = getDetails.userDetails._id;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  

  useEffect(()=>{
  axios.get(`${baseUrl}api/v1/readsetting`)
  .then((res)=>{
      setSettingData(res.data)
      setAppStartTime(dayjs(res.data[0].AppStartTime))
      setAppEndTime(dayjs(res.data[0].AppEndTime))
      console.log(res.data);
  }).catch((err)=>{
      //window.alert("Server Down");
      return new Error(err);
  })
  },[reRender])

  function setAppLiveValueFun(appLiveValue){
    if(appLiveValue){
      appLiveValue = false
  } else{
    appLiveValue = true
  }
  }


  async function setSettingsValue(id, value){
    console.log("Value in setSettingsValue function: ",value)
      const res = await fetch(`${baseUrl}api/v1/applive/${id}`, {
          method: "PATCH",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
              // isAppLive: appLiveValue, modifiedBy, modifiedOn
              ...value,modifiedBy,modifiedOn
          })
      }); 
      const dataResp = await res.json();
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          // console.log("Failed to Edit");
      } else {
          setEditable(false)
          if(appLiveValue){
              //window.alert("Trading Enabled");
              openSuccessSB();
          } else{
              //window.alert("Trading Disabled");
              openSuccessSB();
          }
      }
      reRender ? setReRender(false) : setReRender(true)
  }


  console.log(settingData,AppStartTime,AppEndTime)
  let appstatus = settingData[0]?.isAppLive === true ? "Online" : "Offline"
  let today = new Date();
  //let timestamp = (today.getHours())+":"+(today.getMinutes())+":"+(today.getSeconds())
  let timestamp = `${(today.getHours())}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`
  let title = "App " + appstatus
  let enablestatus = settingData[0]?.isAppLive === true ? "enabled" : "disabled"
  let content = "Trading is " + enablestatus + " now"
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );
 
  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2} display="flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Settings 
        </MDTypography>
        <MDBox>
          <MdModeEditOutline cursor="pointer" onClick={()=>{setEditable(true)}}/>
        </MDBox>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>

        <MDBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={2} mb={1}>
            
            <MobileTimePicker
              label="Trading Start Time"
              value={AppStartTime}
              disabled={!editable}
              onChange={(e) => {setAppStartTime(e)}}
              onAccept={(e) => {setSettingsValue(settingData[0]._id,{AppStartTime: e})}}
              renderInput={(params) => <TextField {...params} />}
            />

          </Stack>
        </LocalizationProvider>
        </MDBox>

        <MDBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={2} mb={1}>
            
            <MobileTimePicker
              label="Trading End Time"
              value={AppEndTime}
              disabled={!editable}
              onChange={(e) => {setAppEndTime(e)}}
              onAccept={(e) => {setSettingsValue(settingData[0]._id,{AppEndTime: e})}}
              renderInput={(params) => <TextField {...params} />}
            />
            
          </Stack>
        </LocalizationProvider>
        </MDBox>

        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
              <Switch checked={settingData[0]?.isAppLive} onChange={() => {setAppLiveValueFun(settingData[0].isAppLive); setSettingsValue(settingData[0]._id,{isAppLive: !settingData[0].isAppLive})}}/>
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="dark">
              {(settingData[0]?.isAppLive ? "Trading Enabled" : "Trading Disabled")}    
            </MDTypography>
            {renderSuccessSB}
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
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Email ID for Notifications
        </MDTypography>
        <MDButton variant="gradient" color="dark">
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;add email
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              {/* <MDBox component="img" src={masterCardLogo} alt="master card" width="10%" mr={2} /> */}
              <MDTypography variant="h6" fontWeight="medium">
                prateek@ninepointer.com
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Email" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              {/* <MDBox component="img" src={visaLogo} alt="master card" width="10%" mr={2} /> */}
              <MDTypography variant="h6" fontWeight="medium">
                kush@ninepointer.com
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Email" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              {/* <MDBox component="img" src={visaLogo} alt="master card" width="10%" mr={2} /> */}
              <MDTypography variant="h6" fontWeight="medium">
                manish@ninepointer.com
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Email" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              {/* <MDBox component="img" src={visaLogo} alt="master card" width="10%" mr={2} /> */}
              <MDTypography variant="h6" fontWeight="medium">
                anshuman@ninepointer.com
              </MDTypography>
              <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                <Tooltip title="Edit Email" placement="top">
                  <Icon sx={{ cursor: "pointer" }} fontSize="small">
                    edit
                  </Icon>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
        </Card>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
