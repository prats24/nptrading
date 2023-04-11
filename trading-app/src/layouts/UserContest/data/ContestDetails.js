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
import { CircularProgress } from '@mui/material';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function ContestDetails () {
    const [isLoading,setIsLoading] = useState(false);
    const [contest,setContest] = useState();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Location: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let rewards = 
    [
        {rank:"1",reward:'INR 200'},
        {rank:"2",reward:'INR 150'},
        {rank:"3",reward:'INR 100'},
        {rank:"4-8",reward:'INR 80'},
        {rank:"9-20",reward:'INR 60'},
        {rank:"21-50",reward:'INR 30'},
        {rank:"51-100",reward:'INR 10'},
        {rank:"101-200",reward:'INR 5'}
    ]
    React.useEffect(()=>{
      
        axios.get(`${baseUrl}api/v1/contest/${id}`)
        .then((res)=>{
                setIsLoading(true);
                setContest(res?.data?.data);
                console.log(res?.data?.data)
                setTimeout((e)=>{
                    setIsLoading(false)
                },500)
        }).catch((err)=>{
            return new Error(err);
        })

    },[])

    function timeChange(timeString){
        // const timeString = "18:27:36.000Z";
        console.log("timeString", timeString)
        const date = new Date(`1970-01-01T${timeString}`);
        const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', options);

        return formattedTime;
    }

    function dateChange(dateString){
        // const dateString = "2023-04-17";
        console.log("dateString", dateString)
        const date = new Date(dateString);
        const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    }

    function convertDate(date){
        console.log(date)
        return `${dateChange(date?.split("T")[0])} | ${timeChange(date?.split("T")[1])}`
    }

    function substractDate(dateTimeString){
        // const dateTimeString = "2023-04-17T18:27:36.000Z";
        const targetDate = new Date(dateTimeString);
        const currentDate = new Date();
        const timeDiff = targetDate.getTime() - currentDate.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const daysDiff = Math.floor(hoursDiff / 24);
        const remainingHours = hoursDiff % 24;

        return (`${daysDiff} days, ${remainingHours} hours`);
    }

    async function joinContest(id){
        const res = await fetch(`${baseUrl}api/v1/contest/${id}`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
            })
        });
        
        const data = await res.json();
        console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            console.log("invalid entry");
        }else{
            // setNextPage(false)
            // window.alert("entry succesfull");
            console.log("entry succesfull");
        }
 
    }

    console.log("Contest Registration Data: ",contest)
    console.log(`/arena/${contest?.contestName}/${contest?._id}`)
  
    return (
    <>
    {isLoading ? 
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
        </MDBox>
        : 
        <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={4.5} mb={2}>
                <MDBox color="light">

                    <MDTypography color="light" display="flex" justifyContent="center">
                        League is about to begin in {substractDate(contest?.contestEndDate)}
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
                           <MDTypography color="light" fontSize={10}>{`${convertDate(contest?.contestStartDate)} to ${convertDate(contest?.contestEndDate)}`}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4} mt={-2} display="flex" justifyContent="right">
                           <MDTypography color="light" fontSize={10}>{convertDate(contest?.entryClosingDate)}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} display="flex" mt={1} ml={1} mr={1} justifyContent="space-between" alignItems="center" alignContent="center">
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Min: {contest?.minParticipants}</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Entries: 20</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Max: {contest?.minParticipants}</span>
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

                                //   onClick={()=>{joinContest(contest?._id)}}
                            >
                                Register
                            </MDButton>
                           
                            <MDButton 
                                variant="outlined" 
                                color="light" 
                                size="small" 
                                component={Link} 
                                to={{
                                    pathname: `/arena`,
                                  }}
                                //   state= {{data:contest?._id}}
                            >
                                Go Back
                            </MDButton>

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

                        {contest?.rewards?.length === 0 ?
                                rewards.map((e)=>{
                                 return <>

                                    <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                                        <MDTypography color="light" fontSize={15}>{e.rank}</MDTypography>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                                        <MDTypography color="light" fontSize={15}>{e.reward}</MDTypography>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                                        <Divider style={{backgroundColor: 'white'}} />
                                    </Grid>
                                </>
                                })
                                :
                                contest?.rewards?.map((e)=>{
                                    return(
                                        <>

                                            <Grid item xs={12} md={6} lg={5} display="flex" justifyContent="center" alignItems="center">
                                                <MDTypography color="light" fontSize={15}>{e?.rankStart == e?.rankEnd ? e?.rankStart : `${e?.rankStart}-${e?.rankEnd}`}</MDTypography>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={7} display="flex" justifyContent="center" alignItems="center">
                                                <MDTypography color="light" fontSize={15}>{`${e?.currency} ${e?.reward}`}</MDTypography>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={12} mt={-2} ml={2} mr={1}>
                                                <Divider style={{backgroundColor: 'white'}} />
                                            </Grid>
                                        </>
                                    )
                                })
                            }
                            
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
    }
    </>
  )

}
export default ContestDetails;