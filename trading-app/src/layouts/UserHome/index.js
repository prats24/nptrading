// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Grid } from "@mui/material";


// Data
import Carousel from "./data/Carousel";
import Indicies from "../traderHome/components/IndicesComponent";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2} mb={2}>
                <Indicies/>
      </Grid>
      <Carousel/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
