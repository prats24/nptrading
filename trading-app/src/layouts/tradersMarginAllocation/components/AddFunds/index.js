// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import {useState, useContext, useEffect} from "react"
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from "@mui/material";
import Person3Icon from '@mui/icons-material/Person3';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// Images
import masterCardLogo from "../../../../assets/images/logos/mastercard.png";
import visaLogo from "../../../../assets/images/logos/visa.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "../../../../context";
import { userContext } from "../../../../AuthContext";
import uniqid from "uniqid"

function AddFunds({marginDetails, setMarginDetails}) {

  const [controller] = useMaterialUIController();
  const getDetails = useContext(userContext);
  const { darkMode } = controller;
  const [traders, setTraders] = useState([]);
  // const [marginDetails, setMarginDetails] = useState([]);
  let valueInTraderName = 'Praveen K'
  let [traderName, setTraderName] = useState(valueInTraderName);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
  let [details, setDetails] = useState({
    traderName: valueInTraderName,
    amount: ""
  })


  let createdBy = getDetails.userDetails.name;
  let lastModifiedBy = getDetails.userDetails.name;
  //let date = new Date();
  //let lastModifiedOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${(date.getMinutes())}:${String(date.getSeconds()).padStart(2, '0')}`
  let uId = uniqid();

  
  

  useEffect(()=>{
      axios.get(`${baseUrl}api/v1/readuserdetails`)
      .then((res)=>{
        let data = res.data;
        let traderdata = data.filter((elem) => {
          return elem.designation === "Equity Trader"
      })
                setTraders(traderdata);
      }).catch((err)=>{
          window.alert("Error Fetching Trader Details");
          return new Error(err);
      })
  },[])


  async function addFund(){
    setDetails(details);
    axios.get(`${baseUrl}api/v1/getUserMarginDetailsAll`)
      .then((res)=>{
              console.log("Inside Add Funds");
              setMarginDetails(res.data);
      }).catch((err)=>{
          window.alert("Error Fetching Margin Details");
          return new Error(err);
      })
    let userIdArr = traders.filter((elem)=>{
      return elem.name === details.traderName;
    })

    console.log(userIdArr, details)

    const { traderName, amount } = details;
    console.log(traderName,amount);
    const res = await fetch(`${baseUrl}api/v1/setmargin`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
          traderName, amount, lastModifiedBy, uId, userId: userIdArr[0].email, createdBy 
        })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        window.alert(data.error);
        console.log("Invalid Entry");
    } else {
        amount > 0 ?
        window.alert(`₹${amount} credited into ${traderName}'s trading account`)
        :
        window.alert(`₹${-amount} withdrawn from ${traderName}'s trading account`)
        
        console.log("Entry Succesful");
    }
    // reRender ? setReRender(false) : setReRender(true)
    
    
    




  }

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Add Funds
        </MDTypography>
        
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              // sx={{
              //   border: ({ borders: { borderWidth, borderColor } }) =>
              //     `${borderWidth[1]} solid ${borderColor}`,
              // }}
            >
              <MDBox/>
              <Person3Icon/>
                <TextField
                id="outlined-basic"
                select
                label=""
                defaultValue="Praveen K"
                minHeight="4em"
                helperText="Select Trader"
                variant="outlined"
                size="normal"
                
                sx={{margin: 0, padding: 0, width: "200px"}}
                onChange={(e)=>{details.traderName = e.target.value}}
              >
                {traders.map((option) => {
                  // console.log("option", option)
                  return(
                  <MenuItem key={option.name} value={option.name} minHeight="10em">
                    {option.name}
                  </MenuItem>
                  )
                })}
              </TextField>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              // sx={{
              //   border: ({ borders: { borderWidth, borderColor } }) =>
              //     `${borderWidth[1]} solid ${borderColor}`,
              // }}
            >
              <MDBox/>
              <CurrencyRupeeIcon/>
                <TextField
                id="outlined-basic"
                label=""
                minHeight="4em"
                size="small"
                type="number"
                variant="outlined"
                sx={{margin: 0, padding: 0, width: "200px"}}
                onChange={(e)=>{details.amount = e.target.value}}
                helperText="Enter the amount"
              >
              </TextField>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MDBox p="15px">
              <MDButton variant="gradient" color="dark" onClick={addFund}>
              <Icon sx={{ fontWeight: "bold"}}>add</Icon>
               &nbsp;add fund
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}



export default AddFunds;
