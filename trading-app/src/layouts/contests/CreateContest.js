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


function CreateContest({createContestForm, setCreateContestForm, oldObjectId, setOldObjectId, setCreateContestFormCard}) {
  // console.log("Old Object Id: ",oldObjectId)
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
    // console.log("Inside Use Effect Id & Old Object Id: ",id,oldObjectId)
    axios.get(`${baseUrl}api/v1/contest/${id}`)
    .then((res)=>{
        setContestData(res?.data?.data);
        console.log("Contest Data in Create Contest Form: ",res?.data?.data)
        setLinkedContestRule(res?.data?.data?.contestRule._id)
        // setId(res?.data?.data._id)
        setFormState({
            contestName: res.data.data?.contestName || '',
            maxParticipants: res.data.data?.maxParticipants || '',
            minParticipants: res.data.data?.minParticipants || '',
            stockType: res.data.data?.stockType || 'Options',
            contestOn: res.data.data?.contestOn || '',
            contestStartDate: res.data?.data?.contestStartDate || '',
            contestEndDate: res.data?.data?.contestEndDate || '',
            entryOpeningDate: res.data?.data?.entryOpeningDate || '',
            entryClosingDate: res.data?.data?.entryClosingDate || '',
            entryFee:{
                amount : res.data?.data?.entryFee?.amount || '',
                currency: res.data?.data?.entryFee?.currency || ''
            },
            contestRule: res.data?.data?.contestRule || '',
            status: res.data?.data?.status || 'Live',
            createdBy: res.data?.data?.createdBy || '',
            lastModifiedBy: res.data?.data?.lastModifiedBy || '',
            lastModifiedOn: res.data?.data?.lastModifiedOn || '',
            contestMargin: res.data?.data?.contestMargin || '',
          });
            setTimeout(()=>{setIsLoading(false)},500) 
        // setIsLoading(false)
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })

},[id,isSubmitted])

React.useEffect(()=>{
  axios.get(`${baseUrl}api/v1/contestrule`)
  .then((res)=>{
    setContestRules(res.data);
  }).catch((err)=>{
      return new Error(err)
  })

  axios.get(`${baseUrl}api/v1/contestrule/${id}`)
  .then((res)=>{
    setContestRules(res.data);
  }).catch((err)=>{
      return new Error(err)
  })
},[isSubmitted])



async function onSubmit(e,formState){
e.preventDefault()
setCreating(true)
// console.log(formState)
// console.log("New Object Id: ",newObjectId)

if(
    !formState?.contestName || !formState?.maxParticipants || !formState?.minParticipants || 
    !formState?.stockType || !formState?.contestOn || !formState.contestRule || !formState?.contestStartDate || 
    !formState?.contestEndDate || !formState?.entryOpeningDate || 
    !formState?.entryClosingDate || !formState?.entryFee?.amount || 
    !formState?.entryFee?.currency || !formState?.status){

    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    return openErrorSB("Missing Field","Please fill all the mandatory fields")

}
// console.log("Is Submitted before State Update: ",isSubmitted)
setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
const { contestName, contestRule, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status, contestMargin} = formState;
const res = await fetch(`${baseUrl}api/v1/contest`, {
    method: "POST",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
        contestName, contestRule, maxParticipants, minParticipants, stockType, contestOn, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, entryFee:{amount,currency}, status, contestMargin
    })
});


const data = await res.json();
// console.log(data);
if (data.status === 422 || data.error || !data) {
    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    // console.log("invalid entry");
} else {
    openSuccessSB("Contest Created",data.message)
    setNewObjectId(data.data._id)
    setIsSubmitted(true)
    console.log("setting linked contest rule to: ",data.data.contestRule)
    setLinkedContestRule(data?.data?.contestRule)
    // console.log(data.data)
    setContestData(data.data)
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
}
}

