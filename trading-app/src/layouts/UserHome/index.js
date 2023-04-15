// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { Grid } from "@mui/material";
import MDBox from "../../components/MDBox";
import referralImage from '../../assets/images/referral.png';
import ReportsLineChart from "../../examples/Charts/BarCharts/ReportsBarChart";


// Data
import Carousel from "./data/Carousel";
import Indicies from "../traderHome/components/IndicesComponent";
import { display } from "@mui/system";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2} mb={2}>
                <Indicies/>
      </Grid>
      <Carousel/>
      <Grid style={{display: 'flex'}} mt={4}>
          <MDBox style={{flex:2}}>
            <MDBox style={{position:'relative'}}>
              <img src ={referralImage} width='100%' />
              <MDBox style={{
                display:'flex', 
                justifyContent: 'space-between', 
                position: 'absolute',
                width: '100%', 
                bottom: 10,
                paddingLeft: 10,
                paddingRight:10, 
                backgroundColor: '#344666',
                color: 'white'
                }}>
                <span>Winnings</span>
                <span>₹150.00</span>
              </MDBox>
            </MDBox>
          </MDBox>
          <Grid style={{flex:3, height:'150px', marginTop:'24px', marginLeft: '12px'}}>
              <MDBox mb={3} style={{height: '100%'}}>
                <ReportsLineChart
                  color="success"
                  colorheight="14rem"
                  title="Gross p&l (in INR)"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase than previous last 5 days.
                  //   </>
                  // }
                  // date="updated just now"
                  chart={
                    {
                      labels: [],
                      datasets: { label: "Gross P&L", data: [] },
                    }
                  }
                />
              </MDBox>
            </Grid>
      </Grid>
      {/* <Footer /> */}
    </DashboardLayout>
    </>
  );
}

export default Tables;
