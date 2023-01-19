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
import CategoryData from "./data/CategoryData";
import ExpenseData from "./data/ExpenseData";
import ExpenseHeader from "./Header";

function Tables() {
  const { columns, rows } = CategoryData();
  const { columns: pColumns, rows: pRows } = ExpenseData();

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ExpenseHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
