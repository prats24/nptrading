// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import React, {useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import completeIcon from '../../../../assets/images/complete.png'

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";
import MDAlert from "../../../../components/MDAlert";
import OtpInput from 'react-otp-input';

// Authentication layout components
import CoverLayout from "../../../../layouts/authentication/components/CoverLayout";

// Images
import bgImage from "../../../../assets/images/trading.jpg";
import { Typography } from "@mui/material";
import { textAlign } from "@mui/system";

function Cover() {
  
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [onGenerate, setOnGenerate] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [responseMessage, setResponseMessage] = useState({message:null,type:null});
  const [isVisible, setIsVisible] = useState(false);
  const [editable, setEditable] = useState(true);
  const [passwordResetDone, setPasswordResetDone] = useState(false);
  const [formstate, setformstate] = useState({
    email:"",
    password:"",
    confirm_password:"",
    resetPasswordOTP:"",
  });

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(() => {
    let countdownTimer = null;
      // console.log("useeffect called")
      // console.log(timerActive,resendTimer)
      // If the timer is active, decrement the resendTimer every second
      if (timerActive && resendTimer > 0) {
        countdownTimer = setTimeout(() => {
          setResendTimer(prevTime => prevTime - 1);
        }, 1000);
      }

      // If the timer reaches 0, stop the countdown and set the timerActive flag to false
      if (resendTimer === 0) {
        clearTimeout(countdownTimer);
        setTimerActive(false);
      }

      // Cleanup function to clear the timeout when the component unmounts
      return () => {
        clearTimeout(countdownTimer);
      };
    }, [resendTimer, timerActive]);


    const resendOTP = async () => {
      setOnGenerate(true)
      if(!formstate.email){
        return;
      }
      setIsVisible(true);
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      setTimerActive(true);
      // console.log("Active timer set to true")
      setResendTimer(30);
    
    const res = await fetch(`${baseUrl}api/v1/generateOTP`, {
      
      method: "PATCH",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        email:formstate.email, 
      })
      
  });

  const data = await res.json();
  console.log(res.status);
  if(res.status === 200 || res.status === 201){ 
      setResponseMessage({message:data.message,type:'success'});
      setEditable(false);  
  }else{
      setResponseMessage({message:data.message,type:'error'});
      console.log("Invalid Entry");
  }

  }

  const resetPassword = async () => {
    setOnReset(true)
    if((!formstate.confirm_password || !formstate.password) || (formstate.confirm_password != formstate.password))
    {
      return
    }
    setTimerActive(true);
    // console.log("Active timer set to true")
    setResendTimer(30);
  
  const res = await fetch(`${baseUrl}api/v1/resetpassword`, {
    
    method: "PATCH",
    // credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": false
    },
    body: JSON.stringify({
      email:formstate.email, 
      password:formstate.password,
      confirm_password:formstate.confirm_password,
      resetPasswordOTP:formstate.resetPasswordOTP,
    })
});

const data = await res.json();
// console.log(data);
if(res.status === 200 || res.status === 201){ 
    setResponseMessage({message:data.message,type:'success'})  
    setPasswordResetDone(true);
    // console.log("Error:",data.message);
}else{
    setResponseMessage({message:data.message,type:'error'})
    // console.log("entry succesfull");
}

}

async function logInButton(e){
  e.preventDefault();
  navigate("/");
}


  return (
    <CoverLayout coverHeight="30vh" image={bgImage}>
      <Grid container spacing={3} display="flex" justifyContent="space-around">
      <Grid item xs={12} md={6} lg={6} mb={3}>
      <Card 
      // style={{width:"50%", margin: "0 auto"}}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail within 60 seconds
          </MDTypography>
        </MDBox>
        {passwordResetDone ?
        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography style={{fontSize:20, textAlign:"center"}} mt={4} mb={5}><img height="40" width="40" src={completeIcon}/><MDBox>Password Reset Process Completed.</MDBox></Typography> 
        <MDBox mb={4}>
        <MDButton style={{textAlign:"center"}} variant="gradient" color="info" onClick={logInButton}>Login</MDButton> 
        </MDBox>
        </MDBox>
        : 
        <MDBox pt={2} pb={3} px={3} display="flex" justifyContent="space-around">
        <Grid item xs={12} md={6} lg={6} mb={1}>
          <MDBox component="form" role="form">
            {responseMessage && 
            <Typography mb={2} style={{ border: '0.1em solid white', backgroundColor:responseMessage.type === 'success' ? "#5F9954" : "red", color:"white", borderRadius:4 ,textAlign:"center", fontSize:15 }}>{responseMessage.message}</Typography>}
          < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
             
              <MDInput disabled={!editable} type="email" label="Email" variant="standard" fullWidth onChange={(e)=>{formstate.email = e.target.value}}/>
              {onGenerate && !formstate.email && <Typography style={{color:"red",fontSize:15}}>Please enter your email</Typography>}
            </MDBox>
            
            <MDBox mt={1} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={resendOTP}>
                generate otp
              </MDButton>
            </MDBox>

            {!editable &&
            <>
            <MDBox display="flex" flexDirection="column" mt={2} mb={0}>
            
            <OtpInput
              value={formstate.resetPasswordOTP}
              onChange={(e)=>{setformstate(prevState => ({...prevState, resetPasswordOTP: e}))}}
              // onChange={(e)=>{console.log(e)}}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{width:50, height:50}}
            />
            <MDButton disabled={timerActive} mb={2} variant="text" color="info" fullWidth onClick={resendOTP}>
              {timerActive ? `Resend OTP in ${resendTimer} seconds` : 'Resend OTP'}
              </MDButton>
            </MDBox>
            
            
            < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <MDInput type="text" label="New Password*" variant="standard" fullWidth onChange={(e)=>{formstate.password = e.target.value}} />
              {(onReset && (!formstate.password || !formstate.confirm_password) || (formstate.password != formstate.confirm_password)) && <Typography style={{color:"red",fontSize:15}}>Password match failed</Typography>}
            </MDBox>

            < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <MDInput type="text" label="Confirm Password*" variant="standard" fullWidth onChange={(e)=>{formstate.confirm_password = e.target.value}}/>
              {(onReset && (!formstate.password || !formstate.confirm_password) || (formstate.password != formstate.confirm_password)) && <Typography style={{color:"red",fontSize:15}}>Password match failed</Typography>}
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={resetPassword}>
                reset
              </MDButton>
            </MDBox>
            </>
            }
          </MDBox>
          </Grid>
        </MDBox>
  }
      </Card>
      </Grid>
      </Grid>
    </CoverLayout>
  );
}

export default Cover;
