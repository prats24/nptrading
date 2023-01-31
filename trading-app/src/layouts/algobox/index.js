// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

// Data
import AlgoHeader from "./Header";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <AlgoHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
