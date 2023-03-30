import * as React from 'react';
import {useContext, useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Tooltip } from '@mui/material';
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import {userContext} from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



function CreateContest({createContestForm, setCreateContestForm, id}) {
const [isSubmitted,setIsSubmitted] = useState(false);
const getDetails = useContext(userContext);
const [indexData,setContestData] = useState([]);
const [formState,setFormState] = useState();
const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
const [isLoading,setIsLoading] = useState(id ? true : false)
const [editing,setEditing] = useState(false)
const [saving,setSaving] = useState(false)
const [creating,setCreating] = useState(false)
const [newObjectId,setNewObjectId] = useState()

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

React.useEffect(()=>{

    axios.get(`${baseUrl}api/v1/contest/${id}`)
    .then((res)=>{
        setContestData(res.data[0]);
        // console.log(res.data[0])
        setFormState({
            contestName: res.data[0]?.contestName || '',
            maxParticipants: res.data[0]?.maxParticipants || '',
            minParticipants: res.data[0]?.minParticipants || '',
            stockType: res.data[0]?.stockType || '',
            contestOn: res.data[0]?.contestOn || '',
            contestStartDate: res.data[0]?.contestStartDate || '',
            contestEndDate: res.data[0]?.contestEndDate || '',
            entryOpeningDate: res.data[0]?.entryOpeningDate || '',
            entryClosingDate: res.data[0]?.entryClosingDate || '',
            entryFee:{
                amount : res.data[0]?.entryFee?.amount || '',
                currency: res.data[0]?.entryFee?.amcurrencyount || ''
            },
            status: res.data[0]?.status || '',
            createdBy: res.data[0]?.createdBy || '',
            lastModifiedBy: res.data[0]?.lastModifiedBy || '',
            lastModifiedOn: res.data[0]?.lastModifiedOn || '',
          });
            setTimeout(()=>{setIsLoading(false)},500) 
        // setIsLoading(false)
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })

},[])

async function onEdit(e,formState){
    e.preventDefault()
    setSaving(true)
    console.log(formState)
    if(
        !formState?.contestName || !formState?.maxParticipants || !formState?.minParticipants || 
        !formState?.stockType || !formState?.contestOn || !formState?.contestStartDate || 
        !formState?.contestEndDate || !formState?.entryOpeningDate || 
        !formState?.entryClosingDate || !formState?.entryFee?.amount || 
        !formState?.entryFee?.currency || !formState?.status){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    
    }
    const { contestName, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status} = formState;

    const res = await fetch(`${baseUrl}api/v1/contest/${id ? id : newObjectId}`, {
        method: "PUT",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            contestName, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status
        })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error","data.error")
    } else {
        openSuccessSB("Index Edited",data.contestName + " | " + data.minParticipants + " | " + data.maxParticipants + " | " + data.status)
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        console.log("entry succesfull");
    }
  }



async function onSubmit(e,formState){
e.preventDefault()
setCreating(true)
console.log(formState)

if(
    !formState?.contestName || !formState?.maxParticipants || !formState?.minParticipants || 
    !formState?.stockType || !formState?.contestOn || !formState?.contestStartDate || 
    !formState?.contestEndDate || !formState?.entryOpeningDate || 
    !formState?.entryClosingDate || !formState?.entryFee?.amount || 
    !formState?.entryFee?.currency || !formState?.status){

    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    return openErrorSB("Missing Field","Please fill all the mandatory fields")

}
const { contestName, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status} = formState;
const res = await fetch(`${baseUrl}api/v1/contest`, {
    method: "POST",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
        contestName, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status
    })
});

const data = await res.json();
console.log(data);
if (data.status === 422 || data.error || !data) {
    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    console.log("invalid entry");
} else {
    openSuccessSB("Contest Created",data.status)
    setNewObjectId(data.data)
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
}
}
const date = new Date(indexData.lastModifiedOn);

const formattedLastModifiedOn = `${date.getUTCDate()}/${date.toLocaleString('default', { month: 'short' })}/${String(date.getUTCFullYear())} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;



const [title,setTitle] = useState('')
const [content,setContent] = useState('')

const [successSB, setSuccessSB] = useState(false);
const openSuccessSB = (title,content) => {
setTitle(title)
setContent(content)
setSuccessSB(true);
}
const closeSuccessSB = () => setSuccessSB(false);
// console.log("Title, Content, Time: ",title,content,time)


const renderSuccessSB = (
<MDSnackbar
    color="success"
    icon="check"
    title={title}
    content={content}
    open={successSB}
    onClose={closeSuccessSB}
    close={closeSuccessSB}
    bgWhite="info"
/>
);

const [errorSB, setErrorSB] = useState(false);
const openErrorSB = (title,content) => {
setTitle(title)
setContent(content)
setErrorSB(true);
}
const closeErrorSB = () => setErrorSB(false);

const renderErrorSB = (
<MDSnackbar
    color="error"
    icon="warning"
    title={title}
    content={content}
    open={errorSB}
    onClose={closeErrorSB}
    close={closeErrorSB}
    bgWhite
/>
);

console.log("Saving: ",saving)
console.log("Editing: ",editing)
console.log("Id:",id)

    return (
    <>
    {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
        </MDBox>
    )
        :
      ( 
        <MDBox pl={2} pr={2} mt={4}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Contest Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Contest Name *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.contestName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    contestName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Max. No. Participants *'
                defaultValue={formState?.maxParticipants}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    maxParticipants: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Min. No. Participants *"
                defaultValue={formState?.minParticipants}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    minParticipants: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Stock Type *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                defaultValue={formState?.stockType}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Options">Options</MenuItem>
                <MenuItem value="Futures">Futures</MenuItem>
                <MenuItem value="Equity">Equity</MenuItem>
                <MenuItem value="Derivative">Derivative</MenuItem>
                <MenuItem value="Currency">Currency</MenuItem>
                <MenuItem value="Crypto">Crypto</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Contest On *"
                defaultValue={formState?.contestOn}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    contestOn: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Entry Fee Amount *"
                defaultValue={formState?.entryFee?.amount}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    entryFee: {
                        ...prevState?.entryFee,
                        amount: e.target.value
                      }
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.entryFee?.currency}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    entryFee: {
                        ...prevState?.entryFee,
                        currency: e.target.value
                      }
                }))}}
                label="Currency"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="CREDOS">CREDOS</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Live">Live</MenuItem>
                <MenuItem value="Not Live">Not Live</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Contest Start Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(setFormState.contestStartDate)}
                  onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    contestStartDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Contest End Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(setFormState.contestEndDate)}
                  onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    contestEndDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Entry Opening Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(setFormState.entryOpeningDate)}
                  onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    entryOpeningDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Entry Closing Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(setFormState.entryClosingDate)}
                  onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    entryClosingDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          {/* <Grid item xs={12} md={6} xl={3}></Grid>
          <Grid item xs={12} md={6} xl={3}></Grid> */}
          <Grid item xs={12} md={6} xl={6}>
            {isObjectNew &&
            <>
            <MDBox style={{fontSize:10}}>
                Last Modified By: {indexData?.lastModifiedBy?.first_name} {indexData?.lastModifiedBy?.last_name}
            </MDBox>
            <MDBox style={{fontSize:10}}>
                Last Modified On: {formattedLastModifiedOn}
            </MDBox>
            </>}
          </Grid>
          

          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                    Edit
                </MDButton>
                <MDButton variant="contained" color="info" size="small" onClick={()=>{setCreateContestForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid>
            
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
export default CreateContest;