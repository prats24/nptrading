import React, {useState, useContext, useEffect} from "react"
import { userContext } from "../../../AuthContext";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { CircularProgress, Typography } from "@mui/material";
import { FaUsers } from 'react-icons/fa';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { IoLogoWhatsapp } from 'react-icons/io';



// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import ReferralDataThisMonth from "../referralDataThisMonth";
import MDTypography from "../../../components/MDTypography";
// import Roles from "../Roles";
// import SignedUpUsers from "../SignedUpUsers"



function ReferralHeader({ children }) {
  const getDetails = useContext(userContext);
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [thisMonthsReferral,setThisMonthsReferral] = useState();

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

  async function Loading(){
    setIsLoading(true)
    setTimeout(()=>{setIsLoading(false)},500)
  }

  return (
   
    <MDBox position="relative" mb={5}>
      <MDBox 
      style={{
        margin:4,
        borderRadius:8,
        fontFamily: "Proxima Nova",
        display:"flex",
        flexDirection:"column"
        }}
      >
        <MDTypography variant="text" fontSize="18px">Welcome to Tredos referral program!</MDTypography>
        <MDTypography variant="text" fontSize="18px">Here's what's happening with your referral program.</MDTypography>
      </MDBox>
      <MDBox>
        <Grid container >
            <Grid items xs={12} md={6} lg={3}>
                <MDBox 
                    style={{
                        backgroundColor:"white",
                        margin:4,height:100,
                        borderRadius:8,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        fontFamily: "Proxima Nova",
                        display:"flex",
                        justifyContent:"center"
                        }}
                    >
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                          <QrCode2Icon color="success" fontSize="large" style={{width:"80%", height:"80%"}}/>
                    </MDBox>
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                            <MDTypography fontSize="13px" lineHeight={1}>My Referral Code</MDTypography>
                            <MDTypography 
                                style={{borderRadius:8,backgroundColor:"lightgrey",padding:6,margin:6}} 
                                fontSize="17px" 
                                lineHeight={1}
                            >
                                {getDetails?.userDetails?.myReferralCode}
                            </MDTypography>  
                            <a 
                            href={`https://web.whatsapp.com/send?text=Hey,
                            %0A%0AJoin me at ninepointer - India's First Social Options Trading Investment Platform 🤝
                            %0A%0A👉 Pick the right contract in your portfolio and win real money awards 🤑
                            %0A%0A👉 Join the community of ace traders 👫
                            %0A%0A📲 Visit https://www.ninepointer.in
                            %0A%0AUse my below invitation code 👇 and get INR ₹1,00,000 in your wallet snd start trading
                            %0A%0A*${getDetails.userDetails.myReferralCode}*`}
                            target="_blank">
                            <MDTypography variant="contained" display="flex" justifyContent="center" style={{fontSize:"12px",lineHeight:1}}>
                                Click to Share on &nbsp;<IoLogoWhatsapp color="green" lineHeight={1} />
                            </MDTypography>
                            </a>
                    </MDBox>
                </MDBox>
            </Grid>
            <Grid items xs={12} md={6} lg={3}>
                <MDBox 
                    style={{
                        backgroundColor:"white",
                        margin:4,height:100,
                        borderRadius:8,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        fontFamily: "Proxima Nova",
                        display:"flex",
                        justifyContent:"center"
                        }}
                    >
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                          <FaUsers color="grey" fontSize="large" style={{width:"80%", height:"80%"}}/>
                    </MDBox>
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                            <MDTypography fontSize="30px" lineHeight={1}>{thisMonthsReferral ? thisMonthsReferral : 0}</MDTypography>
                            <MDTypography fontSize="10px" lineHeight={1}>Referrals This Month</MDTypography>  
                    </MDBox>
                </MDBox>
            </Grid>
            <Grid items xs={12} md={6} lg={3}>
                <MDBox 
                    style={{
                        backgroundColor:"white",
                        margin:4,height:100,
                        borderRadius:8,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        fontFamily: "Proxima Nova",
                        display:"flex",
                        justifyContent:"center"
                        }}
                    >
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                          <PeopleAltIcon color="success" fontSize="large" style={{width:"80%", height:"80%"}}/>
                    </MDBox>
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                            <MDTypography fontSize="30px" lineHeight={1}>{thisMonthsReferral ? thisMonthsReferral : 0}</MDTypography>
                            <MDTypography fontSize="10px" lineHeight={1}>Referral Today</MDTypography>  
                    </MDBox>
                </MDBox>
            </Grid>
            <Grid items xs={12} md={6} lg={3}>
                <MDBox 
                    style={{
                        backgroundColor:"white",
                        margin:4,height:100,
                        borderRadius:8,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        fontFamily: "Proxima Nova",
                        display:"flex",
                        justifyContent:"center"
                        }}
                    >
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", width:"40%"}}>
                          <CurrencyRupeeIcon color="info" fontSize="large" style={{width:"80%", height:"80%"}}/>
                    </MDBox>
                    <MDBox style={{display:"flex", alignItems: "center", justifyContent: "center", flexDirection:"column", width:"60%"}}>
                            <MDTypography fontSize="30px" lineHeight={1}>{thisMonthsReferral ? thisMonthsReferral : 0}</MDTypography>
                            <MDTypography fontSize="10px" lineHeight={1}>Earnings in INR</MDTypography>  
                    </MDBox>
                </MDBox>
            </Grid>
        </Grid>
      </MDBox>
      <Card
        sx={{
          position: "relative",
          mt: 2,
          mx: 0,
          py: 2,
          px: 1,
        }}
      >
      
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Referrals(This Month)"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                  }
                  onClick={()=>{Loading()}}
                >
                </Tab>
                <Tab
                  label="Referrals(Last Month)"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                  }
                  onClick={()=>{Loading()}}
                />

                <Tab
                  label="Lifetime Referrals"
                  icon={
                    <PersonIcon fontSize="small" sx={{ mt: -0.25}}/>
                     }
                  onClick={()=>{Loading()}}
                />
             
              </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                {isLoading ? 
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                :
                <>
                <ReferralDataThisMonth thisMonthsReferral={thisMonthsReferral} setThisMonthsReferral={setThisMonthsReferral}/> 
                </>
                }
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {isLoading ? <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                :
                <ReferralDataThisMonth/> }
            </TabPanel>
            {/* <TabPanel value={tabValue} index={1}><SignedUpUsers /> </TabPanel> */}
            {/* <TabPanel value={tabValue} index={2}><Roles/> </TabPanel> */}
            {/* <TabPaneltwo/> */}
          </Grid>
        </Grid>
        </Card>
        {/* {children} */}
     
     </MDBox>
   
    
  );
}

// Setting default props for the Header
ReferralHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
ReferralHeader.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props){
  const{children,value,index}=props;
  return(
    <>
    {
      value === index &&
      <h1>{children}</h1>
    }
     {/* <TableOne/> */}
    </>
   
  )
}

export default ReferralHeader;
