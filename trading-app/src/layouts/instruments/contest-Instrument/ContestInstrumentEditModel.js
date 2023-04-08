

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
// import MDButton from '../../components/MDButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import userContext from "../../AuthContext";
import uniqid from "uniqid";
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from "axios"


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
    const [contestName, setContestName] = useState();

    // useEffect(() => {
    //     let updatedData = data.filter((elem) => {
    //         return elem._id === id
    //     })
    //     setEditData(updatedData)
    // }, [])

    let formattedDate;
    useEffect(() => {
        //console.log("edit data", editData);

        setcontractDate(editData?.contractDate);
        setInstrument(editData?.instrument)
        setexchange(editData?.exchange);
        setsymbol(editData?.symbol);
        setlotSize(editData?.lotSize);
        setMaxlot(editData?.maxLot);
        setStatus(editData?.status);
        setContestName(editData?.contest?.name)

    }, [editData, reRender])

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

    const [formstate, setformstate] = useState({
        contract_Date:"",
        Instrument: "",
        Exchange: "",
        Status: "",
        Symbole: "",
        LotSize: "",
        maxLot:"",
        contestname: "",
        LastModifiedOn: "",
    });
// todo ---> patch req in user detail auth and put req anlso in instrument auth
    async function formbtn() {
        
        formstate.contract_Date = contractDate;
        formstate.Instrument = instrument;
        formstate.Exchange = exchange;
        formstate.Symbole = symbol;
        formstate.LotSize = lotSize;
        formstate.maxLot = maxlot;
        formstate.contest = contestName;
        formstate.Status = status;
        
        setformstate(formstate);


        const { contract_Date,Instrument, Exchange, Symbole,LotSize,maxLot, Status, contest } = formstate;

        const res = await fetch(`${baseUrl}api/v1/contestInstrument/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                contract_Date ,Instrument, Exchange, Symbole,LotSize, maxLot, Status, lastModified, contest
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
        setOpen(false);
        reRender ? setReRender(false) : setReRender(true)
    }

    async function Ondelete() {
        //console.log(editData)
        setOpen(false);
        const res = await fetch(`${baseUrl}api/v1/readInstrumentDetails/${id}`, {
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

        reRender ? setReRender(false) : setReRender(true)
    }

    function getFormattedDate(dateStr) {
      if (!dateStr) return '';
      const dateParts = dateStr.split('-');
      if (dateParts.length !== 3) return '';
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const year = parseInt(dateParts[2]);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
      const dateObj = new Date(year, month, day);
      const dateObjnew = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000))
      return dateObjnew.toISOString().split('T')[0];
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
            <DialogContentText sx={{display:"flex", flexDirection:"column"}}>
            <TextField
            id="outlined-basic" label="Contract Date" variant="standard" value={getFormattedDate(contractDate)}
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

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
              <InputLabel id="demo-simple-select-standard-label">Contest</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Contest"
                // onChange={(e) => {formData.contest = e.target.value}}
                sx={{ margin: 1, padding: 1, }}
                onChange={(e)=>{ setContestName( e.target.value)}}
                value={contestName}
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