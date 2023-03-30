import {useState, useContext, useEffect} from "react"
import axios from "axios";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MasterCard from "../../examples/Cards/MasterCard";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import AvailableIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';

// Billing page components
import AddFunds from "./components/AddFunds";
import TotalFunds from "./components/TotalFunds";
import Invoices from "./components/Invoices";
import BillingInformation from "./components/BillingInformation";
import Transactions from "./components/Transactions";


function Billing() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [marginDetails, setMarginDetails] = useState([]);
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getUserMarginDetailsAll`)
      .then((res)=>{
              console.log(res.data);
              setMarginDetails(res.data);
      }).catch((err)=>{
          window.alert("Error Fetching Margin Details");
          return new Error(err);
      })
    },[])
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid> */}
                
                <Grid item xs={12}>
                  <AddFunds marginDetails = {marginDetails} setMarginDetails = {setMarginDetails}/>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={5}>
              <TotalFunds />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation marginDetails = {marginDetails} setMarginDetails = {setMarginDetails} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
