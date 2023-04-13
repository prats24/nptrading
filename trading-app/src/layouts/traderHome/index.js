// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

// Data
import Home from "./home.js";

function RefferalTable() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Home/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default RefferalTable;
