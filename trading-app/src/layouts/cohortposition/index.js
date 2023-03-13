// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
// import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from "../../examples/Lists/ProfilesList";
// import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
// import Header from "./components/Header";
// import PlatformSettings from "./components/PlatformSettings";
// import MockCompanyPNL from "./MockCompanyPNL"

// Data
// import profilesListData from "./data/profilesListData";

// Images
// import homeDecor1 from "../../assets/images/home-decor-1.jpg";
// import homeDecor2 from "../../assets/images/home-decor-2.jpg";
// import homeDecor3 from "../../assets/images/home-decor-3.jpg";
// import homeDecor4 from "../../assets/images/home-decor-4.jpeg";
// import team1 from "../../assets/images/team-1.jpg";
// import team2 from "../../assets/images/team-2.jpg";
// import team3 from "../../assets/images/team-3.jpg";
// import team4 from "../../assets/images/team-4.jpg";
// import CompanyDailyPNLTWise from "./CompanyDailyPNLTWise";
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
