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

// Overview page components
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";

// Data
import profilesListData from "./data/profilesListData";

// Images
import homeDecor1 from "../../assets/images/home-decor-1.jpg";
import homeDecor2 from "../../assets/images/home-decor-2.jpg";
import homeDecor3 from "../../assets/images/home-decor-3.jpg";
import homeDecor4 from "../../assets/images/home-decor-4.jpeg";
import team1 from "../../assets/images/team-1.jpg";
import team2 from "../../assets/images/team-2.jpg";
import team3 from "../../assets/images/team-3.jpg";
import team4 from "../../assets/images/team-4.jpg";
import data from "./data/authorsTableData";
import { Card } from "@mui/material";
import DataTable from "../../examples/Tables/DataTable";
import TextField from '@mui/material/TextField';

function CompanyDailyPNLTWise() {
    const { columns, rows } = data();
    const { columns: pColumns, rows: pRows } = data();

    return (
        <MDBox pt={6} pb={3}>
            {/* <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Grid item  xs={4} md={12} lg={2} sx={{ display: 'flex' }}  >
                            <MDTypography sx={{ margin: 1, padding: 1, fontSize: 19 }}>Start Date</MDTypography>
                        </Grid>
                        <Grid item  xs={4} lg={2}>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 1, padding: 1 }} xs={12} />
                        </Grid>
                        <Grid item  xs={4} lg={2} sx={{ display: 'flex' }}>
                            <MDTypography sx={{ margin: 1, padding: 1, fontSize: 19 }}>End Date</MDTypography>
                        </Grid>
                        <Grid item  xs={4} lg={2}>
                            <TextField
                                id="outlined-basic" variant="standard" type="date"
                                sx={{ margin: 1, padding: 1 }} />
                        </Grid>
                    </Card>
                </Grid>
            </Grid> */}
        </MDBox>
    );
}

export default CompanyDailyPNLTWise;