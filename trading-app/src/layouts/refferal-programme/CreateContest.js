import * as React from 'react';
import {useContext, useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { IoMdAddCircle } from 'react-icons/io';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';


import CreateRewardForm from './CreateRewards'
import RewardsData from './data/rewardsData'
import LinkedContestRuleData from './data/contestLinkedRuleData'
import Stack from '@mui/material/Stack';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function CreateContest({createContestForm, setCreateContestForm, oldObjectId, setOldObjectId}) {
  console.log("Old Object Id: ",oldObjectId)
  const [isSubmitted,setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const [contestData,setContestData] = useState([]);
  const [linkedContestRule,setLinkedContestRule] = useState();
  const [formState,setFormState] = useState();
  const [id,setId] = useState(oldObjectId ? oldObjectId : '');
  const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
  const [isLoading,setIsLoading] = useState(id ? true : false)
  const [editing,setEditing] = useState(false)
  const [saving,setSaving] = useState(false)
  const [creating,setCreating] = useState(false)
  const [newObjectId,setNewObjectId] = useState()
  const [contestRules,setContestRules] = useState([])
  const [addRewardObject,setAddRewardObject] = useState(false);

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

const theme = useTheme();
  const [ruleName, setRuleName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRuleName(value)
    setFormState(prevState => ({
      ...prevState,
      contestRule: value
    }))
  };

React.useEffect(()=>{
    // console.log("Inside Use Effect")
    console.log("Inside Use Effect Id & Old Object Id: ",id,oldObjectId)
    axios.get(`${baseUrl}api/v1/referrals/${id}`)
    .then((res)=>{
        setContestData(res?.data?.data);
        console.log("Contest Data in Create Contest Form: ",res?.data?.data)
        // setLinkedContestRule(res?.data?.data?.contestRule._id)
        // setId(res?.data?.data._id)
        setFormState({
            referrralProgramName: res.data.data?.referrralProgramName || '',
            referralProgramStartDate: res.data.data?.referralProgramStartDate || '',
            referralProgramEndDate: res.data.data?.referralProgramEndDate || '',
            rewardPerReferral: res.data.data?.rewardPerReferral || '',
            currency: res.data.data?.currency || '',
            // budget: res.data?.data?.budget || '',
            termsAndConditions: res.data?.data?.termsAndConditions || '',
            description: res.data?.data?.description || '',
            // entryClosingDate: res.data?.data?.entryClosingDate || '',
            performanceMetrics:{
              impressions : res.data?.data?.performanceMetrics?.impressions || '',
              clicks: res.data?.data?.performanceMetrics?.clicks || ''
            },
            status: res.data?.data?.status || '',
            // createdBy: res.data?.data?.createdBy || '',
            lastModifiedBy: res.data?.data?.lastModifiedBy || '',
            lastModifiedOn: res.data?.data?.lastModifiedOn || '',
          });
            
        // setIsLoading(false)
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })
    setTimeout(()=>{setIsLoading(false)},500) 
},[id,isSubmitted])

// React.useEffect(()=>{
//   axios.get(`${baseUrl}api/v1/contestrule`)
//   .then((res)=>{
//     setContestRules(res.data);
//   }).catch((err)=>{
//       return new Error(err)
//   })

//   axios.get(`${baseUrl}api/v1/contestrule/${id}`)
//   .then((res)=>{
//     setContestRules(res.data);
//   }).catch((err)=>{
//       return new Error(err)
//   })
// },[isSubmitted])



async function onSubmit(e,formState){
e.preventDefault()
setCreating(true)
// console.log(formState)
// console.log("New Object Id: ",newObjectId)

// if(
//     !formState?.contestName || !formState?.maxParticipants || !formState?.minParticipants || 
//     !formState?.stockType || !formState?.contestOn || !formState.contestRule || !formState?.contestStartDate || 
//     !formState?.contestEndDate || !formState?.entryOpeningDate || 
//     !formState?.entryClosingDate || !formState?.entryFee?.amount || 
//     !formState?.entryFee?.currency || !formState?.status){

//     setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
//     return openErrorSB("Missing Field","Please fill all the mandatory fields")

// }
// console.log("Is Submitted before State Update: ",isSubmitted)
setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
console.log(formState);
const { referrralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, termsAndConditions, description, performanceMetrics:{impressions,clicks}, status} = formState;
const res = await fetch(`${baseUrl}api/v1/referrals`, {
    method: "POST",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      referrralProgramName, referralProgramStartDate, referralProgramEndDate, rewardPerReferral, currency, termsAndConditions, description, performanceMetrics:{impressions,clicks}, status
    })
});


const data = await res.json();
// console.log(data);
if (data.status === 422 || data.error || !data) {
    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    // console.log("invalid entry");
} else {
    openSuccessSB("Referral Created",data.message)
    setNewObjectId(data.data._id)
    setIsSubmitted(true)
    console.log("setting linked contest rule to: ",data.data.contestRule)
    setLinkedContestRule(data?.data?.contestRule)
    // console.log(data.data)
    setContestData(data.data)
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
}
}

async function onEdit(e,formState){
  const { referrralProgramName, referralProgramEndDate, status} = formState;
  const res = await fetch(`${baseUrl}api/v1/referrals`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        referrralProgramName, referralProgramEndDate, status
      })
  });


  const data = await res.json();
  // console.log(data);
  if (data.status === 422 || data.error || !data) {
      setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
      // console.log("invalid entry");
  } else {
      // openSuccessSB("Contest Edited",data.message)
      // setNewObjectId(data.data._id)
      // setIsSubmitted(true)
      // console.log("setting linked contest rule to: ",data.data.contestRule)
      // setLinkedContestRule(data?.data?.contestRule)
      // // console.log(data.data)
      // setContestData(data.data)
      setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
  }
  setEditing(false)
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


    return (
    <>
    {isLoading ? (
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
      ( 
        <MDBox pl={2} pr={2} mt={6}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Referral Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (editing || saving))}
                id="outlined-required"
                label='Referrral Programme Name *'
                fullWidth
                // defaultValue={contestData?.displayName}
                defaultValue={oldObjectId ? contestData?.referrralProgramName : formState?.referrralProgramName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    referrralProgramName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Referrral Programme Start Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.referralProgramStartDate : setFormState?.referralProgramStartDate)}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          referralProgramStartDate: dayjs(e)
                        }))
                      }}
                      minDateTime={null}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Referrral Programme End Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.referralProgramEndDate : setFormState?.referralProgramEndDate)}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          referralProgramEndDate: dayjs(e)
                        }))
                      }}
                      minDateTime={null}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Reward Per Referral *"
                defaultValue={oldObjectId ? contestData?.rewardPerReferral :formState?.rewardPerReferral}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rewardPerReferral: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={oldObjectId ? contestData?.currency : formState?.currency}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    currency: e.target.value
                }))}}
                label="Currency *"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="CREDOS">CREDOS</MenuItem>
                {/* <MenuItem value="Completed">Completed</MenuItem> */}
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Terms And Conditions *"
                defaultValue={oldObjectId ? contestData?.termsAndConditions :formState?.termsAndConditions}
                fullWidth
                // type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    termsAndConditions: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Description *"
                defaultValue={oldObjectId ? contestData?.description :formState?.description}
                fullWidth
                // type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    description: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Impressions *"
                defaultValue={oldObjectId ? contestData?.performanceMetrics?.impressions :formState?.performanceMetrics?.impressions}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    performanceMetrics: {
                        ...prevState?.performanceMetrics,
                        impressions: e.target.value
                      }
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Clicks *"
                defaultValue={oldObjectId ? contestData?.performanceMetrics?.clicks :formState?.performanceMetrics?.clicks}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    performanceMetrics: {
                        ...prevState?.performanceMetrics,
                        clicks: e.target.value
                      }
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={oldObjectId ? contestData?.status : formState?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
          </Grid>














  

          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {(!isSubmitted && !oldObjectId) && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Next"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || oldObjectId) && !editing && 
                  (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={editing} onClick={(e)=>{setEditing(true)}}>
                    {editing ? <CircularProgress size={20} color="inherit" /> : "Edit"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={editing} onClick={()=>{setCreateContestForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} 
                onClick={(e)=>{onEdit(e,formState)}}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid>


          {/* {isSubmitted && <Grid item xs={12} md={6} xl={12}>
                
                <Grid container spacing={1}>

                <Grid item xs={12} md={6} xl={12} mt={-3} mb={-1}>
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                  Fill in the rank detail and click add
                </MDTypography>
                </Grid>
                
                <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Rank Start *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.rankStart}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            rankStart: e.target.value
                        }))}}
                    />
                </Grid>
    
                <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Rank End *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.rankEnd}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            rankEnd: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Reward *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.reward}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            reward: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={1.35} xl={2.7}>
                  <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={formState?.currency}
                    onChange={(e) => {setFormState(prevState => ({
                      ...prevState,
                      currency: e.target.value
                    }))}}
                    label="Currency"
                    sx={{ minHeight:43 }}
                    >
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="CREDOS">CREDOS</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
    
                <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                    <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddReward(e,formState,setFormState)}}/>
                </Grid>
    
                </Grid>
    
                </Grid>}

          {(isSubmitted || oldObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <RewardsData id={newObjectId} oldObjectId={oldObjectId} addRewardObject={addRewardObject} setAddRewardObject={setAddRewardObject}/>
                </MDBox>
          </Grid>}

          {(isSubmitted || oldObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <LinkedContestRuleData linkedRuleId={linkedContestRule} setLinkedRuleId={setLinkedContestRule} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
                </MDBox>
          </Grid>} */}
            
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