// Material Dashboard 2 React example components
import React from 'react'
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import MDTypography from "../../../components/MDTypography";
import Modal from '@mui/material/Modal';
import InviteFriendModal from './InviteFriendModel'

// Icons
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import ReferralHeader from "./Header";
//Images
import ReferralProgramImage from '../../../assets/images/referral-program.png'
import ReferralImage from '../../../assets/images/referral.png'

function ReferralHomePage() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
        <MDBox width="100%" p={5} bgColor="dark" mb={2}>
            <Grid container spacing={4}>
                
                <Grid item xs={12} md={12} lg={8}>
                    <MDBox color="light" pt={2.25} pb={2.25} display="flex" justifyContent="center">
                        StoxHero Referral Program
                    </MDBox>
                    <MDBox fontSize={15} display="flex" justifyContent="center">
                        <img alt="Referral Program" style={{ maxWidth: '100%', height: 'auto' }} src={ReferralImage}/>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                    <MDBox bgColor="light"  p={2} style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)' }}>
                        <Grid container>
                            <Grid item xs={12} md={12} mt={2} lg={12} marginTop={0.5} display="flex" justifyContent="center">
                                <MDTypography>Get Per Referral INR 5</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                <MDBox fontSize={15} display="flex" justifyContent="center">
                                    <img style={{ maxWidth: '100%', height: 'auto' }} src={ReferralProgramImage}/>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                
                                <MDBox display="flex" alignItems="center">
                                    <SendIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                    <MDTypography ml={0.5} fontSize={15}>Invite Your Friends</MDTypography>
                                </MDBox>
                                
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                <MDBox display="flex" alignItems="center">
                                    <AccountBalanceWalletIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                    <MDTypography ml={0.5} fontSize={15}>Your friend gets 5 Lakhs HeroX</MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={1.5}>
                                <MDBox display="flex" alignItems="center">
                                    <CurrencyRupeeIcon fontSize="small" style={{ borderRadius: '50%',padding:3, border: '1px solid black' }}/>
                                    <MDTypography ml={0.5} fontSize={15}>You get INR 5 for each referral</MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="center">
                                <MDTypography fontSize={16}>Terms & Conditions</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="center">
                                <InviteFriendModal/>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>

            </Grid>
        </MDBox>
    </>
  );
}

export default ReferralHomePage;
