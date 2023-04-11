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
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



function Index({createIndexForm, setCreateIndexForm, id}) {

    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // const getDetails = useContext(userContext);
    // const [indexData,setIndexData] = useState([]);
    const [formState,setFormState] = useState();
    // const [id,setIsObjectNew] = useState(id ? true : false)
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    // const [newObjectId,setNewObjectId] = useState()
    const navigate = useNavigate();

    async function onEdit(e,formState){
        e.preventDefault()
        setSaving(true)
        console.log(formState)
        if(!formState?.referralProgramName || !formState?.referralProgramStartDate || !formState?.referralProgramEndDate || !formState?.rewardPerReferral || !formState?.currency || !formState?.status){
            setTimeout(()=>{setSaving(false);setEditing(true)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { referralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, status, description } = formState;

        const res = await fetch(`${baseUrl}api/v1/referrals`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                referralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, status, description})
            });

        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error",data.error)
        } else {
            openSuccessSB("Referral Saved",data.referralProgramName)
            setTimeout(()=>{setSaving(false);setEditing(false)},500)
            console.log("entry succesfull");
        }
    }
    
    async function onSubmit(e,formState){
        e.preventDefault()
        setSaving(true)
        console.log(formState)
        
        if(!formState?.referralProgramName || !formState?.referralProgramStartDate || !formState?.referralProgramEndDate || !formState?.rewardPerReferral || !formState?.currency || !formState?.status){
            setTimeout(()=>{setSaving(false)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { referralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, status, description } = formState;
        const res = await fetch(`${baseUrl}api/v1/referrals`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                referralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, status, description
            })
        });
  
        const response = await res.json();
        console.log(response);
        if (response) {
            console.log(response)
            openSuccessSB("Referral Program Created", response.data.referralProgramName + '|' + response.data.referralProgramName)
            // setNewObjectId(data.data)
            setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
            
        } else {
            // window.alert(data.error);
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            openErrorSB("Error",response.message)
            console.log("invalid entry");
        }
    }

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
    // console.log("Id:",id)

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
          Referral Program Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} mb={0}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Referral Program Name *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.referralProgramName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    referralProgramName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Referral Program Start Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(formState?.referralProgramStartDate)}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {console.log(dayjs(e));setFormState(prevState => ({
                    ...prevState,
                    referralProgramStartDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Referral Program End Date"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(formState?.referralProgramEndDate)}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {console.log(dayjs(e));setFormState(prevState => ({
                    ...prevState,
                    referralProgramEndDate: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Reward Per Referral *'
                type="number"
                defaultValue={formState?.rewardPerReferral}
                fullWidth
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rewardPerReferral: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Reward Currency *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                // value={oldObjectId ? contestData?.portfolioType : formState?.portfolioType}
                value={formState?.currency}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    currency: e.target.value
                }))}}
                label="Reward Currency"
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
                // value={oldObjectId ? contestData?.status : formState?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled
                id="outlined-required"
                label='Referral Program ID *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.referralProgramId}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled
                id="outlined-required"
                label='Created By *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.createdBy}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={12}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Description *'
                fullWidth
                // defaultValue={indexData?.displayName}
                value={formState?.description}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    description: e.target.value
                  }))}}
                multiline
                rows={4}
              />
          </Grid>
            
        </Grid>
        <Grid mt={2}>
            <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                    {!isSubmitted && !id && (
                    <>
                    <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                        {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/referralProgramme")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{setIsSubmitted(false)}}>
                        Back
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setEditing(false)}}>
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
export default Index;