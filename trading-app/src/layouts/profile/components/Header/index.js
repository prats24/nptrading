import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../../../../AuthContext";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import { IoLogoWhatsapp } from 'react-icons/io';


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import MDAvatar from "../../../../components/MDAvatar";
import MyProfile from "../PlatformSettings/MyProfile"
import Messages from "../PlatformSettings/Messages"
import Settings from "../PlatformSettings/Settings"

// Material Dashboard 2 React base styles
import breakpoints from "../../../../assets/theme/base/breakpoints";

// Images
import DefaultProfilePic from "../../../../assets/images/default-profile.png";
import backgroundImage from "../../../../assets/images/trading.jpg";


function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [userDetail,setuserDetail] = useState([]);
  const [profilePhoto,setProfilePhoto] = useState(DefaultProfilePic);
  const getDetails = useContext(userContext);
  console.log("getDetails", getDetails)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

 useEffect(()=>{
       axios.get(`${baseUrl}api/v1/readparticularuserdetails/${getDetails.userDetails.email}`)
      .then((res)=>{
          console.log(res.data);
          setuserDetail(res.data)
      }).catch((err)=>{
          //window.alert("Server Down");
          return new Error(err);
      })
  },[getDetails])
  console.log("Logged In user details: "+userDetail);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);



  return (
    <MDBox position="relative" mb={2}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="10rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -15,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item>
            <MDAvatar 
            src={getDetails?.userDetails?.profilePhoto?.url ? getDetails?.userDetails?.profilePhoto?.url : profilePhoto} 
            alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {userDetail.first_name} {userDetail.last_name}
              </MDTypography>
              <MDBox display="flex" flexDirection="row" style={{ alignItems: "center" }}>
                <MDTypography variant="button" color="info" fontWeight="regular">
                  Your Referral Code : {userDetail.myReferralCode}
                </MDTypography>
                <a 
                 href={`https://web.whatsapp.com/send?text=Hey,
                 %0A%0AJoin me at StoxHero - India's First Options Trading Platform 🤝
                 %0A%0A👉 Pick the right contract in your portfolio and win real money awards 🤑
                 %0A%0A👉 Join the community of ace traders 👫
                 %0A%0A📲 Visit https://www.stoxhero.com
                 %0A%0AUse my below invitation code 👇 and get INR ₹10,00,000 in your wallet snd start trading
                 %0A%0A*${userDetail.myReferralCode}*`}
                  target="_blank">
                  <MDButton variant="contained" mt={2} startIcon={<IoLogoWhatsapp color="green" />}>
                    Share on WhatsApp
                  </MDButton>
                </a>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="My Profile"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>

            <TabPanel value={tabValue} index={0}><MyProfile profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto}/> </TabPanel>
            <TabPanel value={tabValue} index={1}><Messages /> </TabPanel>
            <TabPanel value={tabValue} index={2}><Settings /> </TabPanel>
            {/* <TabPanel value={tabValue} index={3}><TraderMatrix /> </TabPanel> */}
            {/* <TabPanel value={tabValue} index={4}><BatchWiseTradersHeatMap /> </TabPanel> */}

          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <>
      {
        value === index &&
        <h1>{children}</h1>
      }
      {/* <TableOne/> */}
    </>

  )
}

export default Header;
