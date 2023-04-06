import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import RewardsTable from './components/RewardsTable';
// import axios from "axios";
// Material Dashboard 2 React components
// import MDBox from "../../../components/MDBox";
// import MDButton from "../../components/MDButton";
// import Paper from '@mui/material/Paper';
// import MDTypography from "../../../components/MDTypography";
// import ContestIcon from "../../../assets/images/contest.png";
// // import ContestDetailsForm from './CreateContest'
// // import StockIcon from '../../assets/images/contest.gif'
// // import MDAvatar from "../../components/MDAvatar";
// import { HiUserGroup } from 'react-icons/hi';
// import Timer from './timer'
import "./Style.css"



const JoinContest = () => {
console.log("hii")

    return (
        <>
        <div className='table'> 
            <div>
                hello
            </div>
            <div>
                <h4>Rewards</h4>
                <RewardsTable/>
            </div>
            <div>
                rules
            </div>
        </div>

        {/* <Grid item xs={12} md={6} lg={4}>
            <MDBox>League is about to start <span>Timming</span></MDBox> */}
        {/* <button style={{border: 'none',width:"100%", cursor:"pointer"}} onClick={()=>{setObjectId(e._id);setContestDetailsForm(true);setIsObjectNew(true)}}> */}
            {/* <Paper 
              elevation={3}
              style={{
                position: 'relative', 
                backgroundColor: '#1c2127', 
                width: '100%', // Add this line to set the width to 100%
                height: 180,
                // width:280,
                borderRadius: 6,
              }}
            >
              <MDBox>
                <MDBox style={{
                  backgroundImage: `url(${ContestIcon})`,
                  backgroundPosition: 'top left',
                  backgroundSize: '50px 50px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50px',
                  height: '50px',
                  margin: '8px',
                  borderRadius:"10%"
                }}>
                </MDBox>
                <MDBox display="flex" justifyContent="center" flexDirection="column">
                <MDTypography paddingTop={1.5} display="flex" fontSize={14} marginLeft="65px" color="white">{e?.contestName}</MDTypography>
                <MDTypography display="flex" fontSize={12} marginLeft="65px" color="white">Contest Starts: {dateConvert(e?.contestStartDate)}</MDTypography>
                </MDBox>
                <Grid container>
                  <Grid item xs={12} md={12} lg={12}>
                    <MDTypography color="white" mt={2} display="flex" fontSize={14} fontWeight={900} justifyContent="center" alignContent="center">Total Rewards</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <MDTypography color="white" display="flex" fontSize={14} justifyContent="center" alignContent="center">
                      {e?.entryFee?.currency} {e?.rewards?.reduce((total, reward) => total + reward?.reward, 0)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <MDTypography color="black" display="flex" fontSize={10} justifyContent="center" alignContent="center">
                        <span style={{borderRadius:6, backgroundColor: "white", padding: "0 8px" }}>
                          <Timer targetDate={e.contestStartDate} text="Contest Started" />
                        </span>
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} display="flex" mt={3} ml={1} mr={1} justifyContent="space-between">
                    <MDTypography color="white" fontSize={10}>
                      <HiUserGroup /> Min Participants: {e?.minParticipants}
                    </MDTypography>
                    <MDTypography color="white" fontSize={10}>
                    <HiUserGroup /> Max Participants: {e?.maxParticipants}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
            </Paper> */}
          {/* </button> */}
      {/* </Grid> */}
      </>
    )
}



export default JoinContest;