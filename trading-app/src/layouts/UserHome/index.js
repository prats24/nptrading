// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";


// Data
import Carousel from "./data/Carousel";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Carousel/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
