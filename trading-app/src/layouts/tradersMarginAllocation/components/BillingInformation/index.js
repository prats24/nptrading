import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// Billing page components
import Bill from "../Bill";
import Transaction from "../Transaction";
import TransactionData from './data/transactionData';
import { margin } from "@mui/system";

function BillingInformation({marginDetails,setMarginDetails}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const [marginDetails, setMarginDetails] = useState([]);
  const { columns, rows } = TransactionData();
  const getDetails = useContext(userContext);
  const [traders, setTraders] = useState([]);
  const [marginDetailsCount, setMarginDetailsCount] = useState([]);



  // useEffect(()=>{
  //     axios.get(`${baseUrl}api/v1/getUserMarginDetailsAll`)
  //       .then((res)=>{
  //               console.log(res.data);
  //               setMarginDetails(res.data);
  //               setMarginDetailsCount((res.data).length);
  //       }).catch((err)=>{
  //           window.alert("Error Fetching Margin Details");
  //           return new Error(err);
  //       })
  // },[])


  marginDetails.map((elem)=>{
    let obj = {};
    let amountstring = elem.amount > 0 ? "+₹" + (elem.amount).toLocaleString() : "-₹" + (-(elem.amount)).toLocaleString()
    let color = elem.amount > 0 ? "success" : "error"

    var dateString = elem.createdOn;
    var dateParts = dateString.split(" ");

    var date = dateParts[0].split("-");
    var time = dateParts[1].split(":");

    date = new Date(date[2], parseInt(date[1]) - 1, date[0], time[0], time[1], time[2]);

    console.log(date);
    let day = date.getDate();
    const dayOfWeek = date.getDay();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const month = date.getMonth();
    const monthname = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'][month];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const variable = hour > 11 ? 'PM' : 'AM'
    const datestring = day + ' ' + monthname + " " + " " + year + ", " + weekday + " at " + hour +":" + minutes + ":" + seconds + " " +variable
    
    obj = (
      <Bill
            name={elem.traderName}
            company={elem.createdBy}
            email={elem.userId}
            vat={elem.transactionId}
            creditedOn={datestring}
            amount={amountstring}
            color={color}
            totalCredit=''
          />
      );
  rows.push(obj);
  })

  console.log(rows[1])


  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Credit History
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        {rows}
        <h1>{marginDetails.length}</h1>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
