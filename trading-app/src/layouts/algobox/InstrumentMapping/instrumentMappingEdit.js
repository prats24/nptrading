import * as React from 'react';
import {useState, useEffect} from "react"
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from "axios"
import { userContext } from '../../../AuthContext';


const InstrumentMappingEdit = ({ data, id, Render }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const getDetails = React.useContext(userContext);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let date = new Date();
  let lastModified = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModifiedBy = getDetails.userDetails.name

  const { reRender, setReRender } = Render;
  const [editData, setEditData] = useState(data);

  const [incomingInstrument, setIncomingInstrument] = useState();
  const [outgoingInstrument, setOutgoingInstrument] = useState();
  const [StatusState, setStatus] = useState();
 
  useEffect(() => {
      let updatedData = data.filter((elem) => {
          return elem._id === id
      })
      setEditData(updatedData)

  }, [])

  useEffect(() => {

      setIncomingInstrument(editData[0].InstrumentNameIncoming)
      setOutgoingInstrument(editData[0].InstrumentNameOutgoing);
      setStatus(editData[0].Status);

  }, [editData, reRender])
  //console.log(editData, id);

  const [formstate, setformstate] = useState({
      incoming_instrument: "",
      outgoing_instrument : "",
      status: ""
  });

  //console.log(formstate);

  async function formbtn() {

      formstate.incoming_instrument = incomingInstrument;
      formstate.outgoing_instrument = outgoingInstrument;
      formstate.status = StatusState;

      setformstate(formstate);

      const {incoming_instrument, status, outgoing_instrument } = formstate;

      const res = await fetch(`${baseUrl}api/v1/readInstrumentAlgo/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            incoming_instrument, status, outgoing_instrument, lastModified, lastModifiedBy
          })
      });
      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Edit");
      } else {
          //console.log(dataResp);
          window.alert("Edit succesfull");
          //console.log("Edit succesfull");
      }

      reRender ? setReRender(false) : setReRender(true)
      setOpen(false);
  }

  async function Ondelete() {
      //console.log(editData)
      const res = await fetch(`${baseUrl}api/v1/readInstrumentAlgo/${id}`, {
          method: "DELETE",
      });

      const dataResp = await res.json();
      //console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          //console.log("Failed to Delete");
      } else {
          //console.log(dataResp);
          window.alert("Delete succesfull");
          //console.log("Delete succesfull");
      }

      setOpen(false);
      reRender ? setReRender(false) : setReRender(true)
  }

  return (
    <div>
      <Button variant="" color="black" onClick={handleClickOpen}>
        <EditSharpIcon/>
      </Button>
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
              id="outlined-basic" label="Incoming Instrument" variant="standard" value={incomingInstrument}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setIncomingInstrument( e.target.value)}}/>


            <TextField
              id="outlined-basic" label="Outgoing Instrument" variant="standard" value={outgoingInstrument}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setOutgoingInstrument( e.target.value)}}/>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{setStatus( e.target.value)}}
                value={StatusState}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button autoFocus onClick={formbtn}>
            OK
          </Button>
          <Button onClick={Ondelete} autoFocus>
            DELETE
          </Button>
          <Button onClick={handleClose} autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InstrumentMappingEdit