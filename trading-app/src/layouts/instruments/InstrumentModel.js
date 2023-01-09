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


const InstrumentModel = () => {
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
          Add Instrument
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
            <DialogContentText sx={{display:"flex", flexDirection:"column"}}>
            <TextField
            id="outlined-basic" label="Contract Date" variant="standard"
             sx={{margin: 1, padding : 1, width:"300px"}}/>
            
             <TextField
            id="outlined-basic" label="Instrument" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}}/>
           
             <TextField
            id="outlined-basic" label="Exchange" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}}/>
           
             <TextField
            id="outlined-basic" label="Symbol" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}}/>
           
             <TextField
            id="outlined-basic" label="Lot Size" variant="standard"  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}}/>
           
             <TextField
            id="outlined-basic" label="Max Lot" variant="standard"  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}}/>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Status"
            >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inctive</MenuItem>
          </Select>
        </FormControl>
        {/* <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue=""
        >
           <MenuItem value="none">Select</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inctive</MenuItem>
        </TextField> */}

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

export default InstrumentModel