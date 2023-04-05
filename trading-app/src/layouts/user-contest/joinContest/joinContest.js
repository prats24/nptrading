import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
// import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
// import MDButton from "../../components/MDButton";
// import Paper from '@mui/material/Paper';
import MDTypography from "../../../components/MDTypography";
import Divider from '@mui/material/Divider';
// import ContestIcon from "../../../assets/images/contest.png";
// // import ContestDetailsForm from './CreateContest'
// // import StockIcon from '../../assets/images/contest.gif'
// // import MDAvatar from "../../components/MDAvatar";
// import { HiUserGroup } from 'react-icons/hi';
// import Timer from './timer'
import "./Style.css"



const JoinContest = () => {
console.log("hii")

let rewards = 
[
    {rank:1,reward:'INR 200'},
    {rank:2,reward:'INR 150'},
    {rank:3,reward:'INR 100'},
    {rank:4,reward:'INR 80'},
    {rank:5,reward:'INR 60'},
    {rank:6,reward:'INR 30'},
    {rank:7,reward:'INR 10'},
    {rank:8,reward:'INR 5'}
]

    return (
        <>
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
        <MDBox mt={6} ml={3} width="100%">
            <Grid container >

                <Grid items xs={12} md={6} lg={4}>
                    <MDBox>

                        <MDTypography display="flex" justifyContent="center">
                            League is about to begin in 4 days 11 hours
                        </MDTypography>

                        <Grid container>
                            <Grid item>
                               Hello 
                            </Grid>
                        </Grid>

                    </MDBox>
                </Grid>

                <Divider orientation="vertical" flexItem />

                <Grid items xs={12} md={6} lg={4}>
                    <MDBox>
                        <MDTypography display="flex" justifyContent="center">
                            Reward Distribution
                        </MDTypography>
                            <Grid container display="flex" flexDirection="row">
                                
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

                                {rewards.map((e)=>{
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
                                })}


                            </Grid>
                    </MDBox>
                </Grid>
                
                <Divider orientation="vertical" flexItem />

                <Grid items xs={12} md={6} lg={3}>
                    <MDBox>
                        <MDTypography display="flex" justifyContent="center">
                            League Rules
                        </MDTypography>
                    </MDBox>
                </Grid> 

            </Grid>
        </MDBox>
      </>
    )
}



export default JoinContest;