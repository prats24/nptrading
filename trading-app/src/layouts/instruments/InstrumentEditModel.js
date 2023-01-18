

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
import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import userContext from "../../AuthContext";
import uniqid from "uniqid";
import EditSharpIcon from '@mui/icons-material/EditSharp';



const InstrumentEditModel = ({Render, data, id}) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
      
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let lastModified = createdOn;
  
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const { reRender, setReRender } = Render;
    const [editData, setEditData] = useState(data);

    const [contractDate, setcontractDate] =useState();
    const [instrument, setInstrument] = useState();
    const [exchange, setexchange] = useState();
    const [symbol, setsymbol] = useState();
    const [lotSize, setlotSize] = useState();
    const [maxlot, setMaxlot] = useState();
    const [status, setStatus] = useState();
    const [otmP1, setOtmP1] = useState();
    const [otmP2, setOtmP2] = useState();
    const [otmP3, setOtmP3] = useState();

    useEffect(() => {
        let updatedData = data.filter((elem) => {
            return elem._id === id
        })
        setEditData(updatedData)
    }, [])

    useEffect(() => {
        console.log("edit data", editData);

        setcontractDate(editData[0].contractDate);
        setInstrument(editData[0].instrument)
        setexchange(editData[0].exchange);
        setsymbol(editData[0].symbol);
        setlotSize(editData[0].lotSize);
        setMaxlot(editData[0].maxLot);
        setStatus(editData[0].status);
        setOtmP1(editData[0].otm_p1)
        setOtmP2(editData[0].otm_p2)
        setOtmP3(editData[0].otm_p3)

    }, [editData, reRender])

    const [formstate, setformstate] = useState({
        contract_Date:"",
        Instrument: "",
        Exchange: "",
        Status: "",
        Symbole: "",
        LotSize: "",
        maxLot:"",
        LastModifiedOn: "",
        otm_p1: "",
        otm_p2: "",
        otm_p3: "",
    });
// todo ---> patch req in user detail auth and put req anlso in instrument auth
    async function formbtn() {
        
        formstate.contract_Date = contractDate;
        formstate.Instrument = instrument;
        formstate.Exchange = exchange;
        formstate.Symbole = symbol;
        formstate.LotSize = lotSize;
        formstate.maxLot = maxlot;
        formstate.Status = status;
        formstate.otm_p1 = otmP1;
        formstate.otm_p2 = otmP2;
        formstate.otm_p3 = otmP3;
        
        setformstate(formstate);


        const { contract_Date,Instrument, Exchange, Symbole,LotSize,maxLot, Status, otm_p1, otm_p2, otm_p3 } = formstate;

        const res = await fetch(`${baseUrl}api/v1/readInstrumentDetails/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                contract_Date ,Instrument, Exchange, Symbole,LotSize, maxLot, Status, lastModified, otm_p1, otm_p2, otm_p3
            })
        });
        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            console.log("Failed to Edit");
        } else {
            console.log(dataResp);
            window.alert("Edit succesfull");
            console.log("Edit succesfull");
        }
        setOpen(false);
        reRender ? setReRender(false) : setReRender(true)
    }

    async function Ondelete() {
        console.log(editData)
        setOpen(false);
        const res = await fetch(`${baseUrl}api/v1/readInstrumentDetails/${id}`, {
            method: "DELETE",
        });

        const dataResp = await res.json();
        console.log(dataResp);
        if (dataResp.status === 422 || dataResp.error || !dataResp) {
            window.alert(dataResp.error);
            console.log("Failed to Delete");
        } else {
            console.log(dataResp);
            window.alert("Delete succesfull");
            console.log("Delete succesfull");
        }

        reRender ? setReRender(false) : setReRender(true)
    }


  
    return (
      <div>
        <MDButton variant="outlined" color="info" onClick={handleClickOpen}>
         <EditSharpIcon/>
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
            id="outlined-basic" label="Contract Date" variant="standard" value={contractDate}
             sx={{margin: 1, padding : 1, width:"300px"}} type="date" onChange={(e)=>{ setcontractDate( e.target.value)}}/>
            
             <TextField
            id="outlined-basic" label="Instrument" variant="standard" value={instrument}
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setInstrument( e.target.value)}}/>
           
             <TextField
            id="outlined-basic" label="Exchange" variant="standard" value={exchange}
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setexchange( e.target.value)}}/>
           
             <TextField
            id="outlined-basic" label="Symbol" variant="standard" value={symbol}
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setsymbol( e.target.value)}}/>
           
             <TextField
            id="outlined-basic" label="Lot Size" variant="standard" value={lotSize}  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setlotSize( e.target.value)}}/>
           
             <TextField
            id="outlined-basic" label="Max Lot" variant="standard" value={maxlot}  type="number"
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setMaxlot( e.target.value)}}/>

            <TextField
            id="outlined-basic" label="OTM P1" variant="standard" value={otmP1} 
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setOtmP1( e.target.value)}}/>

            <TextField
            id="outlined-basic" label="OTM P2" variant="standard" value={otmP2} 
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setOtmP2( e.target.value)}}/>

            <TextField
            id="outlined-basic" label="OTM P3" variant="standard" value={otmP3} 
            sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{ setOtmP3( e.target.value)}}/>


          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Status"
            sx={{margin: 1, padding : 1, width:"300px"}}
            onChange={(e)=>{ setStatus( e.target.value)}}
            value={status}
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

export default  InstrumentEditModel