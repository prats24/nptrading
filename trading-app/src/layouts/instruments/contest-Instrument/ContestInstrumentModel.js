import * as React from 'react';
import {useContext, useState, useEffect} from "react";
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
import {userContext} from "../../../AuthContext";
import uniqid from "uniqid";
import axios from "axios";


const InstrumentModel = ({Render}) => {
    const {reRender, setReRender} = Render
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    let [formData, setFormData] = useState({
      contractDate: "",
      instrument: "",
      exchange: "",
      symbol: "",
      lotSize: "",
      maxLot: "",
      status: "",
      contest: ""
    });

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    let [optionData, setOptiondata] = useState([]);
    useEffect(()=>{
      axios.get(`${baseUrl}api/v1/contest/active`)
      .then((res)=>{
                // setContestData(res.data.data);
                console.log("optionData res", res.data.data)
              for(let i =0; i< (res.data.data).length; i++){
                optionData.push( <option value={res.data.data[i]}>{ res.data.data[i].contestName}</option>)
              }
              setOptiondata(optionData)
              console.log("optionData effect", optionData)
        }).catch((err)=>{
          return new Error(err);
      })

    }, [])

    console.log("optionData", optionData)

      
    const getDetails = useContext(userContext);
    let uId = uniqid();
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let lastModified = createdOn;
    let createdBy = getDetails.userDetails.name
    let createdByUserId = getDetails.userDetails._id
  
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    async function formSubmit(){

      setFormData(formData);
      console.log(formData)
      const { contractDate, instrument, exchange, symbol, lotSize, maxLot, status, contest } = formData;
         
      const res = await fetch(`${baseUrl}api/v1/contestInstrument`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              instrument, exchange, status, symbol, lotSize, lastModified, uId, createdBy, createdByUserId,createdOn , contractDate, maxLot, contest
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
             sx={{margin: 1, padding : 1, width:"300px"}} type="date" onChange={(e)=>{formData.contractDate = e.target.value}}/>
            
             <TextField
            id="outlined-basic" label="Instrument" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.instrument = e.target.value}}/>
           
             <TextField
            id="outlined-basic" label="Exchange" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.exchange = e.target.value}}/>
           
             <TextField
            id="outlined-basic" label="Symbol" variant="standard"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.symbol = e.target.value}}/>
           
             <TextField
            id="outlined-basic" label="Lot Size" variant="standard"  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.lotSize = e.target.value}}/>
           
             <TextField
            id="outlined-basic" label="Max Lot" variant="standard"  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.maxLot = e.target.value}}/>


              <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                <InputLabel id="demo-simple-select-standard-label">Contest</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Contest"
                  onChange={(e) => {formData.contest = e.target.value}}
                  sx={{ margin: 1, padding: 1, }}
                >
                    {optionData.map((elem)=>{
                        return(
                            <MenuItem value={elem.props.value}>{elem.props.children}</MenuItem>
                        )
                    }) 
                    }
                </Select>
              </FormControl>



          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Status"
              sx={{margin: 1, padding : 1, width:"300px"}}
              onChange={(e)=>{formData.status = e.target.value}}
              >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
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

export default InstrumentModel


