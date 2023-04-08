import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../AuthContext";

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
import PaymentMethod from "./components/PaymentMethod";
import Invoices from "./components/Invoices";
import BillingInformation from "./components/BillingInformation";
import Transactions from "./components/Transactions";
import TransactionData from './components/Transactions/data/transactionData';


function Billing() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [marginDetails, setMarginDetails] = useState([]);
  const [lifetimePNL, setLifetimePNL] = useState([]);
  const [availableMarginPNL, setAvailableMarginPNL] = useState([]);
  const { columns, rows } = TransactionData();
  const getDetails = useContext(userContext);
  const id = getDetails?.userDetails?._id

  useEffect(()=>{
      console.log(getDetails.userDetails.email)
      axios.get(`${baseUrl}api/v1/getUserMarginDetails/${id}`)
        .then((res)=>{
                console.log(res.data);
                setMarginDetails(res.data);
        }).catch((err)=>{
            // window.alert("Error Fetching Margin Details");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/gettraderpnlformargin/${id}`)
        .then((res)=>{
                console.log(res.data);
                setLifetimePNL(res.data);
        }).catch((err)=>{
            // window.alert("Error Fetching P&L Details for Margin");
            return new Error(err);
        })
        
        axios.get(`${baseUrl}api/v1/gettraderpnlforavailablemargin/${id}`)
        .then((res)=>{
                console.log(res.data);
                setAvailableMarginPNL(res.data);
        }).catch((err)=>{
            // window.alert("Error Fetching P&L Details for Available Margin");
            return new Error(err);
        })
  },[])

  let totalCredit = 0;
  marginDetails?.map((elem)=>{
    totalCredit =+ totalCredit + elem.amount
  })

  let totalCreditString = totalCredit >= 0 ? "+₹" + totalCredit.toLocaleString() : "-₹" + ((-totalCredit).toLocaleString())
  let lifetimenetpnl = lifetimePNL[0] ? Number((lifetimePNL[0].npnl).toFixed(0)) : 0;
  console.log(lifetimenetpnl)
  let openingBalance = (totalCredit + lifetimenetpnl);
  let openingBalanceString = openingBalance >= 0 ? "+₹" + Number(openingBalance).toLocaleString() : "-₹" + (-Number(openingBalance)).toLocaleString()
  let availableMarginpnl = availableMarginPNL[0] ? Number((availableMarginPNL[0].npnl).toFixed(0)) : 0;
  let availableMargin = (totalCredit + availableMarginpnl)
  let availableMarginpnlstring = availableMargin >= 0 ? "+₹" + Number(availableMargin).toLocaleString() : "-₹" + (-Number(availableMargin)).toLocaleString()
  



  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={16} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<AvailableIcon/>}
                    title="total credit"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    icon={<AvailableIcon/>}
                    title="available margin"
                    //description="Belong Interactive"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                {/* <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<ShoppingCartIcon/>}
                    title="used margin"
                    //description="Belong Interactive"
                    value="+₹2000"
                  />
                </Grid> */}
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    icon={<PaymentsIcon/>}
                    title="available cash"
                    //description="Freelance Payment"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    icon={<AccountBalanceWalletIcon/>}
                    title="opening balance"
                    //description="Freelance Payment"
                    value={openingBalanceString}
                  />
                </Grid>
              </Grid>
            </Grid>
            
          </Grid>
        </MDBox>
        <MDBox mt={3} mb={3}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid> */}
            <Grid item xs={12} md={12}>
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

