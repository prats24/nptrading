import {useState, useEffect} from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// import MenuItem from '@mui/material/MenuItem';
import ViewOrders from '@mui/icons-material/ViewList';

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MockViewTradeDetailData from "./data/MockTraderwiseOrdersData";

 
// Data
// import data from "./data";


function TraderMockOrders({userId}) {
  const {columns, rows} = MockViewTradeDetailData();

const [open, setOpen] = useState(false);
const theme = useTheme();
const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
const [menu, setMenu] = useState(null);

const closeMenu = () => setMenu(null);


const [regularSwitch, setRegularSwitch] = useState(true);
const handleClickOpen = () => {

  setOpen(true);

}; 

const handleClose = (e) => {
  setOpen(false);
};



let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
const [orderData, setOrderData] = useState([]);
const [tradeData, setTradeData] = useState([]);

let liveDetailsArr = [];
let totalTransactionCost = 0;
let totalGrossPnl = 0;
let totalRunningLots = 0;

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getusermocktrades/${userId}`)
    .then((res) => {
        if(open){
          setOrderData(res.data);
        }
        
    }).catch((err) => {
        return new Error(err);
    })
  }, [open])

  console.log("mockorderData", orderData, userId)
  orderData.map((elem,index)=>{
    let obj = {};

    const typecolor = elem.buyOrSell == "BUY" ? "info" : "error"
    const statuscolor = elem.status == "COMPLETE" ? "success" : "error"
    const quantitycolor = elem.Quantity > 0 ? "info" : "error"
    const productcolor = elem.Product == "MIS" ? "warning" : "info"

    obj.trader = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(elem.createdBy)}
      </MDTypography>
    );

    obj.product = (
      <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
        {(elem.Product)}
      </MDTypography>
    );

    obj.instrument = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(elem.symbol)}
      </MDTypography>
    );

    obj.type = (
      <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
        {elem.buyOrSell}
      </MDTypography>
    );

    obj.quantity = (
      <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );

    obj.averageprice = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {"₹"+elem.average_price.toFixed(2)}
      </MDTypography>
    );

    obj.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {"₹"+Number(elem.brokerage).toFixed(2)}
      </MDTypography>
    );

    obj.amount = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {"₹"+Math.abs(elem.amount).toFixed(2)}
      </MDTypography>
    );
    obj.timestamp = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(elem.trade_time).slice(11)}
      </MDTypography>
    );
    obj.status = (
      <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    rows.push(obj);
  })

return (
<div>
<MDButton variant="" color="black" onClick={handleClickOpen} fullWidth>
  <ViewOrders/>
</MDButton>
<div>
  <Dialog
    fullScreen={fullScreen}
    open={open}
    onClose={handleClose}
    aria-labelledby="responsive-dialog-title">
    <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
      {"Regular"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, width: "500px" }}>

        <MDBox>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={true}
            isSorted={false}
            pagination={false}
            noEndBorder
          />
        </MDBox>

      </DialogContentText>
    </DialogContent>
  </Dialog>
</div >

</div >
);

}
export default TraderMockOrders;
