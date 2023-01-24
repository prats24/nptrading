import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const setDetails = useContext(userContext);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  console.log("sign componenet")
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const navigate = useNavigate();
    let userData ;

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
          console.log("this is data of particular user", res.data);
  
          if(!res.status === 200){
              throw new Error(res.error);
          }
      } catch(err){
          console.log("Fail to fetch data of user");
          console.log(err);
      }
    }


    async function logInButton(e){
        e.preventDefault();
        console.log(userId, pass);
        
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
        console.log(data);
        if(data.status === 422 || data.error || !data){
            window.alert(data.error);
            console.log("invalid user details");
        }else{
            window.alert("Login succesfull");
            console.log("entry succesfull");

            // this function is extracting data of user who is logged in
            await userDetail();

            if(userData.role === "admin"){
              navigate("/companyposition");
            } else if(userData.role === "user"){
              navigate("/Position");
            }
            
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
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={handleEmailChange} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" onChange={handlePasswordChange} fullWidth />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" onClick={logInButton} fullWidth>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
