/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

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
import Setting from "./layouts/settings/Setting";
import Expense from "./layouts/expenses/";

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
import AdminReport from "./layouts/adminreport";
import DailyPNLData from "./layouts/dailyPnlDashboard";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import SettingsIcon from '@mui/icons-material/Settings';
// import SettingIcon from '@mui/icons-material/Setting'; 

const routes = [
  {
    type: "collapse",
    name: "Company Dashboard",
    key: "admindashboard",
    // icon: <Icon fontSize="small">dashboard</Icon>,
    icon: <DashboardIcon/>,
    route: "/admindashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Company Position",
    key: "companyposition",
    icon: <BusinessIcon/>,
    // icon: <Icon fontSize="small">dashboard</Icon>,
    // icon: <DashboardIcon/>,
    route: "/companyposition",
    component: <CompanyPosition />,
    // key: "dashboard",
    // icon: <Icon fontSize="small">dashboard</Icon>,
    
    // route: "/dashboard",
    // component: <Dashboard />,
  },
  
  {
    type: "collapse",
    name: "Admin Reports",
    key: "adminreport",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <SummarizeIcon/>,
    route: "/adminreport",
    component: <AdminReport/>,
  },
  {
    type: "collapse",
    name: "Trader Dashboard",
    key: "traderdashboard",
    // icon: <Icon fontSize="small">dashboard</Icon>,
    icon: <DashboardIcon/>,
    route: "/traderdashboard",
    component: <TraderDashboard />,
  },
  {
    type: "collapse",
    name: "All Orders",
    key: "orders",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <TableViewIcon/>,
    route: "/orders",
    component: <Orders />,
  },
  {
    type: "collapse",
    name: "Instruments",
    key: "instruments",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon:<CandlestickChartIcon/>,
    route: "/instruments",
    component: <Instruments />,
  },
  {
    type: "collapse",
    name: "Algo Box",
    key: "algobox",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <ManageAccountsIcon/>,
    route: "/algobox",
    component: <AlgoBox />,
  },
  {
    type: "collapse",
    name: "Trading Accounts",
    key: "trading-accounts",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <AccountBalanceIcon/>,
    route: "/trading-accounts",
    component: <TradingAccount />,
  },
  {
    type: "collapse",
    name: "Setting",
    key: "setting",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <SettingsIcon/>,
    route: "/setting",
    component: <Setting />,
  },
  {
    type: "collapse",
    name: "Expenses",
    key: "expense",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <SettingsIcon/>,
    route: "/expense",
    component: <Expense />,
  },
  {
    type: "collapse",
    name: "Daily P&L Chart",
    key: "DailyPnlData",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <QueryStatsIcon/>,
    route: "/DailyPnlData",
    component: <DailyPNLData />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    // icon: <Icon fontSize="small">table_view</Icon>,
    icon: <PersonIcon/>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Funds",
    key: "funds",
    // icon: <Icon fontSize="small">receipt_long</Icon>,
    icon: <MonetizationOnIcon/>,
    route: "/funds",
    component: <Funds />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    // icon: <Icon fontSize="small">notifications</Icon>,
    icon: <NotificationsActiveIcon/>,
    route: "/notifications",
    component: <Notifications />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   // icon: <Icon fontSize="small">login</Icon>,
  //   icon: <LoginIcon/>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   // icon: <Icon fontSize="small">assignment</Icon>,
  //   icon:<LogoutIcon/>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
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
    name: "Orders",
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
    name: "Report",
    key: "userreport",
    // icon: <Icon fontSize="small">person</Icon>,
    icon: <DashboardIcon/>,
    route: "/userreport",
    component: <UserReport />,
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
