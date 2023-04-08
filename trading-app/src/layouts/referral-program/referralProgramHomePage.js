// Material Dashboard 2 React example components
import React, {useContext} from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../AuthContext";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { FaUsers } from 'react-icons/fa';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { IoLogoWhatsapp } from 'react-icons/io';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


// Icons
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import ReferralHeader from "./Header";


function ReferralHomePage() {
    const [referralProgram,setReferralProgram] = useState();
    const [totalUsers, setTotalUsers] = useState();
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    
    useEffect(()=>{
    
      axios.get(`${baseUrl}api/v1/referrals/active`)
      .then((res)=>{
         console.log(res)
         setReferralProgram(res?.data?.data[0]);
         setTotalUsers(res?.data?.data[0]?.users?.length)
      }).catch((err)=>{
          return new Error(err);
      })
    },[])

console.log("Referral Program: ",referralProgram)

function ConvertDate(dateToConvert){
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
}


return (

    <MDBox>
        
        <MDBox>
        <Grid container spacing={1}>

            <Grid item xs={12} md={6} lg={3}>
                <MDButton color="dark" variant="contained" width="100%" style={{minWidth:"100%"}}>
                <MDBox>
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography pt={1} color="light" fontSize={20} display="flex" justifyContent="center">10</MDTypography>
                        <MDTypography pb={1} color="light" fontSize={13} display="flex" justifyContent="center">Total Referrals</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
                <MDButton color="dark" variant="contained" style={{minWidth:"100%"}}>
                <MDBox>
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography pt={1} color="light" fontSize={20} display="flex" justifyContent="center">10</MDTypography>
                        <MDTypography pb={1} color="light" fontSize={13} display="flex" justifyContent="center">Total Referrals</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
                <MDButton color="dark" variant="contained" style={{minWidth:"100%"}}>
                <MDBox>
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography pt={1} color="light" fontSize={20} display="flex" justifyContent="center">10</MDTypography>
                        <MDTypography pb={1} color="light" fontSize={13} display="flex" justifyContent="center">Total Referrals</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
            
                <MDButton color="dark" variant="contained" style={{minWidth:"100%"}}>
                <MDBox >
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography pt={1} color="light" fontSize={20} display="flex" justifyContent="center">10</MDTypography>
                        <MDTypography pb={1} color="light" fontSize={13} display="flex" justifyContent="center">Total Referrals</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            
            </Grid>
            
           

        </Grid>
        </MDBox>

        <MDBox mt={2}>
        <Grid container spacing={1}>


            <Grid item xs={12} md={6} lg={6}>
                <MDBox bgColor="dark" borderRadius={5} variant="contained" style={{minWidth:"100%", minHeight:'auto'}}>
                <MDBox>
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography p={1} m={2} color="dark" borderRadius={1} fontSize={20} display="flex" backgroundColor="white!important" justifyContent="center">Active Referral Program</MDTypography>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Referral Program Name</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{referralProgram?.referrralProgramName}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Referral Program Start Date</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{ConvertDate(referralProgram?.referralProgramStartDate)}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Referral Program End Date</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{ConvertDate(referralProgram?.referralProgramEndDate)}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Reward Per Referral</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{referralProgram?.rewardPerReferral}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Currency</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{referralProgram?.currency}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Referral Program Status</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{referralProgram?.status}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Description</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} minHeight={35} justifyContent="center">{referralProgram?.description}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6} mb={2}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Terms & Conditions</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} minHeight={35} justifyContent="center">{referralProgram?.termsAndContions}</MDTypography>
                            </Grid>

                        </Grid>
                    </MDBox>
                </MDBox>
                </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
            
                <MDBox bgColor="dark" borderRadius={5} variant="contained" style={{minWidth:"100%", minHeight:'auto'}}>
                <MDBox >
                    <MDBox display="flex" justifyContent="center" flexDirection="column">
                        <MDTypography p={1} m={2} color="dark" fontSize={20} display="flex" borderRadius={1} backgroundColor="white!important" justifyContent="center">Referral Program Performance</MDTypography>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Users Invited (By Email)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">10000</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Users Invited (By Mobile)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">10000</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Users Invited (By Mobile & Email)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">10000</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Users Invited (Total)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">10000</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Users Joined (Total)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="warning" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{totalUsers}</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Conversion(%)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">60%</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <MDTypography p={1} ml={2} mr={2} color="light" fontSize={13} display="flex" justifyContent="center">Referral Bonus Payout (INR)</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6} mb={2}>
                                <MDTypography p={1} ml={2} mr={2} color="warning" fontSize={13} style={{fontWeight:600}} display="flex" backgroundColor="grey!important" borderRadius={1} justifyContent="center">{totalUsers*referralProgram?.rewardPerReferral}</MDTypography>
                            </Grid>

                        </Grid>
                    </MDBox>
                </MDBox>
                </MDBox>
            
            </Grid>
            
           

        </Grid>
        </MDBox>
        
    </MDBox>

)}

export default ReferralHomePage;