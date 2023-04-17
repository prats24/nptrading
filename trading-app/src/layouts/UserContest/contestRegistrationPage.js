// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import React,{useState, memo} from 'react'


// Data

import ContestRegistrationPage from "./data/ContestRegistration";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestRegistrationPage />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
