import * as React from 'react';
import {useContext, useState} from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import DefaultCarouselImage from '../../assets/images/defaultcarousel.png'
import OutlinedInput from '@mui/material/OutlinedInput';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: "100%",
    },
  },
};


function Index() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    let [photo,setPhoto] = useState(DefaultCarouselImage)
    const [objectName, setObjectName] = React.useState([]);
    const [objects,setObjects] = React.useState([]);
    const location = useLocation();
    const  id  = location?.state?.data;
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [formState,setFormState] = useState({
        carouselName:'',
        description:'',
        carouselStartDate:'',
        carouselEndDate:'',
        carouselImage:'',
        status:'',
        objectType:'',
        objectId:'',
    });

    console.log("id is", location)

    const handleChange = (event) => {
        console.log(event)
        const {
          target: { value },
        } = event;
        setObjectName(value)
        console.log("Value set as: ",value)
        console.log(objects);
        setFormState(prevState => ({
          ...prevState,
          objectId: value
        }))
      };
    
    const handleChangeObjectType = (name) => {
    if(name === 'Referral'){
        //set only active Referrals
        setObjects([{_id: '1234345',name:'Referral 1'},{_id: '23421', name:'Referral 2'},{_id: '5456', name:'Referral 3'}])
        // handleChange();

    }
    if(name === 'Contest'){
        //set only active Contests
        setObjects([{_id: '1234345',name:'Contest 1'},{_id: '23421', name:'Contest 2'},{_id: '5456', name:'Contest 3'}])
    }
    if(name === 'Campaign'){
        //set only active Campaigns
        setObjects([{_id: '1234345',name:'Campaign 1'},{_id: '23421', name:'Campaign 2'},{_id: '5456', name:'Campaign 3'}])
    }
    }

    async function onSubmit(e,formState){
        e.preventDefault();
        console.log(formState);
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
          Fill Carousel Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={9}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Carousel Name *'
                fullWidth
                // defaultValue={portfolioData?.portfolioName}
                value={formState?.carouselName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    carouselName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Carousel Start Date"
                    //   disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(setFormState?.carouselStartDate)}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          carouselStartDate: dayjs(e)
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
                    //  disabled={((isSubmitted || id) && (!editing || saving))}
                        defaultValue={dayjs(setFormState?.carouselEndDate)}
                        onChange={(e) => {
                            setFormState(prevState => ({
                            ...prevState,
                            carouselEndDate: dayjs(e)
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
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Carousel Type *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                // value={oldObjectId ? contestData?.portfolioType : formState?.portfolioType}
                value={formState?.objectType}
                // disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {handleChangeObjectType(e.target.value);setFormState(prevState => ({
                    ...prevState,
                    objectType: e.target.value
                }))
                }}
                label="Object Type"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Campaign">Campaign</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
                <MenuItem value="Contest">Contest</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          
          <Grid item xs={12} md={3} xl={3}>
                <FormControl sx={{minWidth: "100%" }} >
                  <InputLabel id="demo-multiple-name-label">Carousel Of</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    // defaultValue={objects[0]?.name}
                    onChange={handleChange}
                    input={<OutlinedInput label="Carousel Of" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {objects?.map((e) => (
                      <MenuItem
                        key={e?.name}
                        value={e?._id}
                        // style={getStyles(rule, ruleName, theme)}
                      >
                        {e.name}
                      </MenuItem>
                    ))}
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
                // disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    status: e.target.value
                }))}}
                label="Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Live">Live</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <MDButton variant="outlined" style={{fontSize:10}} fullWidth color="success" component="label">
                {!formState?.carouselImage?.name ? "Upload Carousel Image" : "Upload Another File?"}
                <input 
                hidden 
                // disabled={!editablePD}
                accept="image/*" 
                type="file" 
                defaultValue={formState?.carouselImage}
                onChange={(e)=>{
                  setFormState(prevState => ({
                    ...prevState,
                    carouselImage: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          <Grid item xs={12} md={6} xl={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <TextField
                    disabled
                    id="outlined-required"
                    // label='Selected Carousel Image'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.carouselImage?.name ? formState?.carouselImage?.name : "No Image Uploaded"}
                />
          </Grid>

          <Grid item xs={12} md={6} xl={12} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Description *'
                fullWidth
                multiline
                // defaultValue={portfolioData?.portfolioName}
                value={formState?.description}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    description: e.target.value
                  }))}}
              />
          </Grid>
            
        </Grid>

        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={3}>
            <Grid item xs={12} md={6} lg={12}>
            <img src={photo} style={{height:"auto", width:"100%",borderRadius:"5px", border:"1px #ced4da solid"}}></img>
            </Grid>
        </Grid>
        </Grid>

         <Grid container mt={2} xs={12} md={12} xl={12} >
            <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                    {!isSubmitted && !id && (
                    <>
                    <MDButton 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        sx={{mr:1, ml:2}} 
                        disabled={creating} 
                        onClick={(e)=>{onSubmit(e,formState)}}
                        >
                        {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/carousel")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{id ? navigate("/portfolio") : setIsSubmitted(false)}}>
                        Back
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && editing && (
                    <>
                    <MDButton 
                        variant="contained" 
                        color="warning" 
                        size="small" 
                        sx={{mr:1, ml:2}} 
                        disabled={saving} 
                        // onClick={(e)=>{onEdit(e,formState)}}
                        >
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton 
                        variant="contained" 
                        color="error" 
                        size="small" 
                        disabled={saving} 
                        // onClick={()=>{setEditing(false)}}
                        >
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