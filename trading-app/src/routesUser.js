// Material Dashboard 2 React layouts
import Funds from "./layouts/funds";
import Profile from "./layouts/profile";

// @mui icons
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

//page routes
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/User Position";
import UserReport from "./layouts/userreports";
import MyReferrals from "./layouts/referrals"
import Contest from "./layouts/user-contest"


const routes = [

  {
    type: "collapse",
    name: "Position",
    key: "Position",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <BusinessIcon/>,
    route: "/Position",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "contests",
    key: "contests",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <BusinessIcon/>,
    route: "/contest",
    component: <Contest />,
  },
  {
    type: "collapse",
    name: "Trades",
    key: "userorders",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <InventoryIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  // {
  //   type: "collapse",
  //   name: "My Referrals",
  //   key: "myreferrals",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   icon: <PersonIcon/>,
  //   route: "/myreferrals",
  //   component: <MyReferrals />,
  // },
  {
    type: "collapse",
    name: "Dashboard",
    key: "userreport",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <DashboardIcon/>,
    route: "/userreport",
    component: <UserReport />,
  },
  {
    type: "collapse",
    name: "Funds",
    key: "funds",
    icon: <CurrencyRupeeIcon/>,
    route: "/funds",
    component: <Funds/>,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <AccountBoxIcon/>,
    route: "/profile",
    component: <Profile />,
  },

];

export default routes;
