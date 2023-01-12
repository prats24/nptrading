import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MDBox from '../../../../../components/MDBox';
import { Box, Typography } from '@mui/material';

const SellModel = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [regularSwitch, setRegularSwitch] = React.useState(true);

  const [buyFormDetails, setBuyFormDetails] = React.useState({
    exchange: "",
    symbol: "",
    ceOrPe: "",
    buyOrSell: "",
    variety: "",
    Product: "",
    Quantity: "",
    Price: "",
    OrderType: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })

  const [value, setValue] = React.useState('NRML');
  buyFormDetails.Product = value;
  const handleChange = (event) => {
    setValue(event.target.value);
    buyFormDetails.Product = event.target.value;
  };

  const [market, setMarket] = React.useState('MARKET');
  buyFormDetails.OrderType = market;
  const marketHandleChange = (event) => {
    setMarket(event.target.value);
    buyFormDetails.OrderType = event.target.value;
  };
  const [validity, setValidity] = React.useState('DAY');
  buyFormDetails.validity = validity;
  const validityhandleChange = (event) => {
    setValidity(event.target.value);
    buyFormDetails.validity = event.target.value;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    buyFormDetails.buyOrSell = "Sell";

    if (regularSwitch === true) {
      buyFormDetails.variety = "regular"
    }
    else {
      buyFormDetails.variety = "amo"
    }

    setBuyFormDetails(buyFormDetails);
    console.log("buy button click");

  };
  console.log(buyFormDetails)

  return (
    <div>
      <MDButton variant="contained" color="error" onClick={handleClickOpen} fullWidth>
        SELL
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          {"Regular"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, marginTop: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}><Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600 }}>Symbol</Box> &nbsp; &nbsp; &nbsp; <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600 }}>LTP</Box></Box>
            <FormControl >

              <FormLabel id="demo-controlled-radio-buttons-group" sx={{ width: "300px" }}></FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel value="MIS" control={<Radio />} label="Intraday MIS" />
                <FormControlLabel value="NRML" control={<Radio />} label="Overnight NRML" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Quantity"
                  onChange={(e) => { { buyFormDetails.Quantity = (e.target.value) } }}
                  sx={{ margin: 1, padding: 1, }}
                >
                  <MenuItem value="100">100</MenuItem>
                  <MenuItem value="150">150</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic" label="Price" variant="standard" onChange={(e) => { { buyFormDetails.Price = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} />

              <TextField
                id="outlined-basic" label="Trigger Price" variant="standard" onChange={(e) => { { buyFormDetails.TriggerPrice = (e.target.value) } }}
                sx={{ margin: 1, padding: 1, width: "300px" }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={market}
                  onChange={marketHandleChange}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
                  <FormControlLabel value="LIMIT" control={<Radio />} label="LIMIT" />
                </RadioGroup>
              </FormControl>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  onChange={(e) => { { buyFormDetails.stopLoss = (e.target.value) } }}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="SL" control={<Radio />} label="SL" />
                  <FormControlLabel value="SLM" control={<Radio />} label="SL-M" />
                </RadioGroup>
              </FormControl>

            </Box>

            <Box>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" >Validity</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={validity}
                  onChange={validityhandleChange}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <FormControlLabel value="DAY" control={<Radio />} label="DAY" />
                  <FormControlLabel value="IMMEDIATE" control={<Radio />} label="IMMEDIATE" />
                  <FormControlLabel value="MINUTES" control={<Radio />} label="MINUTES" />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton autoFocus variant="contained" color="error" onClick={(e) => { handleClose(e) }}>
            Sell
          </MDButton>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
            Close
          </MDButton>
        </DialogActions>


      </Dialog>
    </div>
  );
}

export default SellModel