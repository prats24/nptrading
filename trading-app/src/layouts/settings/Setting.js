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
import React, {useState, useEffect, useContext} from 'react'

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

import axios from "axios";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import DataTable from "../../examples/Tables/DataTable";
import SettingData from './data/SettingData'
import { userContext } from '../../AuthContext';


function Setting() {

    let date = new Date();
    let modifiedOn = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  
    const getDetails = useContext(userContext)
    let modifiedBy = getDetails.userDetails.name;

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const { columns, rows } = SettingData();
  const [settingData, setSettingData] = useState([]);
  const [reRender, setReRender] = useState(true);

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

    settingData.map((subelem)=>{
        let obj = {};
        obj.appLive = (
            <MDBox mt={0.5}>
                <Switch checked={subelem.isAppLive} onChange={() => {isAppLiveFunc(subelem._id, subelem.isAppLive)}} />
            </MDBox>
        );

        rows.push(obj);
    })

  return (

    <>
    <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={12}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between",
                          }}>

                        <MDTypography variant="h6" color="white" py={2.5}>
                            Settings
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>

        </Grid> 
    </MDBox> 
    </>

  );
}

export default Setting;
