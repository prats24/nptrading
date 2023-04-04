import React, {useState, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Paper from '@mui/material/Paper';
import MDTypography from "../../components/MDTypography";
import ContestIcon from "../../assets/images/contest.png";
import CreateContest from './CreateContest'
import StockIcon from '../../assets/images/contest.gif'
import MDAvatar from "../../components/MDAvatar";
import { HiUserGroup } from 'react-icons/hi';
import Timer from './timer'
import TableContainer from '@mui/material/TableContainer';



const ContestCard = ({createContestForm,setCreateContestForm,isObjectNew,setIsObjectNew}) => {
  const [contestData,setContestData] = useState([]);
  const [contestDetailsForm,setContestDetailsForm] = useState(false)
  const [objectId,setObjectId] = useState('')
  let styleTD = {
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "900",
    color: "#7b809a",
    opacity: 0.7,
    // padding: "50px"
  }
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/referrals`)
      .then((res)=>{
                setContestData(res.data.data);
                console.log(res.data.data)
        }).catch((err)=>{
          return new Error(err);
      })
    },[createContestForm])

      // console.log("Contest Data: ",contestData)

      function dateConvert(dateConvert){
      //   const dateString = dateConvert;
      //   const date = new Date(dateString);
      //   const options = { 
      //     year: 'numeric', 
      //     month: 'long', 
      //     day: 'numeric', 
      //     hour: 'numeric', 
      //     minute: 'numeric' 
      //   };
        
      //   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        
      //   // get day of month and add ordinal suffix
      //   const dayOfMonth = date.getDate();
      //   let suffix = "th";
      //   if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      //     suffix = "st";
      //   } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      //     suffix = "nd";
      //   } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      //     suffix = "rd";
      //   }
        
      //   // combine date and time string with suffix
      //   const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
        
      //   console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"
        
     

      // return finalFormattedDate
    }
      
    

    return (
      <>
        {     
        !contestDetailsForm ?
        <>

        <TableContainer component={Paper}>
          <table style={{ borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                {/* <td style={{...styleTD, paddingLeft: "20px"}} >PRODUCT</td> */}
                <td style={styleTD} >Id</td>
                <td style={styleTD}>Name</td>
                <td style={styleTD} >Reward/referral</td>
                <td style={styleTD} >Status</td>
                {/* <td style={styleTD} >GROSS P&L</td>
                <td style={styleTD} >CHANGE(%)</td>
                <td style={styleTD} >EXIT</td>
                <td style={styleTD} >BUY</td>
                <td style={{...styleTD, paddingRight: "20px"}} >SELL</td> */}
                
              </tr>
            </thead>
            <tbody>

              {contestData?.map((elem)=>{
                return(
                  <>
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}}  key={elem.referrralProgramId}
              onClick={()=>{setIsObjectNew(elem._id); setCreateContestForm(true)}}
              >

                  <td style={{...styleTD, textAlign: "center"}} >{elem.referrralProgramId}</td>
                  <td style={{...styleTD, textAlign: "center"}} >{elem.referrralProgramName}</td>
                  <td style={{...styleTD, textAlign: "center"}} >{elem.rewardPerReferral}</td>
                  <td style={{...styleTD, textAlign: "center"}} >{elem.status}</td>


                  {/* <Tooltip title="Exit Your Position" placement="top">
                  </Tooltip>
                  <Tooltip title="Buy" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem?.buy}</td>
                  </Tooltip>
                  <Tooltip title="Sell" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3, paddingRight: "20px"}} >{elem?.sell}</td>
                  </Tooltip> */}
      
              </tr>
              </>

                )
              })} 
              {/* <tr
              style={{borderBottom: "1px solid #D3D3D3", padding: "10x"}}
              >
                  <td  ></td>
                  <td  ></td>
                  <td style={{ padding: "8px 10px"}} ><div style={styleBottomRow}>Running Lots : {totalRunningLots}</div></td>
                  <td  ></td>
                  <td style={{ padding: "8px 10px"}}><div style={styleBottomRow} >Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}</div></td>
                  <td style={{ padding: "8px 10px"}} ><div style={{...styleBottomRow, color: `${totalGrossPnl > 0 ? 'green' : 'red'}`}}>Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</div></td>
                  <td style={{ padding: "8px 10px"}} ><div style={{...styleBottomRow, color: `${(totalGrossPnl-totalTransactionCost) > 0 ? 'green' : 'red'}`}}>Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</div></td>
                  <td  ></td>
                  <td  ></td>
                  <td  ></td>
                  <td  ></td>
              </tr> */}
            </tbody>
          </table>
        </TableContainer>
        {/* {contestData?.map((e)=>(
        
        <Grid item xs={12} md={6} lg={4}>
          <button style={{border: 'none',width:"100%", cursor:"pointer"}} onClick={()=>{setObjectId(e._id);setContestDetailsForm(true);setIsObjectNew(true)}}>
              <Paper 
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

              </Paper>
            </button>
        </Grid>
        
        ))} */}
        </>
        :
        <>
        {console.log("objectId", objectId)}
        {/* <CreateContest oldObjectId={objectId} setOldObjectId={setObjectId} setCreateContestForm={setCreateContestForm}/> */}
        </>
        }
      </>
)}



export default ContestCard;