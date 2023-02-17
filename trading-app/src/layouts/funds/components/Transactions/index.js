import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DataTable from "../../../../examples/Tables/DataTable";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "../Transaction";
import TransactionData from './data/transactionData';

function Transactions() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [marginDetails, setMarginDetails] = useState([]);
  const { columns, rows } = TransactionData();
  const getDetails = useContext(userContext);


  useEffect(()=>{
      console.log(getDetails.userDetails.email)
      axios.get(`${baseUrl}api/v1/getUserMarginDetails/${getDetails.userDetails.email}`)
        .then((res)=>{
                console.log(res.data);
                setMarginDetails(res.data);
        }).catch((err)=>{
            window.alert("Error Fetching Margin Details");
            return new Error(err);
        })
  },[])

  let totalCredit = 0;
  marginDetails.map((elem)=>{
    totalCredit =+ totalCredit + elem.amount
  })

  marginDetails.map((elem)=>{
    let obj = {};
    let amountstring = elem.amount > 0 ? "+₹" + (elem.amount).toLocaleString() : "-₹" + (-(elem.amount)).toLocaleString()
    let color = elem.amount > 0 ? "success" : "error"
    let date = new Date(elem.createdOn)
    let day = date.getDate();
    const dayOfWeek = date.getDay();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const variable = hour > 11 ? 'PM' : 'AM'
    const datestring = day + " " + weekday + " " + year + "," + " at " + hour +":" + minutes + ":" + seconds + " " +variable
    
    obj = (
      <Transaction
        color={color}
        icon=<CurrencyRupeeIcon/>
        name="ninepointer"
        description={datestring}
        value={amountstring}
        />
  );
  rows.push(obj);
  })

  console.log(rows[1])

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Credit&apos;s
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Lifetime Credits
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        {/* <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            latest
          </MDTypography>
        </MDBox> */}
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {rows}
        </MDBox>
        {/* <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            all
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 13:45 PM"
            value="+ ₹ 750"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 12:30 PM"
            value="+ ₹ 1,000"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 08:30 AM"
            value="+ ₹ 2,500"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 05:00 AM"
            value="+ ₹ 2,500"
          />
        </MDBox> */}
      </MDBox>
    </Card>
  );
}

export default Transactions;
