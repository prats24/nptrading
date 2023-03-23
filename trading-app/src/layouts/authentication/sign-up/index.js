
// react-router-dom components
import { Link } from "react-router-dom";
import React, {useState, useContext} from "react"
import { useNavigate } from "react-router-dom";

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


function Cover() {
  console.log("Inside Sign UP")

  const navigate = useNavigate();

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
    country:"India",
    last_occupation :"",
    employeed:false,
    address:"",
    applying_for:"",
    family_yearly_income:"",
    watsApp_number:"",
    purpose_of_joining:"",
    terms_and_conditions:false,
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    if(!formstate.terms_and_conditions)
    {
      return window.alert("Please accept the terms and conditions to proceed")
    }

    const { first_name, last_name, applying_for, email, mobile, watsApp_number, degree, dob, gender, trading_exp, family_yearly_income, city, state, country,address, last_occupation,purpose_of_joining, employeed, terms_and_conditions} = formstate;

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
        })
    });


    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        // window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("Sign up request submitted.");
        // console.log("entry succesfull");
        navigate("/response");
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
          <MDBox display="flex" flexWrap="wrap" justifyContent="space-around">

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="First Name" variant="standard" fullWidth onChange={(e)=>{formstate.first_name = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="Last Name" variant="standard" fullWidth onChange={(e)=>{formstate.last_name = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="email" label="Email" variant="standard" fullWidth onChange={(e)=>{formstate.email = e.target.value}} />
            </MDBox>  

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="Mobile No." variant="standard" fullWidth onChange={(e)=>{formstate.mobile = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="WhatsApp Number" variant="standard" fullWidth onChange={(e)=>{formstate.watsApp_number = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="date" label="Date of Birth" variant="standard" fullWidth onChange={(e)=>{formstate.dob = e.target.value}} />
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.gender = e.target.value}}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Female">Other</MenuItem>
              </Select>
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="number" label="Trading Experience(in months)" variant="standard" fullWidth onChange={(e)=>{formstate.trading_exp = e.target.value}} />
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Applying for</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.applying_for = e.target.value}}
              >
                <MenuItem value="Equity Trader">Equity Trader</MenuItem>
                {/* <MenuItem value="Female">Female</MenuItem> */}
              </Select>
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="Last Occupation" variant="standard" fullWidth onChange={(e)=>{formstate.last_occupation = e.target.value}} />
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Degree</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                onChange={(e)=>{formstate.degree = e.target.value}}
              >
                <MenuItem value="BTech">B.Tech</MenuItem>
                <MenuItem value="BSc.">BE</MenuItem>
                <MenuItem value="BSc.">Msc.</MenuItem>
                <MenuItem value="BSc.">Bsc.</MenuItem>
                <MenuItem value="BSc.">BA</MenuItem>
                <MenuItem value="BSc.">MA</MenuItem>
                <MenuItem value="BSc.">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Family Yearly Income(in INR)</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.family_yearly_income = e.target.value}}
              >
                <MenuItem value="Less than 1 Lakh">Less than 1 Lakh</MenuItem>
                <MenuItem value="1 Lakh to 3 Lakhs">1 Lakh to 3 Lakhs</MenuItem>
                <MenuItem value="3 Lakhs to 5 Lkahs">3 Lakhs to 5 Lkahs</MenuItem>
                <MenuItem value="5 Lkahs to 7 Lakhs">5 Lkahs to 7 Lakhs</MenuItem>
                <MenuItem value="More than 7 Lakhs">More than 7 Lakhs</MenuItem>
              </Select>
            </FormControl>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="Full Address" variant="standard" fullWidth onChange={(e)=>{formstate.address = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="City/Village" variant="standard" fullWidth onChange={(e)=>{formstate.city = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="State" variant="standard" fullWidth onChange={(e)=>{formstate.state = e.target.value}} />
            </MDBox>

            <MDBox mb={2} sx={{width:"30%" }}>
              <MDInput type="text" label="Country" variant="standard" fullWidth onChange={(e)=>{formstate.country = e.target.value}} />
            </MDBox>

            <FormControl variant="standard" mb={2} sx={{width:"30%" }}>
              <InputLabel id="demo-simple-select-standard-label">Purpose of Joining</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                // sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.purpose_of_joining = e.target.value}}
              >
                <MenuItem value="Learn Stock Trading">Learn Stock Trading</MenuItem>
                <MenuItem value="Earn Money">Earn Money</MenuItem>
                <MenuItem value="Just for Fun">Just for Fun</MenuItem>
                <MenuItem value="Don't have anythign else to do">Don't have anythign else to do</MenuItem>
              </Select>
            </FormControl>

            <MDBox display="flex" alignItems="center" ml={1} sx={{width:"30%" }}>
              <Checkbox 
              checked={formstate.employeed}
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
              >
                Currently Employeed?
              </MDTypography>
            </MDBox>         
              
            </MDBox> 

            
            <MDBox display="flex" alignItems="center" ml={1}>
            <Checkbox 
                checked={formstate.terms_and_conditions}
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
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={formSubmit}>
                Submit
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
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
      </Card>
    </CoverLayout>
  );
}

export default Cover;
