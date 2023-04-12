import React,{useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
// import MDButton from '../../../components/MDButton'
// import Logo from '../../../assets/images/logo1.jpeg'
// import { Divider } from '@mui/material'
// import { HiUserGroup } from 'react-icons/hi';
// import { Link } from 'react-router-dom';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import { useLocation } from 'react-router-dom';
import axios from "axios";

function TradersRanking({contestId}){

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [rankData, setRankData] = useState([]);
  useEffect(()=>{
  
    axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/rank`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
        setRankData(res.data.data);
          console.log("in use effect", res.data)
      }).catch((err)=>{
        return new Error(err);
    })
  },[])

  console.log("in use effect", rankData)

return (
    <>
        <Grid item xs={12} md={6} lg={5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={2} color="light" display="flex" justifyContent="center">
                        Ranks
                    </MDTypography>
                    
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                          <MDTypography fontSize={13} color="light">My Rank</MDTypography>
                        </Grid>
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Rank</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Name</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>P&L</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Profit(%)</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
                        
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">121</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="light">Prateek Pawan</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="error">-₹2,000</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                          <MDTypography fontSize={13} color="error">-20%</MDTypography>
                        </Grid>
    
                    </Grid>

                    <Grid container mt={2}>
                        <Grid item xs={12} md={12} lg={12}>
                          <MDTypography fontSize={13} color="light">Top 10 Traders Rank</MDTypography>
                        </Grid>
                    </Grid>

                    {rankData.map((elem, index)=>{
                      let netPnl = elem?.totalAmount - elem?.brokerage;
                      let profitChange = netPnl*100/elem?.investedAmount;
                      return(
                        <Grid key={elem.userId.trader} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
      
                          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                            <MDTypography fontSize={13} color="light">{index+1}</MDTypography>
                          </Grid>
                          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                            <MDTypography fontSize={13} color="light">{elem.userId.createdBy}</MDTypography>
                          </Grid>
                          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                            <MDTypography fontSize={13} color={netPnl >= 0 ? "success" : "error"}>
                                {netPnl >= 0.00 ? "+₹" + (netPnl?.toFixed(2)): "-₹" + ((-netPnl).toFixed(2))}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
                            <MDTypography fontSize={13} color={profitChange >= 0 ? "success" : "error"}>
                                {profitChange >= 0.00 ? "+" + (profitChange?.toFixed(2)): "-" + ((-profitChange).toFixed(2))}%
                            </MDTypography>
                          </Grid>
    
                        </Grid>
                      )

                    })}

                </MDBox>
            </Grid> 
    </>
);
}

export default TradersRanking;