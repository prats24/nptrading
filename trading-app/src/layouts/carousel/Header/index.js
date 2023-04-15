import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
// import ContestPortfolioCard from '../data/contestPortfolioCard'
// import TradingPortfolioCard from '../data/tradingPortfolioCard'
// import InactivePortfolioCard from '../data/inactivePortfolioCard'

//data
// import UpcomingContest from '../data/UserContestCard'

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
    <Box mb={1} display="flex" justifyContent="right">
    <MDButton 
    variant="contained" 
    color="success" 
    fontSize="small"
    component={Link}
    to='/Carousel Details'
    >
        Create Craousel
    </MDButton>
    </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Live Carousels" value="1" />
            <Tab label="Draft Carousels" value="2" />
            <Tab label="Rejected/Inactive Carousels" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
        //   <ContestPortfolioCard/>
        <></>
          }
          </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
        //   <TradingPortfolioCard/>
        <></>
          }
        </TabPanel>
        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
        //   <InactivePortfolioCard/>
        <></>
          }
        </TabPanel>
      </TabContext>
    </Box>
  );
}