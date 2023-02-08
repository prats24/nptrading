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
import {useState, useRef, useEffect} from "react"
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from "axios";




const UserModel = ({data, id, Render}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
let permissionId = useRef(0);
let date = new Date();
let lastModified = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

const {reRender, setReRender} = Render;
const[editData, setEditData] = useState(data);

const [name, setName] = useState();
const [designation, setDesignation] = useState();
const [email, setEmail] = useState();
const [dob, setDob] = useState();
const [mobile, setMobile] = useState();
const [gender, setGender] = useState();
const [trading_exp, setTradingExp] = useState();
const [location, setLocation] = useState();
const [lastOccupation, setLastOccupation] = useState();
const [joiningDate, setJoiningDate] = useState();
const [role, setRole] = useState();
const [status, setStatus] = useState();
const [degree, setDegree] = useState();
const [pass, setPass] = useState();
const [employeeid, setemployeeId] = useState();

    useEffect(()=>{

        let updatedData = data.filter((elem)=>{
            return elem._id === id
        })
        setEditData(updatedData)

        axios.get(`${baseUrl}api/v1/readpermission`)
        .then((res)=>{
            (res.data).map((elem)=>{
                if(editData[0].email === elem.userId){
                    permissionId.current = elem._id;
                }
            })
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])

    useEffect(()=>{
        //console.log("edit data", editData);

        setName(editData[0].name)
        setDesignation(editData[0].designation);
        setEmail(editData[0].email);
        setMobile(editData[0].mobile);
        setDegree(editData[0].degree);
        setDob(editData[0].dob);
        setGender(editData[0].gender);
        setTradingExp(editData[0].trading_exp);
        setLocation(editData[0].location);
        setLastOccupation(editData[0].last_occupation);
        setJoiningDate(editData[0].joining_date);
        setRole(editData[0].role);
        setStatus(editData[0].status);
        setemployeeId(editData[0].employeeid)

    }, [editData, reRender])

    //console.log(editData, id);
    //console.log(editData[0].name, name);
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

//console.log(formstate);


async function formbtn() {

    formstate.Name = name;
    formstate.Designation = designation;
    formstate.Degree = degree;
    formstate.EmailID = email;
    formstate.MobileNo = mobile;
    formstate.DOB = dob;
    formstate.Gender = gender;
    formstate.TradingExp = trading_exp;
    formstate.Location = location;
    formstate.LastOccupation = lastOccupation;
    formstate.DateofJoining = joiningDate;
    formstate.Role = role;
    formstate.Status = status;
    formstate.userPassword = pass;
    formstate.employeeId = employeeid;

    setformstate(formstate);


    const { Name, Designation, Degree, EmailID, MobileNo, DOB, Gender, TradingExp, Location, LastOccupation, DateofJoining, Role, Status, userPassword, employeeId } = formstate;

    const res = await fetch(`${baseUrl}api/v1/readuserdetails/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            Name, Designation, Degree, EmailID, MobileNo, DOB, Gender, TradingExp, Location, LastOccupation, DateofJoining, Role, Status, lastModified, userPassword, employeeId
        })
    });


    const dataResp = await res.json();
    
    //console.log(dataResp);
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        window.alert(dataResp.error);
        //console.log("Failed to Edit");
    }else {
        //console.log(dataResp);
        window.alert("Edit succesfull");
        //console.log("Edit succesfull");
    }
    setOpen(false);
    reRender ? setReRender(false) : setReRender(true)
}

async function Ondelete(){
  //console.log(editData)
  const res = await fetch(`${baseUrl}api/v1/readuserdetails/${id}`, {
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
          <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="outlined-basic" label="Name" variant="standard" value={name}
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setName( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Designation" variant="standard" value={designation} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setDesignation( e.target.value)}}/>
            

            <TextField
              id="outlined-basic" label="Email ID" variant="standard" value={email} type="email"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setEmail( e.target.value)}}/>

            
            <TextField
              id="outlined-basic" label="MobileNo" variant="standard" value={mobile} type="number" 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setMobile( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Degree" variant="standard" value={degree} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setDegree( e.target.value)}}/>
            
            <TextField
              id="outlined-basic" label="DOB" variant="standard" value={dob} type="date"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setDob( e.target.value)}}/>
            
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Gender"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{setGender( e.target.value)}}
                value={gender} 
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
               <TextField
              id="outlined-basic" label="Trading Exp." variant="standard" value={trading_exp}  
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setTradingExp( e.target.value)}}/>
            
            <TextField
              id="outlined-basic" label="Location" variant="standard" value={location}  
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setLocation( e.target.value)}}/>
            
            <TextField
              id="outlined-basic" label="Last Occupation" variant="standard" value={lastOccupation}  
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setLastOccupation( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Date of Joining" variant="standard" value={joiningDate}  type="date"
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setJoiningDate( e.target.value)}}/>
            
            <TextField
              id="outlined-basic" label="Role" variant="standard" value={role}  
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setRole( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="User Password" variant="standard" value={pass}  
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setPass( e.target.value)}}/>

            <TextField
              id="outlined-basic" label="Employee Id" variant="standard" value={employeeid} 
              sx={{ margin: 1, padding: 1, width: "300px" }} onChange={(e)=>{setemployeeId( e.target.value)}}/>




            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Status"
                sx={{ margin: 1, padding: 1, width: "300px" }}
                onChange={(e)=>{setStatus( e.target.value)}}
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

export default UserModel;