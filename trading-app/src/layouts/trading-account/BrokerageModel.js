import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


const BrokerageModel = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Brokerage Details
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic" label="Broker" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Transaction</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Transaction"
                sx={{ margin: 1, padding: 1, width: "300px" }}
              >
                <MenuItem value="BUY">BUY</MenuItem>
                <MenuItem value="SELL">SELL</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Type"
                sx={{ margin: 1, padding: 1, width: "300px" }}
              >
                <MenuItem value="Stocks">Stocks</MenuItem>
                <MenuItem value="Option">Option</MenuItem>
                <MenuItem value="Futures">Futures</MenuItem>
                <MenuItem value="Currency">Currency</MenuItem>
                <MenuItem value="Commodities">Commodities</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Exchange</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Exchange"
                sx={{ margin: 1, padding: 1, width: "300px" }}
              >
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="outlined-basic" label="Brokerage Change" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="Exchange Charge" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="GST" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />
            
            <TextField
              id="outlined-basic" label="SEBI Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="Stamp Duty Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="SST" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="CTT" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="DP Charges" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BrokerageModel