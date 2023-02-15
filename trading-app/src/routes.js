// Material Dashboard 2 React layouts
import CompanyPosition from "./layouts/companyposition";
import AdminDashboard from "./layouts/admindashboard";
import TraderDashboard from "./layouts/traderdashboard";
import Orders from "./layouts/orders";
import Instruments from "./layouts/instruments";
import TradingAccount from "./layouts/trading-account";
import Users from "./layouts/users";
import AlgoBox from "./layouts/algobox";
import Funds from "./layouts/funds";
import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import Setting from "./layouts/settings/Setting";
import Expense from "./layouts/expenses/";
import AlgoPosition from "./layouts/algo position";
import UserOrders from "./layouts/userorders";
import UserPosition from "./layouts/User Position";
import UserReport from "./layouts/userreports";
import TradersReport from "./layouts/tradersReportMock";
import AdminReport from "./layouts/adminreportMock";
import DailyPNLData from "./layouts/dailyPnlDashboard";
import TraderPosition from "./layouts/traderPosition"
import AdminReportLive from "./layouts/adminreportLive"
import TradersReportLive from "./layouts/tradersReportLive"


// @mui icons
import Shop2Icon from '@mui/icons-material/Shop2';
import ReportIcon from '@mui/icons-material/Assessment';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InventoryIcon from '@mui/icons-material/Inventory'; 
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeringIcon from '@mui/icons-material/Engineering';
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


const routes = [
  {
    type: "collapse",
    name: "Company Dashboard",
    key: "admindashboard",
    icon: <DashboardIcon/>,
    route: "/admindashboard",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Company Position",
    key: "companyposition",
    icon: <BusinessIcon/>,
    route: "/companyposition",
    component: <CompanyPosition />,
  },

  {
    type: "collapse",
    name: "Trader Position",
    key: "traderposition",
    icon: <BusinessIcon/>,
    route: "/traderposition",
    component: <TraderPosition />,
  },

  {
    type: "collapse",
    name: "Algo Position(s)",
    key: "algoposition",
    icon: <EngineeringIcon/>,
    route: "/algoposition",
    component: <AlgoPosition />,
  },
  
  {
    type: "collapse",
    name: "Admin Reports(M)",
    key: "adminreport",
    icon: <SummarizeIcon/>,
    route: "/adminreport",
    component: <AdminReport/>,
  },
  {
    type: "collapse",
    name: "Admin Reports(L)",
    key: "adminreportlive",
    icon: <SummarizeIcon/>,
    route: "/adminreportlive",
    component: <AdminReportLive/>,
  },
  {
    type: "collapse",
    name: "Trader Reports(M)",
    key: "tradersReport",
    icon: <ReportIcon/>,
    route: "/tradersReport",
    component: <TradersReport/>,
  },
  {
    type: "collapse",
    name: "Trader Reports(L)",
    key: "tradersReportlive",
    icon: <ReportIcon/>,
    route: "/tradersReportLive",
    component: <TradersReportLive/>,
  },
  {
    type: "collapse",
    name: "All Orders",
    key: "orders",
    icon: <TableViewIcon/>,
    route: "/orders",
    component: <Orders />,
  },
  {
    type: "collapse",
    name: "Instruments",
    key: "instruments",
    icon:<CandlestickChartIcon/>,
    route: "/instruments",
    component: <Instruments />,
  },
  {
    type: "collapse",
    name: "Algo Box(s)",
    key: "algobox",
    icon: <ManageAccountsIcon/>,
    route: "/algobox",
    component: <AlgoBox />,
  },
  {
    type: "collapse",
    name: "Trading Accounts",
    key: "trading-accounts",
    icon: <AccountBalanceIcon/>,
    route: "/trading-accounts",
    component: <TradingAccount />,
  },
  {
    type: "collapse",
    name: "App Settings",
    key: "setting",
    icon: <SettingsIcon/>,
    route: "/setting",
    component: <Setting />,
  },
  {
    type: "collapse",
    name: "Expenses",
    key: "expense",
    icon: <Shop2Icon/>,
    route: "/expense",
    component: <Expense />,
  },
  {
    type: "collapse",
    name: "Daily P&L Chart",
    key: "DailyPnlData",
    icon: <QueryStatsIcon/>,
    route: "/DailyPnlData",
    component: <DailyPNLData />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <PersonIcon/>,
    route: "/users",
    component: <Users />,
  },
  // {
  //   type: "collapse",
  //   name: "Funds",
  //   key: "funds",
  //   icon: <MonetizationOnIcon/>,
  //   route: "/funds",
  //   component: <Funds />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <NotificationsActiveIcon/>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Position",
    key: "Position",
    icon: <BusinessIcon/>,
    route: "/Position",
    component: <UserPosition />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "userorders",
    icon: <InventoryIcon/>,
    route: "/userorders",
    component: <UserOrders />,
  },
  {
    type: "collapse",
    name: "Report",
    key: "userreport",
    icon: <DashboardIcon/>,
    route: "/userreport",
    component: <UserReport />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <AccountBoxIcon/>,
    route: "/profile",
    component: <Profile />,
  },

];

export default routes;
