// Material Dashboard 2 React layouts
import Funds from "./layouts/funds";
import Profile from "./layouts/profile";

// @mui icons

import DashboardIcon from '@mui/icons-material/Dashboard';
import StadiumIcon from '@mui/icons-material/Stadium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ReorderIcon from '@mui/icons-material/Reorder';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonPinIcon from '@mui/icons-material/PersonPin';

//page routes
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/User Position";
import UserReport from "./layouts/userreports";
import MyReferrals from "./layouts/referrals"
import UserContest from "./layouts/UserContest"
import ContestPage from './layouts/UserContest/contestPage'
import ContestRegisterPage from './layouts/UserContest/contestRegistrationPage'
import ContestTradePage from './layouts/UserContest/ContestTrade'
import Dashboard from './layouts/traderHome'

const routes = [

  {
    type: "collapse",
    name: "Dashboard",
    key: "Dashboard",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <DashboardIcon/>,
    route: "/Dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Position",
    key: "Position",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <MilitaryTechIcon/>,
    route: "/Position",
    component: <UserPosition />,
  },
  // {
  //   type: "collapse",
  //   name: "Contests",
  //   key: "Contest",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   icon: <BusinessIcon/>,
  //   route: "/contest",
  //   component: <Contest />,
  // },
  {
    type: "collapse",
    name: "Arena",
    key: "arena",
    icon: <StadiumIcon/>,
    route: "/arena",
    component: <UserContest />,
  },
  {
    // type: "collapse",
    // name: "Arena",
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "/arena/:name",
    component: <ContestPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", ContestTradePage
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "arena/:name/register",
    component: <ContestRegisterPage />,
  },
  {
    // type: "collapse",
    // name: "Arena", 
    // key: "arena",
    // icon: <BusinessIcon/>,
    route: "arena/contest/trade",
    component: <ContestTradePage />,
  },
  {
    type: "collapse",
    name: "Trades",
    key: "userorders",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <ReorderIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  {
    type: "collapse",
    name: "Referrals",
    key: "myreferrals",
    icon: <Diversity3Icon/>,
    route: "/myreferrals",
    component: <MyReferrals />,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "userreport",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <AnalyticsIcon/>,
    route: "/userreport",
    component: <UserReport />,
  },
  {
    type: "collapse",
    name: "Portfolio",
    key: "funds",
    icon: <BusinessCenterIcon/>,
    route: "/funds",
    component: <Funds/>,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <PersonPinIcon/>,
    route: "/profile",
    component: <Profile />,
  },

];

// console.log(routes)

export default routes;
