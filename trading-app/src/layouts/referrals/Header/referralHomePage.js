// Material Dashboard 2 React example components
import React, {useContext} from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import DataTable from "../../../examples/Tables/DataTable";
import InviteFriendModal from './InviteFriendModel'
import { CircularProgress, Typography } from "@mui/material";
import { FaUsers } from 'react-icons/fa';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { IoLogoWhatsapp } from 'react-icons/io';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Icons
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import ReferralHeader from "./Header";
//Images
import ReferralProgramImage from '../../../assets/images/referral-program.png'
import ReferralImage from '../../../assets/images/referral.png'
import Invited from '../data/invitedData'

function ReferralHomePage() {
  const [invited,setInvited] = useState(false)
  const getDetails = useContext(userContext);
  const {columns, rows} = Invited();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeReferralProgram,setActiveReferralProgram] = useState();
  const [invitedData,setInvitedData] = useState([]);
  const [invitedCount,setInvitedCount] = useState([]);
  const [joinedData,setJoinedData] = useState([]);
  const [joinedCount,setJoinedCount] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const id = getDetails.userDetails._id
  const referralCode = getDetails.userDetails.myReferralCode
  console.log(getDetails)
  
  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/leadsinvited/${id}`)
    .then((res)=>{
       console.log(res)
       setInvitedData(res?.data?.data);
       setInvitedCount(res?.data?.count);
    }).catch((err)=>{
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/leadsjoined/${id}`)
    .then((res)=>{
       setJoinedData(res?.data?.data);
       setJoinedCount(res?.data?.count);
    }).catch((err)=>{
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/referrals/active`)
    .then((res)=>{
       console.log('ye hai ref', res?.data?.data[0])
       setActiveReferralProgram(res?.data?.data[0]);
    }).catch((err)=>{
        return new Error(err);
    })
  },[invited])

//   console.log("Invited Data: ",invitedData)
  console.log("ye hai ref Active Referral Program ID: ",activeReferralProgram);

  invitedData?.map((elem)=>{
        
    let refData = {}

    function dateConvert(dateToConvert){
    if(dateToConvert){
    const date = new Date(dateToConvert);
    const formattedDate = date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return formattedDate;
    }
    else{
        return '-';
    }
    }

    refData.name = (
      <MDButton variant="Contained" color="info" fontWeight="medium">
        {elem.name}
      </MDButton>
    );
    
    refData.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.email ? elem.email : '-'}
      </MDTypography>
    );

    refData.mobile = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.mobile ? elem.mobile : '-'}
        </MDTypography>
      );
    
    refData.invitedon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {dateConvert(elem.invitedOn)}
      </MDTypography>
    );

    refData.joinedon = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {dateConvert(elem.joinedOn)}
        </MDTypography>
      );
    
    refData.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );
 
    rows.push(refData)
    
})

  return (
    <>
        <MDBox width="100%" p={5} bgColor="dark" mb={2}>
            <MDBox>
                <Grid container spacing={4}>
                    
                    <Grid item xs={12} md={12} lg={8}>
                        <MDBox color="light" pt={2.25} pb={2.25} display="flex" justifyContent="center">
                            StoxHero Referral Program - {activeReferralProgram?.referralProgramName}
                        </MDBox>
                        <MDBox fontSize={15} display="flex" justifyContent="center">
                            <img alt="Referral Program" style={{ maxWidth: '100%', height: 'auto' }} src={ReferralImage}/>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                        <MDBox bgColor="light"  p={2} style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)' }}>
                            <Grid container>
                                <Grid item xs={12} md={12} mt={2} lg={12} marginTop={0.5} display="flex" textAlign="center" justifyContent="center">
                                    <MDTypography fontSize={15}>Get {activeReferralProgram?.currency} {activeReferralProgram?.rewardPerReferral} for every referral in your StoxHero wallet</MDTypography>
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
                                        <MDTypography ml={0.5} fontSize={15}>You get {activeReferralProgram?.currency} {activeReferralProgram?.rewardPerReferral} for each referral</MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="center">
                                    <MDTypography fontSize={16}>Terms & Conditions</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={2} display="flex" justifyContent="center">
                                    <InviteFriendModal invited={invited} setInvited={setInvited} referralCode={referralCode} referralProgramId={activeReferralProgram?._id}/>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid>

                </Grid>
            </MDBox>

            <MDBox mt={3}>
                <Grid container >
                <Grid items xs={12} md={6} lg={3}>
                    <MDBox 
                        style={{
                            backgroundColor:"white",
                            margin:4,height:100,
                            borderRadius:8,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            fontFamily: "Proxima Nova",
                            display:"flex",
                            justifyContent:"center"
                            }}
                        >
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                            <QrCode2Icon color="success" fontSize="large" style={{width:"80%", height:"80%"}}/>
                        </MDBox>
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                                <MDTypography fontSize="13px" lineHeight={1}>My Referral Code</MDTypography>
                                <MDTypography 
                                    style={{borderRadius:8,backgroundColor:"lightgrey",padding:6,margin:6}} 
                                    fontSize="17px" 
                                    lineHeight={1}
                                >
                                    {getDetails?.userDetails?.myReferralCode}
                                </MDTypography>  
                                <a 
                                href={`https://api.whatsapp.com/send?text=Hey,
                                %0A%0A*AB INDIA SIKHEGA OPTIONS TRADING AUR BANEGA ATMANIRBHAR*
                                %0A%0AJoin me at StoxHero - India's First Options Trading and Investment Platform 🤝 
                                %0A%0A👉 Get 10,00,000 virtual currency in your account to start option trading using my referral code.
                                %0A%0A👉 Join the community of ace traders and learn real-time options trading.
                                %0A%0A👉 Participate in free options trading contests to sharpen your trading skills.
                                %0A%0A📲 Visit https://www.stoxhero.com/signup
                                %0A%0AUse my below invitation code 👇 and get INR ₹10,00,000 in your wallet and start trading.
                                %0A%0AMy Referral Code to join the StoxHero: *${getDetails.userDetails.myReferralCode}*`}
                                target="_blank">
                                {/* <MDTypography variant="contained" display="flex" justifyContent="center" style={{fontSize:"12px",lineHeight:1}}>
                                    Click to Share on &nbsp;<IoLogoWhatsapp color="green" lineHeight={1} />
                                </MDTypography> */}
                                </a>
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid items xs={12} md={6} lg={3}>
                    <MDBox 
                        style={{
                            backgroundColor:"white",
                            margin:4,height:100,
                            borderRadius:8,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            fontFamily: "Proxima Nova",
                            display:"flex",
                            justifyContent:"center"
                            }}
                        >
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                            <FaUsers color="grey" fontSize="large" style={{width:"80%", height:"80%"}}/>
                        </MDBox>
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                                <MDTypography fontSize="30px" lineHeight={1}>{invitedCount + joinedCount}</MDTypography>
                                <MDTypography fontSize="12px" lineHeight={1}>Friends Invited</MDTypography>  
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid items xs={12} md={6} lg={3}>
                    <MDBox 
                        style={{
                            backgroundColor:"white",
                            margin:4,height:100,
                            borderRadius:8,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            fontFamily: "Proxima Nova",
                            display:"flex",
                            justifyContent:"center"
                            }}
                        >
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                            <PeopleAltIcon color="success" fontSize="large" style={{width:"80%", height:"80%"}}/>
                        </MDBox>
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                                <MDTypography fontSize="30px" lineHeight={1}> {joinedCount} </MDTypography>
                                <MDTypography fontSize="12px" lineHeight={1}>Friends Joined</MDTypography>  
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid items xs={12} md={6} lg={3}>
                    <MDBox 
                        style={{
                            backgroundColor:"white",
                            margin:4,height:100,
                            borderRadius:8,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            fontFamily: "Proxima Nova",
                            display:"flex",
                            justifyContent:"center"
                            }}
                        >
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                            <CurrencyRupeeIcon color="info" fontSize="large" style={{width:"80%", height:"80%"}}/>
                        </MDBox>
                        <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                                <MDTypography fontSize="30px" lineHeight={1}>0</MDTypography>
                                <MDTypography fontSize="12px" lineHeight={1}>Earnings in INR</MDTypography>  
                        </MDBox>
                    </MDBox>
                </Grid>
                </Grid>
            </MDBox>

            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={1}>
                                    Referral Status
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </MDBox>
    </>
  );
}

export default ReferralHomePage;
