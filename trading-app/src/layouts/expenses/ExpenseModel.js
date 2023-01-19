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
import { userContext } from '../../AuthContext';
import uniqid from "uniqid";
import axios from "axios";
import { useEffect, useState, useContext } from "react";





const ExpenseModel = () => {
  const [open, setOpen] = React.useState(false);
  const [Admins, setAdmins] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const User = ['User 1', 'User 2', 'User 3'];

  const [formstate, setformstate] = useState({
    expense_date : "",
    sub_category : "",
    category : "",
    amount : "",
    gst : "",
    total_amount : "",
    description : "",
    payment_status : "",
    expense_by : "",
    invoice_upload : ""
  });

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  let lastmodifiedOn = createdOn;
  let created_by = getDetails.userDetails.name
  let lastmodified_by = created_by;

  const [reRender, setReRender] = useState(true);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getAdmins`)
    .then((res)=>{
        setAdmins(res.data);
    }).catch((err)=>{
        window.alert("Server Down");
        return new Error(err);
    })
},[getDetails])



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("Admins: "+Admins)
  let adminnames = [];
  Admins.map((elem)=>{
    adminnames.push(elem.name);
  })

  console.log("Admin Names: "+adminnames);

  async function formSubmit() {
    setformstate(formstate);
    console.log(formstate)

    const { expense_date,sub_category,category,amount,gst,total_amount,description,payment_status,expense_by,invoice_upload} = formstate;

    const res = await fetch(`${baseUrl}api/v1/expense`, {
      
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          expense_date, sub_category, category, amount, gst, total_amount, description, payment_status, expense_by, created_by, invoice_upload, createdOn, lastmodified_by, lastmodifiedOn, uId
        })
    });


    const data = await res.json();
    console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        console.log("Invalid Entry");
    }else{
        window.alert("Expense Created Successfully");
        console.log("Expense Entry Succesfull");
    }
    setOpen(false);
    reRender ? setReRender(false) : setReRender(true)
}

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create Expense
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
              id="outlined-basic" label="Expense Date" variant="standard" type="date"
              sx={{ margin: 1, padding: 2, width: "300px" }} onChange={(e)=>{formstate.expense_date = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Category" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.category = e.target.value}}/>
            

            <TextField
              id="outlined-basic" label="Sub Category" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.sub_category = e.target.value}}/>

            
            <TextField
              id="outlined-basic" label="Amount" variant="standard" type="number" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.amount = e.target.value}}/>

            <TextField
              id="outlined-basic" label="GST" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.gst = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="Total Amount" variant="standard" type="number"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.total_amount = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="Description" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.description = e.target.value}}/>
            
            {/* <TextField
                id="outlined-basic" label="Expense By" variant="standard"
                select value={formstate.expense_by}
                onChange={(e)=>{formstate.expense_by = e.target.value}}
                sx={{ margin: 1, padding: 2, width: '300px' }}>
                {adminnames.map(user => (
                    <MenuItem key={user} value={user}>
                        {user}
                    </MenuItem>
                ))}
                
            </TextField> */}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                  <InputLabel id="demo-simple-select-standard-label">Expense By</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Expense By"
                    onChange={(e)=>{formstate.expense_by = e.target.value}}
                    sx={{ margin: 1, padding: 2, }}
                  >
                    {adminnames.map((elem)=>{
                      console.log("Admin Names: ", elem)
                        return(
                            <MenuItem value={elem}>
                            {elem}
                            </MenuItem>
                        )
                    }) 
                    }
                  </Select>
                </FormControl>

            <TextField
              id="outlined-basic" label="Invoice Upload" variant="standard" type="file"
              sx={{ margin: 1, padding: 2, width: "300px" }} onChange={(e)=>{formstate.invoice_upload = e.target.value}}/>
            
            
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Payment Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Payment Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.payment_status = e.target.value}}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
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

export default ExpenseModel;