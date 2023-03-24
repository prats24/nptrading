
// react-router-dom components
import { Link } from "react-router-dom";
import React, {useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import OtpInput from 'react-otp-input';
import { makeStyles } from '@material-ui/core/styles';

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
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




function Cover() {

  console.log("Inside Sign UP")

  const navigate = useNavigate();
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [submitClicked, setSubmitClicked] = useState(false);

  // console.log(resendTimer,timerActive)

  const [formstate, setformstate] = useState({
    first_name:"", 
    last_name:"",
    email:"",
    mobile:"",
    degree:"",
    dob:"",
    gender:"",
    trading_exp:"",
    city:"",
    state:"",
    country:"",
    last_occupation :"",
    employeed:false,
    address:"",
    applying_for:"",
    family_yearly_income:"",
    watsApp_number:"",
    purpose_of_joining:"",
    terms_and_conditions:false,
    trading_account:"",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    let countdownTimer = null;
      console.log("useeffect called")
      console.log(timerActive,resendTimer)
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
    console.log(formstate)

    if(!formstate.terms_and_conditions)
    {
      return window.alert("Please accept the terms and conditions to proceed")
    }

    const { first_name, last_name, applying_for, email, mobile, watsApp_number, degree, dob, gender, trading_exp, family_yearly_income, city, state, country,address, last_occupation,purpose_of_joining, employeed, terms_and_conditions, trading_account} = formstate;

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
          degree:degree, 
          dob:dob, 
          gender:gender, 
          trading_exp:trading_exp, 
          city:city,
          last_occupation:last_occupation,
          applying_for:applying_for,
          state:state,
          address:address,
          country:country,
          employeed:employeed,
          watsApp_number:watsApp_number,
          family_yearly_income:family_yearly_income,
          purpose_of_joining:purpose_of_joining,
          terms_and_conditions:terms_and_conditions,
          trading_account:trading_account,
        })
    });


    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.message || !data){ 
        window.alert(data.message);
        console.log("Invalid Entry");
    }else{
      setShowEmailOTP(true);
      setTimerActive(true);
      setResendTimer(30);
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
        watsApp_number:formstate.watsApp_number,
        city:formstate.city,
        state:formstate.state,
        country:formstate.country,
        dob:formstate.dob,
        applying_for:formstate.applying_for,
        degree:formstate.degree,
        gender:formstate.gender,
        trading_exp:formstate.trading_exp,
        last_occupation:formstate.last_occupation,
        mobile:formstate.mobile,
        purpose_of_joining:formstate.purpose_of_joining,
        employeed:formstate.employeed,
        email:formstate.email, 
        email_otp:formstate.email_otp,
        trading_account:formstate.trading_account,
        address:formstate.address,
      })
  });


  const data = await res.json();
  console.log(data);
  if(data.status === 422 || data.error || !data){ 
      // window.alert(data.error);
      console.log("Invalid Entry");
  }else{
    setShowConfirmation(false)
      window.alert(data.message);
      // console.log("entry succesfull");
      // navigate("/response");
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
    // setShowEmailOTP(true)
      
      // window.alert("OTP Resent");

      // console.log("entry succesfull");
      // navigate("/response");
  }

  }


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
          <MDBox display="flex" flexWrap="wrap" justifyContent="space-around">
          
          
            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="First Name*" variant="standard" fullWidth onChange={(e)=>{formstate.first_name = e.target.value}} />
              {(submitClicked && !formstate.first_name) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="Last Name*" variant="standard" fullWidth onChange={(e)=>{formstate.last_name = e.target.value}} />
              {(submitClicked && !formstate.last_name) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="email" label="Email*" variant="standard" fullWidth onChange={(e)=>{formstate.email = e.target.value}} />
              {(submitClicked && !formstate.email) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>  

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="Mobile No.*" variant="standard" fullWidth onChange={(e)=>{formstate.mobile = e.target.value}} />
              {(submitClicked && !formstate.mobile) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="WhatsApp Number*" variant="standard" fullWidth onChange={(e)=>{formstate.watsApp_number = e.target.value}} />
              {(submitClicked && !formstate.watsApp_number) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput
              disabled={showEmailOTP} type="date" label="Date of Birth*" variant="standard" fullWidth onChange={(e)=>{formstate.dob = e.target.value}} />
              {(submitClicked && !formstate.dob) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Gender*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                disabled={showEmailOTP}
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.gender = e.target.value}}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Female">Other</MenuItem>
              </Select>
              {(submitClicked && !formstate.gender) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="number" label="Trading Experience(in months)*" variant="standard" fullWidth onChange={(e)=>{formstate.trading_exp = e.target.value}} />
              {(submitClicked && !formstate.trading_exp) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Applying for*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                disabled={showEmailOTP}
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.applying_for = e.target.value}}
              >
                <MenuItem value="Equity Trader">Equity Trader</MenuItem>
                {/* <MenuItem value="Female">Female</MenuItem> */}
              </Select>
              {(submitClicked && !formstate.applying_for) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="Last Occupation*" variant="standard" fullWidth onChange={(e)=>{formstate.last_occupation = e.target.value}} />
              {(submitClicked && !formstate.last_occupation) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Degree*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                disabled={showEmailOTP}
                onChange={(e)=>{formstate.degree = e.target.value}}
              >
                <MenuItem value="BTech">B.Tech</MenuItem>
                <MenuItem value="BE">BE</MenuItem>
                <MenuItem value="MSc.">Msc.</MenuItem>
                <MenuItem value="BSc.">Bsc.</MenuItem>
                <MenuItem value="BA">BA</MenuItem>
                <MenuItem value="MA">MA</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {(submitClicked && !formstate.degree) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Family Yearly Income(in INR)*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                disabled={showEmailOTP}
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.family_yearly_income = e.target.value}}
              >
                <MenuItem value="Less than 1 Lakh">Less than 1 Lakh</MenuItem>
                <MenuItem value="1 Lakh to 3 Lakhs">1 Lakh to 3 Lakhs</MenuItem>
                <MenuItem value="3 Lakhs to 5 Lkahs">3 Lakhs to 5 Lkahs</MenuItem>
                <MenuItem value="5 Lkahs to 7 Lakhs">5 Lkahs to 7 Lakhs</MenuItem>
                <MenuItem value="More than 7 Lakhs">More than 7 Lakhs</MenuItem>
              </Select>
              {(submitClicked && !formstate.family_yearly_income) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="Full Address*" variant="standard" fullWidth onChange={(e)=>{formstate.address = e.target.value}} />
              {(submitClicked && !formstate.address) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="City/Village*" variant="standard" fullWidth onChange={(e)=>{formstate.city = e.target.value}} />
              {(submitClicked && !formstate.city) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="State*" variant="standard" fullWidth onChange={(e)=>{formstate.state = e.target.value}} />
              {(submitClicked && !formstate.state) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput disabled={showEmailOTP} type="text" label="Country*" variant="standard" fullWidth onChange={(e)=>{formstate.country = e.target.value}} />
              {(submitClicked && !formstate.country) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Purpose of Joining*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                disabled={showEmailOTP}
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.purpose_of_joining = e.target.value}}
              >
                <MenuItem value="Learn Stock Trading">Learn Stock Trading</MenuItem>
                <MenuItem value="Earn Money">Earn Money</MenuItem>
                <MenuItem value="Just for Fun">Just for Fun</MenuItem>
                <MenuItem value="Don't have anythign else to do">Don't have anythign else to do</MenuItem>
              </Select>
              {(submitClicked && !formstate.purpose_of_joining) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Please select the trading app which you use currently*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Trading Account"
                disabled={showEmailOTP}
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.trading_account = e.target.value}}
              >
                <MenuItem value="Zerodha">Zerodha</MenuItem>
                <MenuItem value="Upstox">Upstox</MenuItem>
                <MenuItem value="Groww">Groww</MenuItem>
                <MenuItem value="PayTM Money">PayTM Money</MenuItem>
                <MenuItem value="Trading View">Trading View</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="I don't have any trading account">I don't have any trading account</MenuItem>
              </Select>
              {(submitClicked && !formstate.trading_account) && <Typography style={{fontSize:10,color:"red"}}>This is a required field</Typography>}
            </FormControl>        
              
            </MDBox> 

            <MDBox display="flex" alignItems="centre" justifyContent="flex-start" ml={1} sx={{width:"40%", justifyContent: "flex-start" }}>
              <Checkbox 
              checked={formstate.employeed}
              disabled={showEmailOTP}
              onChange={(e)=>{setformstate(prevState => ({...prevState, employeed: e.target.checked}))}}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}
              >
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
                mt={1}
              >
                Currently Employeed?*
              </MDTypography>
              {/* {(submitClicked && !formstate.employeed) && <Typography mt={1.5} style={{fontSize:10,color:"red"}}>This is a required field</Typography>} */}
            </MDBox> 
   
            <MDBox display="flex" alignItems="center" ml={1}>
            <Checkbox 
                checked={formstate.terms_and_conditions}
                disabled={showEmailOTP}
                onChange={(e)=>{setformstate(prevState => ({...prevState, terms_and_conditions: e.target.checked}))}}
            />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -0.5 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions*
              </MDTypography>
            </MDBox>
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
            <MDBox display="flex" ml={2} mt={2}>

            <OtpInput
              value={formstate.email_otp}
              onChange={(e)=>{setformstate(prevState => ({...prevState, email_otp: e}))}}
              // onChange={(e)=>{console.log(e)}}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{width:50, height:50}}
            />
            <MDButton disabled={timerActive} mb={0} sx={{width:"20%"}} variant="text" color="info" fullWidth onClick={resendOTP}>
              {timerActive ? `Resend OTP in ${resendTimer} seconds` : 'Resend OTP'}
              </MDButton>
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
        <MDTypography variant="h4" fontWeight="medium" textAlign="center" color="black" mt={5}>
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
      </Card>
    </CoverLayout>
  );
}

export default Cover;
