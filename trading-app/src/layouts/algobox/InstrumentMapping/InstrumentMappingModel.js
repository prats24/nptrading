import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { userContext } from '../../../AuthContext';
import uniqid from "uniqid";
import {useState, useContext} from "react"



const InstrumentMappingModel = ({Render}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  let [formData, setFormData] = useState({
    createdOn: "",
    incoming_instrument: "",
    incoming_instrument_code: "",
    outgoing_instrument: "",
    outgoing_instrument_code: "",
    status: ""

  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
    
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn =   `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModified = createdOn;
  let createdBy = getDetails.userDetails.name

  const {reRender, setReRender} = Render;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function formSubmit(e) {
    setFormData(formData);
    console.log(formData)
    const { incoming_instrument, incoming_instrument_code, outgoing_instrument, outgoing_instrument_code, status } = formData;

    const res = await fetch(`${baseUrl}api/v1/instrumentAlgo`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
          InstrumentNameIncoming: incoming_instrument, IncomingInstrumentCode: incoming_instrument_code, InstrumentNameOutgoing: outgoing_instrument, OutgoingInstrumentCode: outgoing_instrument_code, Status: status, lastModified, uId, createdBy, createdOn
        })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        window.alert(data.error);
        console.log("invalid entry");
    } else {
        window.alert("entry succesfull");
        console.log("entry succesfull");
    }
    reRender ? setReRender(false) : setReRender(true)
    setOpen(false);
}


  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Instrument Mapping
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
              id="outlined-basic" label="Instrument Name (Incoming)" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.incoming_instrument = e.target.value}} />

            {/* <TextField
              id="outlined-basic" label="Incoming Instrument Code" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.incoming_instrument_code = e.target.value}} /> */}

            <TextField
              id="outlined-basic" label="Instrument Name (Outgoing)e" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.outgoing_instrument = e.target.value}} />

            {/* <TextField
              id="outlined-basic" label="Outgoing Instrument Code" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formData.outgoing_instrument_code = e.target.value}} /> */}


            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }} 
                onChange={(e)=>{formData.status = e.target.value}}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={formSubmit}>
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

export default InstrumentMappingModel