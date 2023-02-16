// Material Dashboard 2 React layouts
import CompanyPosition from "./layouts/companyposition";
import AdminDashboard from "./layouts/admindashboard";
import TraderDashboard from "./layouts/traderdashboard";
import Orders from "./layouts/orders";
import CompanyOrders from "./layouts/company-orders";
import Instruments from "./layouts/instruments";
import TradingAccount from "./layouts/trading-account";
import Users from "./layouts/users";
import AlgoBox from "./layouts/algobox";
import Funds from "./layouts/funds";
import RTL from "./layouts/rtl";
import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";

// @mui icons
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableViewIcon from '@mui/icons-material/TableView';
import BusinessIcon from '@mui/icons-material/Business';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Icon from "@mui/material/Icon";
import UserOrders from "./layouts/userorders";
import ContactPageIcon from '@mui/icons-material/ContactPage';
import UserPosition from "./layouts/User Position";
// import UserPosition from "./layouts/userposition";
import UserDashboard from "./layouts/userdashboard";
import UserReport from "./layouts/userreports";
import InventoryIcon from '@mui/icons-material/Inventory';
import DvrIcon from '@mui/icons-material/Dvr';


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
    name: "Trades",
    key: "userorders",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <InventoryIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "userdashboard",
  //   // icon: <Icon fontSize="small">person</Icon>,
  //   icon: <AccountBoxIcon/>,
  //   route: "/userdashboard",
  //   component: <UserDashboard />,
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
    icon: <MonetizationOnIcon/>,
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
