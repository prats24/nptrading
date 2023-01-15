// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import DailyPNLHeader from "./Header";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <DailyPNLHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
