import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import ContestIcon from "../../../assets/images/contest.png";
import { HiUserGroup } from 'react-icons/hi';
import Timer from '../timer'
import { Typography } from '@mui/material';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ProgressBar from '../data/ProgressBar'
  

const ContestCard = () => {

  const [contestData,setContestData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let timerStyle = {
    textAlign: "center", 
    fontSize: ".75rem", 
    color: "#003366", 
    backgroundColor: "#CCCCCC", 
    borderRadius: "5px", 
    padding: "5px",  
    fontWeight: "600",
    display: "flex", 
    alignItems: "center"
  }


  useEffect(()=>{
  
    // promise.all[]
    let call1 = axios.get(`${baseUrl}api/v1/contest/active`)
    let call2 = axios.get(`${baseUrl}api/v1/contest/mycontests`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      console.log(api2Response.data.data);
      let activeData = api1Response.data.data;
      let myData = api2Response.data.data;

      activeData = activeData.filter((elem1) => !myData.some((elem2) => elem1._id === elem2._id));

      console.log(activeData);
      setContestData(activeData);
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });  
              
  },[])

  function dateConvert(dateConvert){
    const dateString = dateConvert;
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    
    // get day of month and add ordinal suffix
    const dayOfMonth = date.getDate();
    let suffix = "th";
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = "st";
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = "nd";
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = "rd";
    }
    
    // combine date and time string with suffix
    const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    
    // console.log(finalFormattedDate);
    
  

  return finalFormattedDate
  }
      
  return (
      <>
      <MDBox bgColor="light" minWidth="100%" minHeight='auto'>
      <Grid container spacing={2}>
      {contestData?.map((e)=>{

        return <>
        
            <Grid key={e._id} item xs={12} md={6} lg={3} >
            <MDBox bgColor='dark' padding={0} style={{borderRadius:4}}>
            <MDButton variant="contained" color="dark" size="small" 
            component={Link} 
            to={{
              pathname: `/arena/${e.contestName}`,
            }}
            state= {{data:e._id}}
            >
                <Grid container>
                    <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
                        <img src={ContestIcon} width={50} height={50}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={12} mt={1} mb={2} display="flex" justifyContent="center">
                        <Typography fontSize={15} style={{color:"black",backgroundColor:"whitesmoke",borderRadius:3,paddingLeft:4,paddingRight:4}}>{e.contestName}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} style={{fontWeight:1000}} display="flex" justifyContent="center">
                        <Typography fontSize={15} style={{color:"white"}}>Total Reward</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center">
                        <Typography fontSize={15} style={{color:"white",fontWeight:800}}>{e?.entryFee?.currency} {e?.rewards?.reduce((total, reward) => total + reward?.reward, 0).toLocaleString()}</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12} mb={1} style={{color:"white",fontSize:11}} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                      <span style={timerStyle}>
                        <AvTimerIcon/><Timer targetDate={e.contestStartDate} text="Contest Started" />
                      </span>
                    </Grid>

                    <Grid item xs={12} md={6} lg={8} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={8} style={{color:"white"}}>Starts <span style={{fontSize:10,fontWeight:700}}>{dateConvert(e?.contestStartDate)}</span></Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4} mb={1} display="flex" justifyContent="center">
                        <Typography fontSize={8} style={{color:"white"}}>Entry <span style={{fontSize:10,fontWeight:700}}>{e?.entryFee?.amount ? 'FREE' : e?.entryFee?.amount}</span></Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} sx={{width:"100%"}}>
                      <ProgressBar progress={((e?.participants?.length)/(e?.maxParticipants)*100)}/>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display="flex" mt={1} ml={1} mr={1} justifyContent="space-between" alignItems="center" alignContent="center">
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Min: {e?.minParticipants}</span>
                        </MDTypography>
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Entries: {e?.participants?.length}</span>
                        </MDTypography>
                        <MDTypography color="white" fontSize={10} display="flex" justifyContent="center">
                            <HiUserGroup /><span style={{marginLeft:2,fontWeight:700}}>Max: {e?.maxParticipants}</span>
                        </MDTypography>
                    </Grid>

                </Grid>
                </MDButton>
            </MDBox>
            </Grid>
        
        </>
        })}
    </Grid>

      </MDBox>
      </>
  )
}



export default ContestCard;