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

function PaymentMethod() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [traders, setTraders] = useState([]);
  let valueInTraderName = 'Praveen K'
  let [traderName, setTraderName] = useState(valueInTraderName);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

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
  },[traderName])

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
                //helperText="Please select the body condition"
                variant="outlined"
                size="normal"
                sx={{margin: 0, padding: 0, width: "200px"}}
              >
                {traders.map((option) => (
                  <MenuItem key={option.name} value={option.name} minHeight="10em">
                    {option.name}
                  </MenuItem>
                ))}
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
                //helperText="Please select the body condition"
                variant="outlined"
                sx={{margin: 0, padding: 0, width: "200px"}}
              >
              </TextField>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MDBox p="15px">
              <MDButton variant="gradient" color="dark">
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



export default PaymentMethod;
