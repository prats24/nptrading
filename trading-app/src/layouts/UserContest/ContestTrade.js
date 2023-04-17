// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import React,{useState, memo} from 'react'


// Data

import ContestTradePage from "./data/ContestTradePage";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <ContestTradePage />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
