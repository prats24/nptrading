import React,{useState} from 'react'
import MDBox from '../../../components/MDBox'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import Logo from '../../../assets/images/logo1.jpeg'
import { Divider } from '@mui/material'
import { HiUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useLocation } from 'react-router-dom';
import axios from "axios";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function ContestDetails () {
    const [contest,setContest] = useState();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Location: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
    React.useEffect(()=>{
      
        axios.get(`${baseUrl}api/v1/contest/${id}`)
        .then((res)=>{
                setContest(res?.data?.data);
                console.log(res?.data?.data)
        }).catch((err)=>{
            return new Error(err);
        })

    },[])

    console.log("Contest Registration Data: ",contest)
    console.log(`/arena/${contest?.contestName}/${contest?._id}`)
  
    return (
    <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={4.5} mb={2}>
                <MDBox color="light">

                    <MDTypography color="light" display="flex" justifyContent="center">
                        League is about to begin in 4 days 11 hours
                    </MDTypography>

                    <Grid container  spacing={2}>
                        
                        <Grid item xs={12} md={6} lg={12} mt={4} display="flex" justifyContent="center">
                           <img src={Logo} width={60} height={60} style={{borderRadius:"50%"}}/> 
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDTypography style={{backgroundColor:"white",padding:3,borderRadius:3,fontWeight:700}} color="dark" fontSize={15}>{contest?.contestName}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDTypography color="light" fontSize={15}>Reward Pool</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDTypography color="light" fontSize={15}>INR 4,00,000</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDTypography color="light" fontSize={15}>Entry Fee : FREE</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDButton variant="outlined" fontSize="small" color="light">Invite Friends</MDButton>
                        </Grid>

                        <Grid item xs={12} md={6} lg={8} display="flex" justifyContent="left">
                           <MDTypography color="light" fontSize={15}>Duration</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="right">
                           <MDTypography color="light" fontSize={15}>Entry closes at</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={8} mt={-2} display="flex" justifyContent="left">
                           <MDTypography color="light" fontSize={10}>10 Apr 23 10:00 AM to 10 Apr 23 11:00 AM</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4} mt={-2} display="flex" justifyContent="right">
                           <MDTypography color="light" fontSize={10}>10 Apr 23 10:00 AM</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} display="flex" mt={1} ml={1} mr={1} justifyContent="space-between" alignItems="center" alignContent="center">
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Min: 50</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Entries: 20</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Max: 100</span>
                            </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={2} display="flex" justifyContent="center" alignItems="center">
                            <TaskAltIcon />
                            <MDTypography color="light" fontSize={15}>I accept the <Link style={{color:"grey"}} href="#">terms and conditions</Link> for this contest</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={2} display="flex" justifyContent="space-between" alignItems="center">
                            
                            <MDButton 
                                variant="outlined" 
                                color="light" 
                                size="small" 
                                component={Link} 
                                to={{
                                    pathname: `/arena/${contest?.contestName}/register`,
                                  }}
                                  state= {{data:contest?._id}}
                            >
                                Register
                            </MDButton>
                           
                            <Link variant="contained" color="dark" size="small" 
                                // component={Link} 
                                // to={`/contestPage/${e.contestName}`} 
                                to={{
                                pathname: `/arena/${contest?._id}`,
                                }}
                                state= {{data:contest?._id}}
                            >
                                Register
                            </Link>
                        </Grid>


                    </Grid>

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            <Grid item xs={12} md={6} lg={3} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={4} color="light" display="flex" justifyContent="center">
                        Prize Distribution
                    </MDTypography>

                    <MDBox display="flex" justifyContent="center" >
                        <img src={Logo} width={60} height={60} style={{borderRadius:"50%"}}/> 
                    </MDBox>

                    <Grid container  mt={2} style={{border:'1px solid white',borderRadius:6}}>

                        <Grid item xs={12} md={6} lg={5} mt={1} mb={1}display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rank</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} mt={1} mb={1}display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Prize Amount</MDTypography>
                        </Grid>

                        
                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>1</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 300</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>2</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={15}>INR 200</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                            <Divider style={{backgroundColor: 'white'}} />
                        </Grid>
    
                    </Grid>

                </MDBox>
            </Grid>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            <Grid item xs={12} md={6} lg={3.5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={4} color="light" display="flex" justifyContent="center">
                        Contest Rules
                    </MDTypography>

                    <MDBox display="flex" justifyContent="center" >
                        <img src={Logo} width={60} height={60} style={{borderRadius:"50%"}}/> 
                    </MDBox>

                    <Grid container  mt={2} style={{border:'1px solid white',borderRadius:6}}>

                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rule No. 1 is for thos who want to lay the game at cost of life</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rule No. 1 is for thos who want to lay the game at cost of life</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rule No. 1 is for thos who want to lay the game at cost of life</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rule No. 1 is for thos who want to lay the game at cost of life</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={2} mt={1} mb={1} pl={-2}  display="flex" justifyContent="center" alignItems="center">
                           <KeyboardArrowRightIcon/>
                        </Grid>

                        <Grid item xs={12} md={6} lg={10} mt={1} mb={1}  display="flex" justifyContent="center" alignItems="center">
                           <MDTypography color="light" fontSize={15}>Rule No. 1 is for thos who want to lay the game at cost of life</MDTypography>
                        </Grid>
    
                    </Grid>

                </MDBox>
            </Grid>

        </Grid>
    </MDBox>
  )

}
export default ContestDetails;