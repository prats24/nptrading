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
import {useState, useContext} from "react"



const UserModel = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [formstate, setformstate] = useState({
    Name:"",
    Designation:"",
    EmailID:"",
    MobileNo:"",
    Degree:"",
    DOB:"",
    Gender:"",
    TradingExp:"",
    Location:"",
    LastOccupation :"",
    DateofJoining :"",
    Role:"",
    userPassword:"",
    Status:"",
    employeeId: ""
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
    
  const getDetails = useContext(userContext);
  let uId = uniqid();
  let date = new Date();
  let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
  let lastModified = createdOn;
  let createdBy = getDetails.userDetails.name

  const [reRender, setReRender] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  async function formSubmit() {
    setformstate(formstate);
    //console.log(formstate)

    const { Name, Designation, EmailID, MobileNo, Degree, DOB, Gender, TradingExp, Location, LastOccupation , DateofJoining, Role, Status, userPassword, employeeId} = formstate;

    const res = await fetch(`${baseUrl}api/v1/userdetail`, {
      
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          name:Name, designation:Designation, email:EmailID, mobile:MobileNo, degree:Degree, dob:DOB, gender:Gender, trading_exp:TradingExp, location:Location,
          last_occupation:LastOccupation , joining_date:DateofJoining, role:Role, status:Status, uId, createdBy, createdOn, lastModified, password: userPassword, employeeId
        })
    });


    const data = await res.json();
    //console.log(data);
    if(data.status === 422 || data.error || !data){ 
        window.alert(data.error);
        //console.log("Invalid Entry");
    }else{
        window.alert("User Created Successfully");
        //console.log("entry succesfull");
    }
    setOpen(false);
    reRender ? setReRender(false) : setReRender(true)

}

  return (
    <div>
      <MDButton variant="outlined" onClick={handleClickOpen}>
        Create User
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
              id="outlined-basic" label="Name" variant="standard"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.Name = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Designation" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.Designation = e.target.value}}/>
            

            <TextField
              id="outlined-basic" label="Email ID" variant="standard" type="email"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.EmailID = e.target.value}}/>

            
            <TextField
              id="outlined-basic" label="MobileNo" variant="standard" type="number" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.MobileNo = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Degree" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.Degree = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="DOB" variant="standard" type="date"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.DOB = e.target.value}}/>
            
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.Gender = e.target.value}}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
               <TextField
              id="outlined-basic" label="Trading Exp." variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.TradingExp = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="Location" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.Location = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="Last Occupation" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.LastOccupation = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Date of Joining" variant="standard" type="date"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.DateofJoining = e.target.value}}/>
            
            <TextField
              id="outlined-basic" label="Role" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.Role = e.target.value}}/>

            <TextField
              id="outlined-basic" label="User Password" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.userPassword = e.target.value}}/>

            <TextField
              id="outlined-basic" label="Employee ID" variant="standard" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{formstate.employeeId = e.target.value}}/>



            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{formstate.Status = e.target.value}}
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

export default UserModel;