// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

// Data
import ReferralHeader from "./Header";

function RefferalTable() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ReferralHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default RefferalTable;
