// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";


// Data
import UserContestHeader from "./Header/UserContestHeader";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <UserContestHeader/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
