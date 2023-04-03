import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OtpInput from 'react-otp-input';

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";


// Images
 import bgImage from "../../../assets/images/trading.jpg";
import { userContext } from '../../../AuthContext';

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [userId, setEmail] = useState(false);
  const [pass, setPassword] = useState(false);
  let [invalidDetail, setInvalidDetail] = useState();
  const [formType, setFormType] = useState('email');
  const[mobile, setMobile] = useState('');
  const[otpGen, setOtpGen] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [mobileOtp, setMobileOtp]=useState('');

  const setDetails = useContext(userContext);
  console.log(setDetails.userDetails);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const navigate = useNavigate();
    let userData ;

    useEffect(() => {
      let countdownTimer = null;
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
  

    const userDetail = async ()=>{
      try{
          const res = await axios.get(`${baseUrl}api/v1/loginDetail`, {
              withCredentials: true,
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Credentials": true
              },
          });
                   
          setDetails.setUserDetail(res.data);
          userData = res.data;
          //console.log("this is data of particular user", res.data);
  
          if(!res.status === 200){
              throw new Error(res.error);
          }
      } catch(err){
          //console.log("Fail to fetch data of user");
          //console.log(err);
      }
    }

    async function logInButton(e){
        e.preventDefault();
        //console.log(userId, pass);
        
        const res = await fetch(`${baseUrl}api/v1/login`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                userId, pass
            })
        });
        
        const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            setInvalidDetail(`Email or Password is incorrect`);
        }else{

            // this function is extracting data of user who is logged in
            await userDetail();

            if(userData.role === "admin"){
              navigate("/companyposition");
            }
            else if(userData.role === "data"){
              navigate("/analytics");
            } 
            else if(userData.role === "user"){
              navigate("/Position");
            }
            
        }
    }

    async function phoneLogin(e){
      e.preventDefault();
      if(mobile.length<10){
        return setInvalidDetail(`Mobile number incorrect`);
      }
      const res = await fetch(`${baseUrl}api/v1/phonelogin`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            mobile
        })
    });
    const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            setInvalidDetail(`Mobile number incorrect`);
        }else{
            setOtpGen(true);
        }

    }

    async function handleMobileChange(e){
      setMobile(e.target.value);
    }
    async function signUpButton(e){
      e.preventDefault();
      navigate("/signup");
    }

    async function forgotPasswordButton(e){
      e.preventDefault();
      navigate("/resetpassword");
    }

    async function otpConfirmation(e){
      e.preventDefault();
      if(mobile.length<10){
        return setInvalidDetail(`Mobile number incorrect`);
      }
      const res = await fetch(`${baseUrl}api/v1/verifyphonelogin`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            mobile, mobile_otp:mobileOtp
        })
    });
    const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            setInvalidDetail(`OTP incorrect`);
        }else{
          await userDetail();

          if(userData.role === "admin"){
            navigate("/companyposition");
          }
          else if(userData.role === "data"){
            navigate("/analytics");
          } 
          else if(userData.role === "user"){
            navigate("/Position");
          }
        }

    }

    async function resendOTP(type){
      setTimerActive(true);
      // console.log("Active timer set to true")
      setResendTimer(30);
    
    const res = await fetch(`${baseUrl}api/v1/resendmobileotp`, {
      
      method: "POST",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        mobile:mobile,
      })
    })
    const data = await res.json();
    console.log(data.status);
    if(data.status === 200 || data.status === 201){ 
        // openSuccessSB("OTP Sent",data.message);
    }else{
        // openInfoSB("Something went wrong",data.mesaage);
    }
  }





  return ( 
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome to ninepointer!
          </MDTypography>
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
 
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {formType == 'email' ? <><MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={handleEmailChange} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" onChange={handlePasswordChange} fullWidth />
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color={invalidDetail && "error"}>
              {invalidDetail && invalidDetail}

              </MDTypography>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" onClick={logInButton} fullWidth>
                sign in
              </MDButton>
              <MDButton variant="text" color="info" onClick={forgotPasswordButton} fullWidth>
                forgot password?
              </MDButton>
            </MDBox></>:
            <>
          <MDBox mb={2}>
            <MDInput type="text" label="Mobile Number" onChange={handleMobileChange} fullWidth />
          </MDBox>
          {!otpGen&&<MDButton variant="gradient" color="info" onClick={phoneLogin} fullWidth>
          Send OTP
        </MDButton>}
        {otpGen && <><Grid item xs={12} md={12} xl={12} width="100%" display="flex" justifyContent="center">
                  <MDBox mt={1}>
                  <OtpInput
                    value={mobileOtp}
                    onChange={(e)=>{setMobileOtp(e)}}
                    // onChange={(e)=>{console.log(e)}}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{width:40, height:50}}
                  />
                  </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} xl={12} mt={1} display="flex" justifyContent="flex-start">
                  <MDButton style={{padding:'0rem', margin:'0rem', minHeight:20, width: '40%', display: 'flex', justifyContent: 'center', margin: 'auto'}} disabled={timerActive} variant="text" color="info" fullWidth onClick={()=>{resendOTP('mobile')}}>
                    {timerActive ? `Resend Mobile OTP in ${resendTimer} seconds` : 'Resend Mobile OTP'}
                    </MDButton>
                  </Grid>
                  <MDBox mt={2.5} mb={1} display="flex" justifyContent="space-around">
                    <MDButton variant="gradient" color="info" fullWidth onClick={otpConfirmation}>
                      Confirm
                    </MDButton>
                  </MDBox>
                  </>}
          </> 
            }
            {formType == 'email' && <MDBox mt={-1}>
              <MDTypography style={{
                width:'fit-content', margin: 'auto', color:'#1A73E8', fontSize:14, cursor:'pointer', fontWeight:700
                }} onClick={()=>{setFormType('mobile')}}>Login with OTP</MDTypography>
            </MDBox>}
            {formType == 'mobile' && <MDBox mt={0}>
              <MDTypography style={{
                width:'fit-content', margin: 'auto', color:'#1A73E8', fontSize:14, cursor:'pointer', fontWeight:700
                }} onClick={()=>{setFormType('email')}}>Login with Email</MDTypography>
            </MDBox>}
            <MDBox mt={2} mb={1}>
              <MDTypography variant="h6" fontWeight="medium" color="black" mt={1} mb={1} textAlign="center">
                Learn and earn from stock market trading. Claim your free account now!
              </MDTypography>
              <MDButton variant="gradient" color="error" onClick={signUpButton} fullWidth>
                sign up
              </MDButton>
            </MDBox>

          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
