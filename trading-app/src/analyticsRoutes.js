// Material Dashboard 2 React layouts
import CompanyPosition from "./layouts/companyposition";
import CohortPosition from "./layouts/cohortposition";
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
import TradersMarginAllocation from "./layouts/tradersMarginAllocation"
import AnalyticsRoutes from './analyticsRoutes'


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
import WalletIcon from '@mui/icons-material/Wallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DBEntry from "./layouts/InsertData/DBEntry";
import CompanyAnalytics from "./layouts/analytics/companyPNLAnalytics1"


const analyticsRoutes = [
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <DashboardIcon/>,
    route: "/analytics",
    component: <CompanyAnalytics />,
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

export default analyticsRoutes;
