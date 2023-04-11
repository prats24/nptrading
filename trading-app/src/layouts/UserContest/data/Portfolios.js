import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { HiUserGroup } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';




const ContestPortfolioCard = ({isObjectNew,setIsObjectNew}) => {
  const [contestPortfolioData,setContestPortfolioData] = useState([]);
  const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/portfolio/contest`)
      .then((res)=>{
                setContestPortfolioData(res.data.data);
                console.log(res.data.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[])

      
  console.log(contestPortfolioData) 
    
    return (
      <>

        <Grid container spacing={1} xs={12} md={6} lg={12}>
          {contestPortfolioData?.map((e)=>{
          return (
            
            <Grid key={e._id} item xs={12} md={6} lg={6} >
            <MDBox bgColor='light' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color="light" size="small" 
              component={Link} 
            >
                <Grid container spacing={0}>
                    
                    <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e?.portfolioName}</MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black"}}>Portfolio Value</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",fontWeight:800}}>₹{(e?.portfolioValue).toLocaleString()}</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{color:"black"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                    </Grid>

                </Grid>
                </MDButton>
            </MDBox>
            </Grid>
            
          )
          })}
          <Grid container >
          <Grid item mt={2} xs={6} md={3} lg={12} display="flex" justifyContent="center">
            <MDTypography color="light">Select Your Portfolio and click on join!</MDTypography>
          </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light">
                    Join
                </MDButton>
            </Grid>
            <Grid item mt={2} xs={6} md={3} lg={6} display="flex" justifyContent="center"> 
                <MDButton variant="outlined" size="small" color="light">
                    Back
                </MDButton>
            </Grid>
          </Grid>
        </Grid>

      </>
)}



export default ContestPortfolioCard;