async function onAddReward(e,childFormState,setChildFormState){
  e.preventDefault()
  setSaving(true)
  // console.log("Reward Child Form State: ",childFormState)
  // console.log("New Object Id in Add Reward Function: ",newObjectId)
  if(!childFormState?.rankStart || !childFormState?.rankEnd || !childFormState?.reward 
    || !childFormState?.currency
    )
  {
      setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
      return openErrorSB("Missing Field","Please fill all the mandatory fields")
  }
  const {rankStart, rankEnd, reward, currency} = childFormState;

  const res = await fetch(`${baseUrl}api/v1/contest/${newObjectId}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        rewards:{rankStart, rankEnd, reward, currency}
      })
  });
  const data = await res.json();
  // console.log(data);
  if (data.status === 422 || data.error || !data) {
      openErrorSB("Error","data.error")
  } else {
      openSuccessSB("New Reward Added","New Reward line item has been added in the contest")
      setTimeout(()=>{setSaving(false);setEditing(false)},500)
      setAddRewardObject(!addRewardObject);
      // console.log("Entry Succesfull");
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

// console.log("Saving: ",saving)
// console.log("Editing: ",editing)
// console.log("Id:",newObjectId)
console.log("Old Object Id: ",oldObjectId)
// console.log("Is Submitted after State Update: ",isSubmitted)
console.log("Linked Contest Rule Id: ",linkedContestRule)
console.log("Rule Name: ",contestData?.contestRule?.ruleName)

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
          Contest Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Contest Name *'
                fullWidth
                // defaultValue={contestData?.displayName}
                defaultValue={oldObjectId ? contestData?.contestName : formState?.contestName}
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
                defaultValue={oldObjectId ? contestData.maxParticipants : formState?.maxParticipants}
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
                defaultValue={oldObjectId ? contestData.minParticipants :formState?.minParticipants}
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
                defaultValue={oldObjectId ? contestData.stockType :formState?.stockType}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    stockType: e.target.value
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
                defaultValue={oldObjectId ? contestData?.contestOn : formState?.contestOn}
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
                defaultValue={oldObjectId ? contestData?.entryFee?.amount :formState?.entryFee?.amount}
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
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Contest Margin *"
                defaultValue={oldObjectId ? contestData?.entryFee?.amount :formState?.entryFee?.amount}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                  ...prevState,
                  contestMargin: e.target.value
                }))}}
                />
            </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={oldObjectId ? contestData?.entryFee?.currency : formState?.entryFee?.currency}
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
                value={oldObjectId ? contestData?.status : formState?.status}
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
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Contest Start Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.contestStartDate : setFormState?.contestStartDate)}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          contestStartDate: dayjs(e)
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
                      label="Contest End Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.contestEndDate : setFormState?.contestEndDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        contestEndDate: dayjs(e)
                      }))}}
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
                      label="Entry Open Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.entryOpeningDate : setFormState?.entryOpeningDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        entryOpeningDate: dayjs(e)
                      }))}}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Entry Close Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? contestData?.entryClosingDate : setFormState?.entryClosingDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        entryClosingDate: dayjs(e)
                      }))}}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>

          </Grid>
                
          <Grid item xs={12} md={3} xl={6} mb={-3}>
                <FormControl sx={{ minHeight:10, minWidth:245 }}>
                  <InputLabel id="demo-multiple-name-label">Contest Rule</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    defaultValue={oldObjectId ? contestData?.contestRule?.ruleName : ruleName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Contest Rule" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {contestRules?.map((rule) => (
                      <MenuItem
                        key={rule?.ruleName}
                        value={rule?._id}
                        // style={getStyles(rule, ruleName, theme)}
                      >
                        {rule.ruleName}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
          </Grid>


          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Next"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={editing} onClick={(e)=>{setEditing(true)}}>
                    {editing ? <CircularProgress size={20} color="inherit" /> : "Edit"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={editing} onClick={()=>{setCreateContestFormCard(false); setCreateContestForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} 
                // onClick={(e)=>{onEdit(e,formState)}}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateContestForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid>

          {isSubmitted && <Grid item xs={12} md={6} xl={12}>
                
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
          </Grid>}
            
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