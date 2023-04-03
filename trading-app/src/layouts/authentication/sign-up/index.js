
// react-router-dom components
import { Link } from "react-router-dom";
import React, {useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import OtpInput from 'react-otp-input';
import dayjs from 'dayjs';

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDSnackbar from "../../../components/MDSnackbar";
import TextField from '@mui/material/TextField';

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/trading.jpg";



function Cover() {

  // console.log("Inside Sign UP")

  const navigate = useNavigate();
  const [dateValue,setDateValue] = useState(dayjs('01/24/2000'))
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [submitClicked, setSubmitClicked] = useState(false);

  const [formstate, setformstate] = useState({
    first_name:"", 
    last_name:"",
    email:"",
    mobile:"",
    dob:"",
    gender:"",
    trading_exp:"",
    city:"",
    state:"",
    country:"",
    employeed:false,
    purpose_of_joining:"",
    terms_and_conditions:false,
    trading_account:"",
    referrerCode:"",
    pincode:"",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

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


  async function formSubmit() {
    setSubmitClicked(true)
    setformstate(formstate);

    const { 
      first_name, 
      last_name, 
      email, 
      mobile, 
      dob, 
      gender, 
      trading_exp, 
      city, state, 
      country, 
      purpose_of_joining, 
      employeed, 
      terms_and_conditions, 
      trading_account,
      referrerCode,
      pincode,
    } = formstate;

    const res = await fetch(`${baseUrl}api/v1/signup`, {
      
        method: "POST",
        // credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({
          first_name:first_name, 
          last_name:last_name,
          email:email, 
          mobile:mobile, 
          dob:dob, 
          gender:gender, 
          trading_exp:trading_exp, 
          city:city,
          state:state,
          country:country,
          employeed:employeed,
          purpose_of_joining:purpose_of_joining,
          terms_and_conditions:terms_and_conditions,
          trading_account:trading_account,
          referrerCode:referrerCode,
          pincode:pincode,
        })
    });
 

    const data = await res.json();
    if(data.status === 201 || data.status === 200){ 
        // window.alert(data.message);
        setShowEmailOTP(true);
        setTimerActive(true);
        setResendTimer(30); 
        return openSuccessSB("OTP Sent",data.message);  
    }else{
        // console.log("openInfoBS Called")
        return openInfoSB(data.message,"You have already signed Up")
    }
}

  async function otpConfirmation() {
    // console.log(formstate.email_otp)
    const res = await fetch(`${baseUrl}api/v1/verifyotp`, {
      
      method: "PATCH",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        first_name:formstate.first_name,
        last_name:formstate.last_name,
        mobile:formstate.mobile,
        email:formstate.email, 
        email_otp:formstate.email_otp,
        referrerCode:formstate.referrerCode,
      })
  });


  const data = await res.json();
  console.log(data.status);
  if(data.status === "Success"){ 
    setShowConfirmation(false)
    console.log("Going to call Open Success SB")
    return openSuccessSB("Account Created",data.message);
  }else{
      console.log("Going to call Open Info SB")
      return openInfoSB("Already a User",data.message);
  }

  }

  const resendOTP = async () => {
  
      setTimerActive(true);
      // console.log("Active timer set to true")
      setResendTimer(30);
    
    const res = await fetch(`${baseUrl}api/v1/resendotp`, {
      
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
  console.log(data.status);
  if(data.status === 200 || data.status === 201){ 
        openSuccessSB("OTP Sent",data.message);
  }else{
        openInfoSB("Something went wrong",data.mesaage);
  }

  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [time,setTime] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    // console.log("Value: ",value)
    if(value === "OTP Sent"){
        setTitle("OTP Sent");
        setContent(content);
    };
    if(value === "Account Created"){
      setTitle("Account Created");
      setContent(content);
  };
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  // console.log("Title, Content, Time: ",title,content,time)


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );


  const [infoSB, setInfoSB] = useState(false);
  const openInfoSB = (title,content) => {
    setTitle(title)
    setContent(content)
    setInfoSB(true);
  }
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title={title}
      content={content}
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );


  return (

    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today to learn and earn from Stock Market
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to get started
          </MDTypography>
        </MDBox>
        
        <MDBox pt={4} pb={3} px={3}>
        
          <MDBox component="form" role="form">
          { showConfirmation && (
          <>
          <Grid container spacing={2} mt={0.5} mb={2}>
                
                <Grid item xs={12} md={12} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="First Name"
                        fullWidth
                        onChange={(e)=>{formstate.first_name = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={12} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Last Name"
                        fullWidth
                        onChange={(e)=>{formstate.last_name = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={12} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Email"
                        type="email"
                        fullWidth
                        onChange={(e)=>{formstate.email = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={12} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Mobile No."
                        fullWidth
                        onChange={(e)=>{formstate.mobile = e.target.value}}
                      />
                  </Grid>

            </Grid>
            </>
            )}            

            {!showEmailOTP && (
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={formSubmit} >
                Submit
              </MDButton>
            </MDBox>)}

            
            {showEmailOTP && showConfirmation && (
            <>
            <MDBox mt={2}>
              <MDTypography fontSize={15}>This is an invite only trading platfrom, so please enter referrer code and email OTP to continue.</MDTypography>
            </MDBox>
            <MDBox display="flex" justifyContent="space-between">
            
            <Grid container spacing={2} mt={0.25}>
                
                  <Grid item xs={12} md={12} xl={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Referrer Code"
                        fullWidth
                        onChange={(e)=>{formstate.referrerCode = e.target.value}}
                      />
                  </Grid>
                
                <Grid item xs={12} md={12} xl={3} width="100%" display="flex" justifyContent="center">
                  <OtpInput
                    value={formstate.email_otp}
                    onChange={(e)=>{setformstate(prevState => ({...prevState, email_otp: e}))}}
                    // onChange={(e)=>{console.log(e)}}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{width:42, height:42}}
                  />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="flex-start">
                  <MDButton disabled={timerActive} variant="text" color="info" fullWidth onClick={resendOTP}>
                    {timerActive ? `Resend OTP in ${resendTimer} seconds` : 'Resend OTP'}
                    </MDButton>
                  </Grid>



            </Grid>

            </MDBox>

            <MDBox mt={4} mb={1} display="flex" justifyContent="space-around">
              <MDButton variant="gradient" color="info" fullWidth onClick={otpConfirmation}>
                Confirm
              </MDButton>
            </MDBox>
            </>
            )}
            
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        

        {!showConfirmation && (
          <>
        <MDTypography variant="h4" fontWeight="medium" textAlign="center" color="secondary" mt={5}>
            Your details has been submitted. We will contact you shortly.
        </MDTypography>
        <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{textAlign:"center", margin:10}}
                >
                  Back to Home Page
                </MDTypography>
                </>
        )}
        {renderSuccessSB}
        {renderInfoSB}
      </Card>
    </CoverLayout>
  );
}

export default Cover;
