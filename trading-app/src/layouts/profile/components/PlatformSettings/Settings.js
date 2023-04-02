import React from 'react';
import { useState, useContext, useEffect } from "react";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";


function Settings() {

  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);

  return (
    <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Email Settings
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDBox>
            <Switch checked={followsMe} onChange={() => setFollowsMe(!followsMe)} />
          </MDBox>
          <MDBox mt={-1.2} width="80%">
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my daily P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <MDBox>
            <Switch checked={answersPost} onChange={() => setAnswersPost(!answersPost)} />
          </MDBox>
          <MDBox mt={-1.2} width="80%">
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my weekly P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <MDBox >
            <Switch checked={mentionsMe} onChange={() => setMentionsMe(!mentionsMe)} />
          </MDBox>
          <MDBox mt={-1.2} width="80%">
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my monthly P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
  );
}

export default Settings;
