import { useState, useEffect } from "react";
import axios from "axios";


// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import StoreIcon from '@mui/icons-material/Store';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles
import breakpoints from "../../../assets/theme/base/breakpoints";

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
// import CompanyDailyPNLTWise from "../CompanyDailyPNLTWise";
// import MockCompanyPNL from "../MockCompanyPNL"
// import TraderPNL from "../TraderPNLTWise";
// import TraderMatrix from "../TraderMatrix";
import AlgoBoxMain from "../AlgoBoxMain";



function AlgoPositionHeader({ children }) {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [algoBox, setAlgoBox] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/readtradingAlgo`)
    .then((res)=>{
        setAlgoBox(res.data)
        // console.log(res.data);
    }).catch((err)=>{
        return new Error(err);
    })
  }, [])

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

      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="10rem"
        borderRadius="x1"
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
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                {algoBox.map((elem)=>{
                  return (
                    <Tab
                    label= {`Algo - ${elem.algoName}`}
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        <StoreIcon/>
                      </Icon>
                    }
                  />
                  )
                })}


              </Tabs>
            </AppBar>
            {algoBox.map((elem, index)=>{
              return (
                <TabPanel value={tabValue} index={index}><AlgoBoxMain id={elem._id} algoName={elem.algoName}/> </TabPanel>
              )
            })}
            
            {/* <TabPanel value={tabValue} index={1}><MockCompanyPNL /> </TabPanel>
            <TabPanel value={tabValue} index={2}><TraderPNL /> </TabPanel>
            <TabPanel value={tabValue} index={3}><TraderMatrix /> </TabPanel> */}
            {/* <TabPaneltwo/> */}
          </Grid>
        </Grid>
      </Card>
      {/* {children} */}

    </MDBox>


  );
}

// Setting default props for the Header
AlgoPositionHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
AlgoPositionHeader.propTypes = {
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

export default AlgoPositionHeader;
