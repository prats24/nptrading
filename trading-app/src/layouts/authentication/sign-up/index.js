
// react-router-dom components
import { Link } from "react-router-dom";
import React, {useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import OtpInput from 'react-otp-input';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { makeStyles } from '@material-ui/core/styles';

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import MDSnackbar from "../../../components/MDSnackbar";
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/trading.jpg";
import { Typography } from "@mui/material";
import { controllers } from "chart.js";



function Cover() {

  console.log("Inside Sign UP")

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

    if(!formstate.terms_and_conditions)
    {
      return window.alert("Please accept the terms and conditions to proceed")
    }

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
    if(data.status === 201 && data.message){ 
        // window.alert(data.message);
        setShowEmailOTP(true);
        setTimerActive(true);
        setResendTimer(30); 
        openSuccessSB("OTP Sent");  
    }else{
        console.log("openInfoBS Called")
        openInfoSB(data.error,"You have already signed Up")
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
        city:formstate.city,
        state:formstate.state,
        country:formstate.country,
        dob:formstate.dob,
        gender:formstate.gender,
        trading_exp:formstate.trading_exp,
        mobile:formstate.mobile,
        purpose_of_joining:formstate.purpose_of_joining,
        employeed:formstate.employeed,
        email:formstate.email, 
        email_otp:formstate.email_otp,
        trading_account:formstate.trading_account,
        referrerCode:formstate.referrerCode,
        pincode:formstate.pincode
      })
  });


  const data = await res.json();
  console.log(data);
  if(data.status === 422 || data.error || !data){ 
      // window.alert(data.error);
      console.log("Invalid Entry");
  }else{
      setShowConfirmation(false)
      console.log("Going to call Open Success SB")
      openSuccessSB("Account Created");
      // window.alert(data.message);
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
  // console.log(data);
  if(data.status === 422 || data.error || !data){ 
      // window.alert(data.error);
      // console.log("Invalid Entry");
  }else{
        openSuccessSB("OTP Sent");
  }

  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [time,setTime] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value) => {
    console.log("Value: ",value)
    if(value === "OTP Sent"){
        setTitle("OTP Sent");
        setContent("Please check your email");
    };
    if(value === "Account Created"){
      setTitle("Account Created");
      setContent("Please check your email for login details");
  };
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  console.log("Title, Content, Time: ",title,content,time)


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
                
                <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="First Name"
                        fullWidth
                        onChange={(e)=>{formstate.first_name = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Last Name"
                        fullWidth
                        onChange={(e)=>{formstate.last_name = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Email"
                        fullWidth
                        onChange={(e)=>{formstate.email = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Mobile No."
                        fullWidth
                        onChange={(e)=>{formstate.mobile = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} mt={-1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Date of Birth"
                            disabled={showEmailOTP}
                            fullWidth
                            value={dayjs(formstate.dob)}
                            onChange={(e) => {setformstate(prevState => ({
                              ...prevState,
                              dob: dayjs(e)
                            }))}}
                            sx={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={formstate.gender}
                        onChange={(e) => {setformstate(prevState => ({
                          ...prevState,
                          gender: e.target.value
                        }))}}
                        label="Gender"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Prior Options Trading Experience</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={formstate.trading_exp}
                        onChange={(e) => {setformstate(prevState => ({
                          ...prevState,
                          trading_exp: e.target.value
                        }))}}
                        label="Prior Options Trading Experience"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="City"
                        fullWidth
                        onChange={(e)=>{formstate.city = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Pin Code"
                        fullWidth
                        onChange={(e)=>{formstate.pincode = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="State"
                        fullWidth
                        onChange={(e)=>{formstate.state = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Country"
                        fullWidth
                        onChange={(e)=>{formstate.country = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Purpose of Joining</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={formstate.purpose_of_joining}
                        onChange={(e) => {setformstate(prevState => ({
                          ...prevState,
                          purpose_of_joining: e.target.value
                        }))}}
                        label="Purpose of Joining"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="Learn Options Trading">Learn Options Trading</MenuItem>
                        <MenuItem value="Earn Money">Earn Money</MenuItem>
                        <MenuItem value="Just for Fun">Just for Fun</MenuItem>
                        <MenuItem value="Don't have anything else to do">Don't have anything else to do</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Trading App you are using currently</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={formstate.trading_account}
                        onChange={(e) => {setformstate(prevState => ({
                          ...prevState,
                          trading_account: e.target.value
                        }))}}
                        label="Purpose of Joining"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="Zerodha">Zerodha</MenuItem>
                        <MenuItem value="PayTM Money">PayTM Money</MenuItem>
                        <MenuItem value="Groww">Groww</MenuItem>
                        <MenuItem value="Upstox">Upstox</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Don't have any">Don't have any</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <TextField
                        required
                        disabled={showEmailOTP}
                        id="outlined-required"
                        label="Referrer Code"
                        fullWidth
                        onChange={(e)=>{formstate.referrerCode = e.target.value}}
                      />
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Are you currenlty employeed?</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={formstate.employeed}
                        onChange={(e) => {setformstate(prevState => ({
                          ...prevState,
                          employeed: e.target.value
                        }))}}
                        label="Are you currenlty employeed?"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6} xl={3}>
                  <MDBox display="flex" alignItems="center">
                      <Checkbox 
                          checked={formstate.terms_and_conditions}
                          disabled={showEmailOTP}
                          onChange={(e)=>{setformstate(prevState => ({...prevState, terms_and_conditions: e.target.checked}))}}
                      />
                        <MDTypography
                          variant="button"
                          fontWeight="regular"
                          color="text"
                          sx={{ cursor: "pointer", userSelect: "none", fontSize:10 }}
                        >
                          I agree the&nbsp;
                        </MDTypography>
                        <MDTypography
                          component="a"
                          href="#"
                          variant="button"
                          fontWeight="bold"
                          color="info"
                          textGradient
                          style={{fontSize:10}}
                        >
                          Terms and Conditions*
                        </MDTypography>
                  </MDBox>
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
            <MDBox display="flex" justifyContent="space-between" ml={2} mt={2}>
            
            <Grid container spacing={2} mt={0.25}>
                
                <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="space-between">
                  <OtpInput
                    value={formstate.email_otp}
                    onChange={(e)=>{setformstate(prevState => ({...prevState, email_otp: e}))}}
                    // onChange={(e)=>{console.log(e)}}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{width:35, height:35}}
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
