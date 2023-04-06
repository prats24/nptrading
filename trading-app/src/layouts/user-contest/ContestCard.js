import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";
import ContestDetailsForm from './CreateContest'
import StockIcon from '../../assets/images/contest.gif'
import MDAvatar from "../../components/MDAvatar";
import { HiUserGroup } from 'react-icons/hi';
import Timer from './timer'
import JoinContest from './joinContest/joinContest';



const ContestCard = ({createContestForm,setCreateCOntestForm,isObjectNew,setIsObjectNew}) => {
  const [contestData,setContestData] = useState([]);
  const [contestDetailsForm,setContestDetailsForm] = useState(false)
  const [objectId,setObjectId] = useState('')
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/contest`)
      .then((res)=>{
                setContestData(res.data.data);
                console.log(res.data.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[createContestForm])

      // console.log("Contest Data: ",contestData)

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
        
        console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"
        
     

      return finalFormattedDate
    }
      
    

    return (
      <>
      {     
      !contestDetailsForm ?
      <>
      {contestData?.map((e)=>(
      
      <Grid item xs={12} md={6} lg={4}>
        <button style={{border: 'none',width:"100%", cursor:"pointer"}} onClick={()=>{setObjectId(e._id);setContestDetailsForm(true);setIsObjectNew(true)}}>
            <Paper 
              elevation={3}
              style={{
                position: 'relative', 
                backgroundColor: '#1c2127', 
                width: '100%', // Add this line to set the width to 100%
                height: 200,
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
                          Start in <Timer targetDate={e.contestStartDate} text="Contest Started" />
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
              {/* <MDBox style={{
                backgroundImage: `url(${ContestIcon})`,
                backgroundPosition: 'bottom right',
                backgroundSize: '30px 30px',
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '30px',
                height: '30px',
                margin: '8px',
              }}>
              </MDBox> */}
            </Paper>
          </button>
      </Grid>
      
      ))}
      </>
      :
      <>
      <JoinContest id={objectId} setContestDetailsForm={setContestDetailsForm}/>
      </>
      }
      </>
)}



export default ContestCard;