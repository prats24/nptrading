import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import { GiPodiumWinner } from 'react-icons/gi';

import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import UpcomingContests from "../UpcomingContests";
import ContestRules from "../ContestRules";
// import InstrumentInactiveTable from "../InstrumentInactiveTable";
// import StockIndexTable from "../stockIndexTable"


function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

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
   
    <MDBox position="relative" mb={5}>

      {/* <MDBox
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
      /> */}
      <Card
        sx={{
          position: "relative",
          mt: 0,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
      
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              {/* <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}> */}
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Upcoming Contests"
                  icon={
                    <GiPodiumWinner fontSize="small" sx={{ mt: -0.25 }}/>
                  }
                />
                <Tab
                  label="Contest Rules"
                  icon={
                    <CandlestickChartIcon fontSize="small" sx={{ mt: -0.25 }}/>
                  }
                />
                 <Tab
                  label="Expired Contests"
                  icon={
                    <CandlestickChartIcon fontSize="small" sx={{ mt: -0.25 }}/>
                  }
                />
                
                
              </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}><UpcomingContests/> </TabPanel>
            <TabPanel value={tabValue} index={1}><ContestRules/> </TabPanel>
            {/* <TabPanel value={tabValue} index={2}><StockIndexTable/> </TabPanel> */}
            {/* <TabPaneltwo/> */}
          </Grid>
        </Grid>
        </Card>
        {/* {children} */}
     
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

export default Header;
