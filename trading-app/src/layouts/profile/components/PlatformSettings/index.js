import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Tooltip } from '@mui/material';
import Icon from "@mui/material/Icon";
import { userContext } from "../../../../AuthContext";
import MDAvatar from "../../../../components/MDAvatar";
import axios from "axios";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Header from "../Header";

import { useState, useContext, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { MdModeEditOutline } from 'react-icons/md';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import Button from '@mui/material/Button';
import MDTypography from "../../../../components/MDTypography";
import { Divider, Typography } from '@mui/material';

function PlatformSettings() {

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox mb={2} />
    <Header/>
    </DashboardLayout>
    )
}

export default PlatformSettings;
