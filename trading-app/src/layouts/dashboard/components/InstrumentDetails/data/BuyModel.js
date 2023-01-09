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


const BuyModel = () => {
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
      <MDButton variant="contained" color="info" onClick={handleClickOpen} fullWidth>
        BUY
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
          {/* <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic" label="Broker" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="Account ID" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} />
            

            <TextField
              id="outlined-basic" label="Acccount Name" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            
            <TextField
              id="outlined-basic" label="API Key" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <TextField
              id="outlined-basic" label="API Secret" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} />

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inctive</MenuItem>
              </Select>
            </FormControl>
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
           BUY
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BuyModel