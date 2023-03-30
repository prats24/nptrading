import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Tooltip } from '@mui/material';
import Icon from "@mui/material/Icon";
import { userContext } from "../../../../AuthContext";
import MDAvatar from "../../../../components/MDAvatar";
import MDSnackbar from "../../../../components/MDSnackbar";
import axios from "axios";

import { useState, useContext, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { MdModeEditOutline } from 'react-icons/md';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import Button from '@mui/material/Button';
import MDTypography from "../../../../components/MDTypography";
import { Divider, Typography } from '@mui/material';

function MyProfile({profilePhoto,setProfilePhoto}) {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [editablePD, setEditablePD] = useState(false);
  const [editableBD, setEditableBD] = useState(false);
  const [editableKYC, setEditableKYC] = useState(false);
  const getDetails = useContext(userContext);

  const blankImageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='130px'%3E%3Crect width='100%' height='130px' fill='lightgrey'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='15px' fill='black'%3EDocument Preview%3C/text%3E%3C/svg%3E`;

  const [formStatePD,setFormStatePD] = React.useState(
    {
      employeeid:getDetails?.userDetails?.employeeid || '',
      first_name:getDetails?.userDetails?.first_name || '',
      last_name:getDetails?.userDetails?.last_name || '',
      email:getDetails?.userDetails?.email || '',
      mobile:getDetails?.userDetails?.mobile || '',
      whatsApp_number:getDetails?.userDetails?.whatsApp_number || '',
      gender:getDetails?.userDetails?.gender,
      designation:getDetails?.userDetails?.designation || '',
      degree:getDetails?.userDetails?.degree || '',
      last_occupation:getDetails?.userDetails?.last_occupation || '',
      address:getDetails?.userDetails?.address || '',
      city:getDetails?.userDetails?.city || '',
      pincode:getDetails?.userDetails?.pincode || '',
      state:getDetails?.userDetails?.state || '',
      country:getDetails?.userDetails?.country || '',
      dob:getDetails?.userDetails?.dob || '',
      joining_date:getDetails?.userDetails?.joining_date || '',
      family_yearly_income:getDetails?.userDetails?.family_yearly_income || '',
      profilePhoto:getDetails?.userDetails?.profilePhoto || '',
      profilePhotoPreview:"",
    }
  );

  const [formStateBD,setFormStateBD] = React.useState(
    {
      upiId:getDetails?.userDetails?.upiId || '',
      googlePay_number:getDetails?.userDetails?.googlePay_number || '',
      phonePe_number:getDetails?.userDetails?.phonePe_number || '',
      payTM_number:getDetails?.userDetails?.payTM_number || '',
      nameAsPerBankAccount:getDetails?.userDetails?.nameAsPerBankAccount || '',
      bankName:getDetails?.userDetails?.bankName || '',
      accountNumber:getDetails?.userDetails?.accountNumber || '',
      ifscCode:getDetails?.userDetails?.ifscCode || '',
    }
  );

  const [formStateKYC,setFormStateKYC] = React.useState(
    {
      aadhaarNumber:getDetails?.userDetails?.aadhaarNumber || '',
      panNumber:getDetails?.userDetails?.panNumber || '',
      passportNumber:getDetails?.userDetails?.passportNumber || '',
      drivingLicenseNumber:getDetails?.userDetails?.drivingLicenseNumber || '',
      aadhaarCardFrontImage:getDetails?.userDetails?.aadhaarCardFrontImage || '',
      aadhaarCardBackImage:getDetails?.userDetails?.aadhaarCardBackImage || '',
      panCardFrontImage:getDetails?.userDetails?.panCardFrontImage || '',
      passportPhoto:getDetails?.userDetails?.passportPhoto || '',
      addressProofDocument:getDetails?.userDetails?.addressProofDocument || '',
      aadhaarCardFrontPreview:"",
      aadhaarCardBackPreview:"",
      panCardFrontPreview:"",
      passportPhotoPreview:"",
      addressProofDocumentPreview:"",
      KYCStatus:getDetails?.userDetails?.KYCStatus || '',
    }
  );

  // console.log(formStatePD)
  // console.log(formStateBD)
  // console.log(formStateKYC)

  async function formSubmit(data,section){
    console.log(data)
    try{
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
       if(key!="KYCStatus")
        formData.append(key, data[key])
      });
      if(section==="KYC Details"){
        formData.append("KYCStatus","Pending Approval")
        setFormStateKYC(formStateKYC.KYCStatus,"Pending Approval")
      }

      const res = await fetch(`${baseUrl}api/v1/userdetail/me`, {
      
        method: "PATCH",
        credentials:"include",
        headers: {
            "Access-Control-Allow-Credentials": true
        },
        body: formData 
    });
      let response = await res.json()
      console.log('response', response);
      if(response.status === 'success'){
        openSuccessSB(section)
        // window.alert("Personal Details Updated")
      }
      
    }catch(e){
      console.log(e);
    }
  }

  const handleFileSelect = (event,fieldName) => {
    console.log(event)
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileDataUrl = reader.result;
        const fileBlob = dataURLtoBlob(fileDataUrl);
        const newFile = new File([fileBlob], selectedFile.name, { type: selectedFile.type });
        // console.log("New file object:", newFile);
        console.log(reader.result);
        if(fieldName === "profilePhoto"){
          setFormStatePD(prevState => ({
            ...prevState,
            profilePhotoPreview: reader.result,
            profilePhoto:event.target.files[0],
          }));
          setProfilePhoto(reader.result);
        }
        if(fieldName === "aadhaarCardFront"){
          setFormStateKYC(prevState => ({
            ...prevState,
            aadhaarCardFrontPreview: reader.result,
            aadhaarCardFrontImage:event.target.files[0],
          }))
        }
        if(fieldName === "aadhaarCardBack"){
          setFormStateKYC(prevState => ({
            ...prevState,
            aadhaarCardBackPreview: reader.result,
            aadhaarCardBackImage:event.target.files[0],
          }))
        }
        if(fieldName === "panCardFront"){
          setFormStateKYC(prevState => ({
            ...prevState,
            panCardFrontPreview: reader.result,
            panCardFrontImage:event.target.files[0],
          }))
        }
        if(fieldName === "passportPhoto"){
          setFormStateKYC(prevState => ({
            ...prevState,
            passportPhotoPreview: reader.result,
            passportPhoto:event.target.files[0],
          }))
        }
        if(fieldName === "addressProofDocument"){
          setFormStateKYC(prevState => ({
            ...prevState,
            addressProofDocument: reader.result,
            addressProofDocument:event.target.files[0],
          }))
        }
        
        
      };
      reader.readAsDataURL(selectedFile);
      
    }
  };
  


  // Helper function to convert data URL to Blob object
  function dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  function onRemove(fieldPreview){

    if(fieldPreview === "profilePhoto"){
      setFormStatePD(prevState => ({
        ...prevState,
        profilePhotoPreview: "",
      }))
    }
    if(fieldPreview === "aadhaarCardFront"){
      setFormStateKYC(prevState => ({
        ...prevState,
        aadhaarCardFrontPreview: "",
        aadhaarCardFrontImage:'',
      }))
    }
    if(fieldPreview === "aadhaarCardBack"){
      setFormStateKYC(prevState => ({
        ...prevState,
        aadhaarCardBackPreview: "",
        aadhaarCardBackImage: '',
      }))
    }
    if(fieldPreview === "panCardFront"){
      setFormStateKYC(prevState => ({
        ...prevState,
        panCardFrontPreview: "",
        panCardFrontImage:'',
      }))
    }
    if(fieldPreview === "passportPhoto"){
      setFormStateKYC(prevState => ({
        ...prevState,
        passportPhotoPreview: "",
        passportPhoto: '',
      }))
    }
    if(fieldPreview === "addressProofDocument"){
      setFormStateKYC(prevState => ({
        ...prevState,
        addressProofDocument: "",
        addressProofDocument: '',
      }))
    }
  }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
 
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value) => {
    if(value === "Personal Details"){
        setTitle("Personal Details");
        setContent("Your personal details are updated now.");
    };
    if(value === "Bank Details"){
      setTitle("Bank Details");
      setContent("Your bank details are updated now.");
    };
    if(value === "KYC Details"){
      setTitle("KYC Details");
      setContent("Your KYC details are submitted for approval.");
    };
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

  return (
    <Card lg={12} sx={{ boxShadow: "none" }}>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pl={2} pr={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Personal Details
        </MDTypography>
            {!editablePD ? <Tooltip title="Edit Personal Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditablePD(true)}}>
                edit
              </Icon>
            </Tooltip>
            :
            <Tooltip title="Save Personal Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditablePD(false);formSubmit(formStatePD,"Personal Details")}}>
                done
              </Icon>
            </Tooltip>}
        </MDBox>

        <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

        <Grid container spacing={2} mt={0.5} mb={2}>
        <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Trader ID"
                defaultValue={formStatePD.employeeid}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  employeeid: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="First Name"
                defaultValue={formStatePD.first_name}
                fullWidth
                // onChange={(e) => {setFormStatePD({first_name: e.target.value})}}
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  first_name: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Last Name"
                defaultValue={formStatePD.last_name}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  last_name: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Email"
                defaultValue={formStatePD.email}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  email: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Mobile No."
                defaultValue={formStatePD.mobile}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  mobile: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="WhatsApp No."
                defaultValue={formStatePD.whatsApp_number}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  whatsApp_number: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Gender"
                defaultValue={formStatePD.gender}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  gender: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Designation"
                defaultValue={formStatePD.designation}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  designation: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Degree"
                defaultValue={formStatePD.degree}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  degree: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Last Occupation"
                defaultValue={formStatePD.last_occupation}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  last_occupation: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={6}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Address"
                defaultValue={formStatePD.address}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  address: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="City"
                defaultValue={formStatePD.city}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  city: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Pin Code"
                defaultValue={formStatePD.pincode}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  pincode: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="State"
                defaultValue={formStatePD.state}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  state: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={!editablePD}
                id="outlined-required"
                label="Country"
                defaultValue={formStatePD.country}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  country: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                required
                disabled={true}
                id="outlined-required"
                label="Family Yearly Income"
                defaultValue={formStatePD.family_yearly_income}
                fullWidth
                onChange={(e) => {setFormStatePD(prevState => ({
                  ...prevState,
                  family_yearly_income: e.target.value
                }))}}
              />
          </Grid>
         
          <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Date of Birth"
                  disabled={!editablePD}
                  value={dayjs(formStatePD.dob)}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {setFormStatePD(prevState => ({
                    ...prevState,
                    dob: dayjs(e)
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
                    label="Joining Date"
                    disabled={true}
                    value={dayjs(formStatePD.joining_date)}
                    onChange={(e) => {setFormStatePD(prevState => ({
                      ...prevState,
                      joining_date: dayjs(e)
                    }))}}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-2}>
              <MDButton variant="outlined" style={{fontSize:10}} fullWidth color={!editablePD ? "secondary" : "success"} component="label">
                Upload Profile Picture
                <input 
                hidden 
                disabled={!editablePD}
                accept="image/*" 
                type="file" 
                // defaultValue={formStatePD.profilePhoto}
                onChange={(e)=>{handleFileSelect(e,"profilePhoto");
                  setFormStatePD(prevState => ({
                    ...prevState,
                    profilePhoto: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          </Grid>
        </MDBox>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pl={2} pr={2}>

      <MDBox display="flex" justifyContent="space-between" alignItems="center">
       
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Bank Details
        </MDTypography>
           
            {!editableBD ? 
            <Tooltip title="Update Bank Details" placement="top">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ marginRight: 1 }}
              >
                Update Bank Details
              </Typography>
              <Icon
                fontSize="small"
                onClick={() => {
                  setEditableBD(true);
                }}
              >
                edit
              </Icon>
            </Box>
            </Tooltip>

            :
            
            <Tooltip title="Save Bank Details" placement="top">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ marginRight: 1 }}
              >
                Save Bank Details
              </Typography>
              <Icon
                fontSize="small"
                onClick={()=>{setEditableBD(false);formSubmit(formStateBD,"Bank Details")}}
              >
                done
              </Icon>
            </Box>
            </Tooltip>

            }
        </MDBox>

        <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

        <Grid container spacing={2} mt={0.5} mb={2}>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="UPI ID"
                defaultValue={formStateBD.upiId}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  upiId: e.target.value
                }))}}
              />
          </Grid>
          
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="Google Pay Number"
                defaultValue={formStateBD.googlePay_number}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  googlePay_number: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="PhonePe Number"
                defaultValue={formStateBD.phonePe_number}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  phonePe_number: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="PayTM Number"
                defaultValue={formStateBD.payTM_number}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  payTM_number: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                required
                disabled={!editableBD}
                id="outlined-required"
                label="Your Name As per Bank Account"
                defaultValue={formStateBD.nameAsPerBankAccount}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  nameAsPerBankAccount: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                required
                disabled={!editableBD}
                id="outlined-required"
                label="Bank Name"
                defaultValue={formStateBD.bankName}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  bankName: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                required
                disabled={!editableBD}
                id="outlined-required"
                label="Account Number"
                defaultValue={formStateBD.accountNumber}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  accountNumber: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                required
                disabled={!editableBD}
                id="outlined-required"
                label="IFSC Code"
                defaultValue={formStateBD.ifscCode}
                fullWidth
                onChange={(e) => {setFormStateBD(prevState => ({
                  ...prevState,
                  ifscCode: e.target.value
                }))}}
              />
          </Grid>

          </Grid>
      </MDBox>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pl={2} pr={2}>

      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        
        <MDBox>
        
        {/* KYC Details Header */}

        <MDBox display="flex" justifyContent="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          KYC Details 
        </MDTypography>

        <MDBox display="flex">
            <MDTypography 
            variant="caption" 
            fontWeight="bold"
            sx={{
              // pt:0.5,
              // pb:0.5,
              ml:3
            }}
            >
              STATUS : 
            </MDTypography>
              <MDTypography
                  variant="caption"
                  ml={1}
                  mt={-0.6}
                  fontWeight="bold"
                  textTransform="uppercase"
                  sx={{
                    border: '1px solid',
                    borderColor: 'gray.400',
                    borderRadius: 2,
                    pt:0.5,
                    pb:0.5,
                    pr:1,
                    pl:1,
                    backgroundColor: `${
                      formStateKYC.KYCStatus === 'Not Initiated'
                        ? '#1A73E8'
                        : formStateKYC.KYCStatus === 'Approved'
                        ? '#4CAF50'
                        : formStateKYC.KYCStatus === 'Rejected'
                        ? '#F44335'
                        : formStateKYC.KYCStatus === 'Under Verification'
                        ? '#fb8c00'
                        : '#1A73E8'
                    }`,
                    color: `${
                      formStateKYC.KYCStatus === 'Not Initiated'
                        ? 'white!important'
                        : formStateKYC.KYCStatus === 'Approved'
                        ? 'white!important'
                        : formStateKYC.KYCStatus === 'Rejected'
                        ? 'white!important'
                        : formStateKYC.KYCStatus === 'Under Verification'
                        ? 'black!important'
                        : 'white!important'
                    }`,
                  }}
                >
                  {formStateKYC.KYCStatus}
                </MDTypography>
          </MDBox>
          </MDBox>

        {/* KYC Details Header End */}

        </MDBox>

            {!editableKYC ? 
            <Tooltip title="Edit KYC Details" placement="top">
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ marginRight: 1 }}
              >
                Update KYC Details
              </Typography>
              <Icon
                fontSize="small"
                onClick={() => {
                  setEditableKYC(true);
                }}
              >
                edit
              </Icon>
            </Box>
            </Tooltip>
            :
            <Tooltip title="Save KYC Details" placement="top">
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ marginRight: 1 }}
                >
                  Save KYC Details
                </Typography>
                <Icon
                  fontSize="small"
                  onClick={() => {
                    setEditableKYC(false);
                    formSubmit(formStateKYC,"KYC Details");
                  }}
                >
                  done
                </Icon>
              </Box>
            </Tooltip>
            }
            
        </MDBox>

        <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

        <Grid container spacing={2} mt={0}>
          
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableKYC}
                id="outlined-required"
                label="Aadhaar Number"
                defaultValue={formStateKYC.aadhaarNumber}
                fullWidth
                onChange={(e) => {setFormStateKYC(prevState => ({
                  ...prevState,
                  aadhaarNumber: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableKYC}
                id="outlined-required"
                label="PAN Number"
                defaultValue={formStateKYC.panNumber}
                fullWidth
                onChange={(e) => {setFormStateKYC(prevState => ({
                  ...prevState,
                  panNumber: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableKYC}
                id="outlined-required"
                label="Passport Number"
                defaultValue={formStateKYC.passportNumber}
                fullWidth
                onChange={(e) => {setFormStateKYC(prevState => ({
                  ...prevState,
                  passportNumber: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableKYC}
                id="outlined-required"
                label="Driving License Number"
                defaultValue={formStateKYC.drivingLicenseNumber}
                fullWidth
                onChange={(e) => {setFormStateKYC(prevState => ({
                  ...prevState,
                  drivingLicenseNumber: e.target.value
                }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDButton variant="outlined" style={{fontSize:10}} size="small" fullWidth color={!editableKYC ? "secondary" : "success"} component="label">
                Upload Aadhaar Front
                <input 
                hidden 
                disabled={!editableKYC}
                accept="image/*" 
                type="file" 
                // defaultValue={formStateKYC.aadhaarCardFrontImage}
                onChange={(e)=>{handleFileSelect(e,"aadhaarCardFront");
                  setFormStateKYC(prevState => ({
                    ...prevState,
                    aadhaarCardFrontImage: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDButton variant="outlined" style={{fontSize:10}} size="small" fullWidth color={!editableKYC ? "secondary" : "success"} component="label">
                Upload Aadhaar Back
                <input 
                hidden 
                disabled={!editableKYC}
                accept="image/*" 
                type="file" 
                // defaultValue={formStateKYC.aadhaarCardBackImage}
                onChange={(e)=>{handleFileSelect(e,"aadhaarCardBack");
                  setFormStateKYC(prevState => ({
                    ...prevState,
                    aadhaarCardBackImage: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDButton variant="outlined" style={{fontSize:10}} size="small" fullWidth color={!editableKYC ? "secondary" : "success"} component="label">
                Upload PAN Card Front
                <input 
                hidden 
                disabled={!editableKYC}
                accept="image/*" 
                type="file" 
                // defaultValue={formStateKYC.panCardFrontImage}
                onChange={(e)=>{handleFileSelect(e,"panCardFront");
                  setFormStateKYC(prevState => ({
                    ...prevState,
                    panCardFrontImage: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDButton variant="outlined" style={{fontSize:10}} fullWidth color={!editableKYC ? "secondary" : "success"} size="small" component="label">
                Passport Size Photo
                <input 
                hidden 
                disabled={!editableKYC}
                accept="image/*" 
                type="file" 
                // defaultValue={formStateKYC.passportPhoto}
                onChange={(e)=>{handleFileSelect(e,"passportPhoto");
                  setFormStateKYC(prevState => ({
                    ...prevState,
                    passportPhoto: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>
          
          <Grid item xs={12} md={6} xl={2.4}>
              <MDButton variant="outlined" style={{fontSize:10}} size="small" color={!editableKYC ? "secondary" : "success"} fullWidth component="label">
                Address Proof Document
                <input 
                hidden 
                disabled={!editableKYC}
                accept="image/*" 
                type="file" 
                // defaultValue={formStateKYC.addressProofDocument}
                onChange={(e)=>{handleFileSelect(e,"addressProofDocument");
                  setFormStateKYC(prevState => ({
                    ...prevState,
                    addressProofDocument: e.target.files[0]
                  })
                  )}
                }
                />
              </MDButton>
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDBox position="relative" display="inline-block">
                  <img 
                      style={{width:'100%',height:'130px'}} 
                      src={formStateKYC.aadhaarCardFrontImage ? formStateKYC.aadhaarCardFrontImage : formStateKYC.aadhaarCardFrontPreview ? formStateKYC.aadhaarCardFrontPreview : blankImageUrl} 
                      alt="Passport Size Photo" 
                  />
                      {editableKYC && (
                        <button
                          onClick={(e)=>{onRemove("aadhaarCardFront")}}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'red',
                            fontSize: '1.5rem',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                         >
                         &times;
                        </button>
                      )}
              </MDBox>
                {formStateKYC.aadhaarCardFrontPreview ? 
                <Typography sx={{fontSize:10,mt:-1}}>Aadhaar Card Front Uploaded</Typography> 
                :
                <Typography sx={{fontSize:10,mt:-1}}>Please Upload Aadhaar Card Back</Typography>
                }
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDBox position="relative" display="inline-block">
                  <img 
                      style={{width:'100%',height:'130px'}} 
                      src={formStateKYC.aadhaarCardBackImage ? formStateKYC.aadhaarCardBackImage : formStateKYC.aadhaarCardBackPreview ? formStateKYC.aadhaarCardBackPreview : blankImageUrl} 
                      alt="Passport Size Photo" 
                  />
                      {editableKYC && (
                        <button
                          onClick={(e)=>{onRemove("aadhaarCardBack")}}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'red',
                            fontSize: '1.5rem',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                         >
                         &times;
                        </button>
                      )}
              </MDBox>
                {formStateKYC.aadhaarCardBackPreview ? 
                <Typography sx={{fontSize:10,mt:-1}}>Aadhaar Card Back Uploaded</Typography> 
                :
                <Typography sx={{fontSize:10,mt:-1}}>Please Upload Aadhaar Card Back</Typography>
                }
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDBox position="relative" display="inline-block">
                  <img 
                      style={{width:'100%',height:'130px'}} 
                      src={formStateKYC.panCardFrontImage ? formStateKYC.panCardFrontImage : formStateKYC.panCardFrontPreview ? formStateKYC.panCardFrontPreview : blankImageUrl} 
                      alt="Passport Size Photo" 
                  />
                      {editableKYC && (
                        <button
                          onClick={(e)=>{onRemove("panCardFront")}}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'red',
                            fontSize: '1.5rem',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                         >
                         &times;
                        </button>
                      )}
              </MDBox>
                {formStateKYC.panCardFrontPreview ? 
                <Typography sx={{fontSize:10,mt:-1}}>Pan Card Uploaded</Typography> 
                :
                <Typography sx={{fontSize:10,mt:-1}}>Please Upload Pan Card</Typography>
                }
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDBox position="relative" display="inline-block">
                  <img 
                      style={{width:'100%',height:'130px'}} 
                      src={formStateKYC.passportPhoto ? formStateKYC.passportPhoto : formStateKYC.passportPhotoPreview ? formStateKYC.passportPhotoPreview : blankImageUrl} 
                      alt="Passport Size Photo" 
                  />
                      {editableKYC && (
                        <button
                          onClick={(e)=>{onRemove("passportPhoto")}}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'red',
                            fontSize: '1.5rem',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                         >
                         &times;
                        </button>
                      )}
              </MDBox>
                {formStateKYC.passportPhotoPreview ? 
                <Typography sx={{fontSize:10,mt:-1}}>Passport Size Photo Uploaded</Typography> 
                :
                <Typography sx={{fontSize:10,mt:-1}}>Please Upload Passport Size Photo</Typography>
                }
          </Grid>

          <Grid item xs={12} md={6} xl={2.4}>
              <MDBox position="relative" display="inline-block">
                  <img 
                      style={{width:'100%',height:'130px'}} 
                      src={formStateKYC.addressProofDocument ? formStateKYC.addressProofDocument : formStateKYC.addressProofDocumentPreview ? formStateKYC.addressProofDocumentPreview : blankImageUrl} 
                      alt="Address Proof Document" 
                  />
                      {editableKYC && (
                        <button
                          onClick={(e)=>{onRemove("addressProofDocument")}}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '5px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'red',
                            fontSize: '1.5rem',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                         >
                         &times;
                        </button>
                      )}
              </MDBox>
                {formStateKYC.addressProofDocumentPreview ? 
                <Typography sx={{fontSize:10,mt:-1}}>Address Proof Document Uploaded</Typography> 
                :
                <Typography sx={{fontSize:10,mt:-1}}>Please Upload Address Proof Document</Typography>
                }
          </Grid>

          </Grid>

      </MDBox>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Email Settings
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={!followsMe} onChange={() => setFollowsMe(followsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my daily P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={answersPost} onChange={() => setAnswersPost(!answersPost)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my weekly P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={!mentionsMe} onChange={() => setMentionsMe(mentionsMe)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Email me my monthly P&L report
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      {renderSuccessSB}
    </Card>
  );
}

export default MyProfile;
