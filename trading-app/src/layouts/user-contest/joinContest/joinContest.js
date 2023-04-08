import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
// import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../components/MDButton";
// import Paper from '@mui/material/Paper';
import MDTypography from "../../../components/MDTypography";
import Divider from '@mui/material/Divider';
import MDAvatar from "../../../components/MDAvatar";
import MDButton from "../../../components/MDButton";
import ContestIcon from "../../../assets/images/contest.png";
import Logo from "../../../assets/images/logo1.jpeg"
import { HiUserGroup } from 'react-icons/hi';
import Input from '@mui/material/Input';

// // import ContestDetailsForm from './CreateContest'
// // import StockIcon from '../../assets/images/contest.gif'
// // import MDAvatar from "../../components/MDAvatar";
// import { HiUserGroup } from 'react-icons/hi';
// import Timer from './timer'
import "./Style.css"
import { Typography } from '@mui/material';
import axios from "axios";
import UserPosition from "./User Position/index";



const JoinContest = ({id, setContestDetailsForm}) => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [contestData, setContestData] = useState([]);
    const [nextPage, setNextPage] = useState(true);
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/contest/${id}`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
        })
        .then((res)=>{
                  setContestData(res.data.data);
                  console.log(res.data.data)
          }).catch((err)=>{
            return new Error(err);
        })
    },[])

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

    let rules = [
        {OrderNo:1,rule:'Start and Finish times - League games could set to start as early as 10:00 am and finish as late as sunset.  No game should be scheduled to complete later that 9:00 pm if lighted fields are available'},
        {OrderNo:2,rule:'Break time between matches -  A minimum of 45 minutes should be allowed between games if teams play two matches in one day.  Coaches need to keep in mind the health and abilities of their players at all times'},
        // {OrderNo:3,rule:'My Rules'},
        // {OrderNo:4,rule:'My Rules'},
        // {OrderNo:5,rule:'My Rules'},
        // {OrderNo:6,rule:'My Rules'},
        // {OrderNo:7,rule:'My Rules'},
        // {OrderNo:8,rule:'My Rules'},
        // {OrderNo:9,rule:'My Rules'},
    ]

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
            setNextPage(false)
            // window.alert("entry succesfull");
            console.log("entry succesfull");
        }
 
    }

    return (
    <>
        {nextPage ?
        <MDBox mt={6} ml={3} width="100%">
            <Grid container >

                <Grid items xs={12} md={6} lg={5}>
                    <MDBox>

                        <MDTypography display="flex" justifyContent="center">
                            League is about to begin in {substractDate(contestData?.contestEndDate)}
                        </MDTypography>

                        <Grid container>
                            <Grid item xs={4} md={3} lg={12} mt={2} display="flex" justifyContent="center">
                            <MDAvatar 
                                src={Logo} 
                                alt="profile-image" size="xl" shadow="sm" />
                            </Grid>
                            <Grid item xs={4} md={3} lg={12} mt={2} display="flex" justifyContent="center">
                            <MDTypography>Reward Pool</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={12} display="flex" justifyContent="center">
                            <MDTypography>Entry: Free</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={12} mt={2} display="flex" justifyContent="center">
                            <MDButton variant="outlined" color="success">Invite Friends</MDButton>
                            </Grid>
                            
                            <Grid container display="flex" justifyContent="center">
                            <Grid item xs={4} md={3} lg={6} mt={2} width="100%" display="flex" justifyContent="left">
                            <MDTypography style={{fontSize:15}} color="success">Duration</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={6} mt={2} width="100%" display="flex" justifyContent="right">
                            <MDTypography style={{fontSize:15}} color="success">Entry Closes at</MDTypography>
                            </Grid>
                            </Grid>

                            <Grid container display="flex" justifyContent="center">
                            <Grid item xs={4} md={3} lg={6} width="100%" display="flex" justifyContent="left">
                            <MDTypography style={{fontSize:12}} color="info">{`${convertDate(contestData.contestStartDate)} to ${convertDate(contestData.contestEndDate)}`}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={6} width="100%" display="flex" justifyContent="right">
                            <MDTypography style={{fontSize:12}} color="info">{convertDate(contestData.entryClosingDate)}</MDTypography>
                            </Grid>
                            </Grid>

                            <Grid container display="flex" justifyContent="center">
                            <Grid item xs={4} md={3} lg={4} width="100%" display="flex" justifyContent="left" alignItems="center" alignContent="center">
                            <MDTypography style={{fontSize:12}} mt={1} color="info"><HiUserGroup /> Min : {contestData?.minParticipants}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={4} width="100%" display="flex" justifyContent="center">
                            <MDTypography style={{fontSize:12}} mt={1} color="info"><HiUserGroup />Left: 1500</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={3} lg={4} width="100%" display="flex" justifyContent="right">
                            <MDTypography style={{fontSize:12}} mt={1} color="info"><HiUserGroup />Max: {contestData?.maxParticipants}</MDTypography>
                            </Grid>
                            </Grid>

                            <Grid item xs={4} md={3} lg={12} mt={2} width="100%" display="flex" justifyContent="center">
                                <Input
                                   type="checkbox"
                                   sx={{mr: "5px"}}
                                />
                                <MDTypography style={{fontSize:15}} color="warning">I accept all the terms and conditions</MDTypography>
                            </Grid>

                            <Grid item xs={4} md={3} lg={6} mt={2} width="100%" display="flex" justifyContent="center">
                            <MDButton variant="outlined" color="success" onClick={()=>{joinContest(id)}}>Continue</MDButton>
                            </Grid>
                            <Grid item xs={4} md={3} lg={6} mt={2} width="100%" display="flex" justifyContent="center">
                            <MDButton variant="outlined" color="error" onClick={()=>{setContestDetailsForm(false)}}>Go Back</MDButton>
                            </Grid>

                        </Grid>

                    </MDBox>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid items xs={12} md={6} lg={3}>
                    <MDBox>
                        <MDTypography display="flex" justifyContent="center">
                            Reward Distribution
                        </MDTypography>
                            <Grid container display="flex" flexDirection="row" border="1px solid black" borderRadius={6}>
                                
                                <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                     <MDTypography>
                                             Rank
                                     </MDTypography>
                                </Grid>

                                <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                     <MDTypography>
                                             Reward
                                     </MDTypography>
                                </Grid>

                                {contestData?.rewards?.length === 0 ?
                                rewards.map((e)=>{
                                 return <>
                                    <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                    <MDTypography>
                                            {e.rank}
                                    </MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                    <MDTypography>
                                            {e.reward}
                                    </MDTypography>
                                    </Grid>
                                </>
                                })
                                :
                                contestData?.rewards?.map((e)=>{
                                    return(
                                        <>
                                            <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                                <MDTypography>
                                                        {e.rankStart == e.rankEnd ? e.rankStart : `${e.rankStart}-${e.rankEnd}`}
                                                </MDTypography>
                                            </Grid>

                                            <Grid item xs={6} md={3} lg={6} display="flex" justifyContent="center">
                                                <MDTypography>
                                                        {`${e.currency} ${e.reward}`}
                                                </MDTypography>
                                            </Grid>
                                        </>
                                    )
                                })
                                }


                            </Grid>
                    </MDBox>
                </Grid>
                
                <Divider orientation="vertical" flexItem />

                <Grid items xs={12} md={6} lg={3}>
                    <MDBox>
                    <MDTypography display="flex" justifyContent="center">
                            League Rules
                        </MDTypography>
                        <MDBox display="flex" border="1px solid black" borderRadius={6}>
                            <Grid container display="flex" flexDirection="row">
                            
                            
                                {rules.map((e)=>{
                                 return <>
                                    <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
                                    <MDTypography>
                                            {e.OrderNo}
                                    </MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={3} lg={9}  display="flex" justifyContent="center">
                                    <MDTypography fontSize="15px">
                                            {e.rule}
                                    </MDTypography>
                                    </Grid>
                                </>
                                })}    
                            </Grid>
                            </MDBox>
                    </MDBox>
                </Grid> 

            </Grid>
        </MDBox>
        :
        <MDBox mt={6} ml={3} width="100%">
        <UserPosition contestId={id}/>
        </MDBox>
        }
      </>
    )
}



export default JoinContest;



        {/* <MDBox pt={0} pb={1}> */}
            {/* <Grid container spacing={2} mt={-4}> */}
                {/* <div className='container'>
                    <div className='sub-container1'>
                        <div className='top-text'>League is about to begin <span style={{backgroundColor: 'green', color: "white", padding: "5px", borderRadius: "5px"}}>4 days 11 hours</span></div>
                        <div className='sub-container-part1'>
                            <img className='img' src="https://kappanonline.org/wp-content/uploads/2019/07/PDK_101_1_Nordengren_554x350.jpg" alt="img" />
                            <div className='part1-a'>Reward Pool</div>
                            <div className='part1-a' style={{fontWeight: "600", fontSize: "25px"}}>₹ 2,00,000</div>
                            <div className='part1-a'>Entry: <span style={{fontWeight: "600"}}>Free</span></div>
                            <button  className='btn part1-d'>INVITE FRIENDS</button>
                        </div>
                        <div className='sub-container-part2'>
                            <div className='part2-a'>
                                <div>Duration</div>
                            </div>
                            <div className='part2-a'>
                                <div>Entry closes at</div>
                            </div>
                        </div>
                        <div className='sub-container-part2 part2-bottom'>
                            <div className='part2-b'>
                                <div>10 Apr 23 | 09:30 am</div>
                            </div>
                            <div className='part2-b'>
                                <div>12 Apr 23 | 09:30 am</div>
                            </div>
                        </div>
                        <div className='sub-container-part3'>
                            <div className='part3-a'>
                                Min: 5000
                            </div>
                            <div className='part3-a'>
                                Left: 73376
                            </div>
                            <div className='part3-a'>
                                Max: 100000
                            </div>
                        </div>

                        <div className='bottom-text'>
                            <input type={"checkbox"} />
                            <div>I accept all the <a>term & condition</a> for this league</div>
                            
                        </div>
                        <div className='sub-container-part4'>
                            <button className='btn continue'>CONTINUE</button>
                            <button className='btn back'>BACK</button>
                        </div>

                    </div>
                    <div className='sub-container2'>
                        reward table
                    </div>
                    <div className='sub-container3'>
                        rules
                    </div>
                </div> */}
            {/* </Grid>
        </MDBox> */}