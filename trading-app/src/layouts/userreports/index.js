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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "../../examples/Lists/ProfilesList";
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";
import Card from "@mui/material/Card";
// import DataTable from '../../../examples/Tables/DataTable';

// Overview page components
// import Header from "./components/Header";
// import PlatformSettings from "./components/PlatformSettings";

// Data
// import profilesListData from "./data/profilesListData";

// Images
import UserReportData from "./data/authorsTableData";
import DataTable from "../../examples/Tables/DataTable";
import UserReportProject from "./data/projectsTableData";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";


function UserReport() {
  const { columns, rows } = UserReportData();
  const { columns: pColumns, rows: pRows } = UserReportProject();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} >
            <Card sx={{display:"flex", flexDirection:"row", justifyContent:'center'}}>
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Start Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} />
           
              <MDBox >
                <Typography sx={{ margin: 1, padding: 1, fontSize: 19 }}>End Date</Typography>
                </MDBox>
              <TextField
                id="outlined-basic" variant="standard" type="date"
                sx={{ margin: 1, padding: 1 }} />
            </Card>
          </Grid>

          <Grid item xs={12} md={12} xl={12} >
            <Card sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', marginTop: 1 }}>
              <MDBox >
                <MDTypography variant="h6" py={1}>Gross P&L</MDTypography>
                <MDTypography variant="h6" py={1}>123456</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" py={1}>Transaction Cost</MDTypography>
                <MDTypography variant="h6" py={1}>123456</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" py={1}>Net P&L</MDTypography>
                <MDTypography variant="h6" py={1}>123456</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" py={1}>Total Trades</MDTypography>
                <MDTypography variant="h6" py={1}>123456</MDTypography>
              </MDBox>
              <MDBox >
                <MDTypography variant="h6" py={1}>Trading Days</MDTypography>
                <MDTypography variant="h6" py={1}>123456</MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

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

                <MDTypography variant="h6" color="white" py={1}>
                  Reports
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
    </DashboardLayout>
  );
}

export default UserReport;
