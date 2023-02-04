// Material Dashboard 2 React example components
import DashboardLayout from "../../Components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../Components/Navbars/DashboardNavbar";
import Footer from "../../Components/Footer";


// Data
import Header from "./Header";

function CategoryLayout() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default CategoryLayout;
