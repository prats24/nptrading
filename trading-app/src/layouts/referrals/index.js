// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

// Data
import ReferralHomePage from "./Header/referralHomePage";

function RefferalTable() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ReferralHomePage/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default RefferalTable;
