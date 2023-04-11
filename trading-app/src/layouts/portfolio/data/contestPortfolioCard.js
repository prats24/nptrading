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
            
            <Grid key={e._id} item xs={12} md={6} lg={3} >
            <MDBox bgColor='dark' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color="dark" size="small" 
              component={Link} 
              to={{
                pathname: `/createPortfolio`,
              }}
              state= {{data:e._id}}
            >
                <Grid container>
                    
                    <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e?.portfolioName}</MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"white"}}>Portfolio Value</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                        <MDTypography fontSize={15} style={{color:"white",fontWeight:800}}>₹{(e?.portfolioValue).toLocaleString()}</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{color:"white"}}>Portfolio Type <span style={{fontSize:11,fontWeight:700}}>{e?.portfolioType}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{color:"white"}}>Portfolio Account <span style={{fontSize:11,fontWeight:700}}>{e.portfolioAccount}</span></MDTypography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display="flex" mt={1} justifyContent="space-between" alignItems="center" alignContent="center">
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Linked Users : {e?.users?.length}</span>
                        </MDTypography>
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <span style={{marginLeft:2,fontWeight:700}}>Status : {e?.status}</span>
                        </MDTypography>
                    </Grid>

                </Grid>
                </MDButton>
            </MDBox>
            </Grid>
            
          )
          })}
        </Grid>

      </>
)}



export default ContestPortfolioCard;