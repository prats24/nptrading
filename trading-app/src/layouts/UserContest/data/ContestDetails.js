import React,{useState, useContext, memo} from 'react'
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
import Timer from '../timer'
import PrizeDistribution from './PrizeDistribution'
import ContestRules from './ContestRules'
import InviteFriend from '../../referrals/Header/InviteFriendModel'
import { userContext } from '../../../AuthContext'

function ContestDetails () {
    const getDetails = useContext(userContext);
    const [isLoading,setIsLoading] = useState(false);
    const [contest,setContest] = useState();
    const [invited,setInvited] = useState(false)
    const [activeReferralProgram,setActiveReferralProgram] = useState();
    const location = useLocation();
    const  id  = location?.state?.data;
    const referralCode = getDetails.userDetails.myReferralCode

    console.log("Location: ",location)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    React.useEffect(()=>{
      
        axios.get(`${baseUrl}api/v1/contest/${id}`)
        .then((res)=>{
                setIsLoading(true);
                setContest(res?.data?.data);
                console.log(res?.data?.data)
                // setTimeout((e)=>{
                //     setIsLoading(false)
                // },500)
        }).catch((err)=>{
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/referrals/active`)
        .then((res)=>{
        //    console.log(res?.data?.data[0])
           setActiveReferralProgram(res?.data?.data[0]);
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


    console.log("Contest Registration Data: ",contest)
  
    return (
    <>
    {!isLoading ? 
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
        </MDBox>
        : 
        <MDBox key={contest?._id} width="100%" bgColor="dark" color="light" p={2}>
        <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={4.5} mb={2}>
                <MDBox color="light">

                    <MDTypography mb={2} color="light" display="flex" flexDirection="row" alignItems="center" alignContent="center">
                        <MDBox mr={2} fontSize={14} display="flex" justifyContent="left" color="light">League is about to begin in</MDBox>
                        <MDBox display="flex" justifyContent="right" fontWeight={700} borderRadius={4} p={0.5} bgColor="light" fontSize={12} color="dark"><Timer targetDate={contest?.contestStartDate} text="Contest has Started" /></MDBox>
                    </MDTypography>

                    <MDTypography color="light" display="flex" flexDirection="row" alignItems="center" alignContent="center">
                        <MDBox mr={2} fontSize={14} display="flex" justifyContent="left" color="light">Registration Open in</MDBox>
                        <MDBox fontWeight={700} borderRadius={4} p={0.5} display="flex" justifyContent="right" bgColor="light" fontSize={12} color="dark"><Timer targetDate={contest?.entryOpeningDate} text="Open for Registration now. Register!" /></MDBox>
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
                           <MDTypography color="light" fontSize={15}>
                            {contest?.entryFee?.currency} {contest?.rewards?.reduce((total, reward) => total + reward?.reward, 0)}
                           </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDTypography color="light" fontSize={15}>Entry Fee : FREE</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                           <MDBox variant="outlined" fontSize="small" color="light" sx={{border: "1px solid white", borderRadius: "5px"}}>
                                <InviteFriend invited={invited} setInvited={setInvited} referralCode={referralCode} referralProgramId={activeReferralProgram?._id} />
                            </MDBox>
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
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="space-between" alignItems="center">
                                <HiUserGroup />
                                <span style={{marginLeft:2,marginTop:2,fontWeight:700}}>Min Participants: {contest?.minParticipants}</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,marginTop:2,fontWeight:700}}>Entries so Far: {contest?.participants?.length}</span>
                            </MDTypography>
                            <MDTypography color="white" fontSize={10} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                                <HiUserGroup /><span style={{marginLeft:2,marginTop:2,fontWeight:700}}>Max Participants: {contest?.maxParticipants}</span>
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
                                    pathname: `/battleground/${contest?.contestName}/register`,
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
                                    pathname: `/battleground`,
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

            <PrizeDistribution contest={contest}/>

            <Grid item xs={0} md={0} lg={0.5}>
                <Divider orientation="vertical" style={{backgroundColor: 'white', height: '100%'}} />
            </Grid>

            <ContestRules contest={contest}/>

        </Grid>
        </MDBox>
    }
    </>
  )

}
export default memo(ContestDetails);