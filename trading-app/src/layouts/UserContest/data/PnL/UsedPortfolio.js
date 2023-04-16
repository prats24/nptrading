import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import { CircularProgress } from "@mui/material";





const UsedPortfolio = ({portfolioId}) => {
  
  const [portfolioRemainData,setPortfolioRemainData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/portfolio/${portfolioId}/remainAmount`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
        setPortfolioRemainData(res.data);
        setIsLoading(false);
        console.log("used portfolio", res.data)
      }).catch((err)=>{
        return new Error(err);
    })
  },[])

    return (
      <>
      {isLoading ?
      <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="light" />
      </Grid>
      :
      <>
                
        <Grid item xs={12} md={12} lg={2} mb={1} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:500}}>Contest Portfolio</MDTypography>
        </Grid>
        <Grid container spacing={1} xs={12} md={6} lg={12} mb={2}>

          <Grid key={portfolioRemainData?.portfolio?._id} item xs={12} md={6} lg={6} >
            <MDBox bgColor='light' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color={"light"} size="small"
            sx={{width: "205%"}} 
            >
            <Grid container spacing={0} sx={{width: "100%"}} >
                
                <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{portfolioRemainData?.portfolio?.portfolioName}</MDTypography>
                </Grid>
                
                <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                    <MDTypography fontSize={15} style={{color:"black"}}>Portfolio Value : ₹{(portfolioRemainData?.portfolio?.portfolioValue).toLocaleString()}</MDTypography>
                </Grid>

                <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={15} style={{color:"black",fontWeight:800}}>Portfolio Current Value : ₹{`${((portfolioRemainData?.portfolio?.portfolioValue) + (portfolioRemainData?.pnl[0]?.amount - portfolioRemainData?.pnl[0]?.brokerage)).toFixed(0)}`}</MDTypography>
                </Grid>

                <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                    <MDTypography fontSize={11} style={{color:"black"}}>Portfolio Type <span style={{fontSize:13,fontWeight:700}}>{portfolioRemainData?.portfolio?.portfolioType}</span></MDTypography>
                </Grid>

                <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                    <MDTypography fontSize={11} style={{color:"black"}}>Portfolio Account <span style={{fontSize:13,fontWeight:700}}>{portfolioRemainData?.portfolio?.portfolioAccount}</span></MDTypography>
                </Grid>

            </Grid>
            </MDButton>
            </MDBox>
          </Grid>

        </Grid>


      </>
      }
      </>
)}



export default UsedPortfolio;