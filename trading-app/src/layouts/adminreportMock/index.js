
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";

// Images
import AdminReportHeader from "./Header";

function AdminReport() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <AdminReportHeader/>
    </DashboardLayout>
  );
}

export default AdminReport;
