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

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [userDetails, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [editablePD, setEditablePD] = useState(false);
  const [editableBD, setEditableBD] = useState(false);
  const [editableKYC, setEditableKYC] = useState(false);
  const [aadhaarFrontFileName,setAaadhaarFrontFileName] = useState(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const getDetails = useContext(userContext);

  const [formStatePD,setFormStatePD] = React.useState(
    {
      employeeid:getDetails?.userDetails?.employeeid,
      first_name:getDetails?.userDetails?.first_name,
      last_name:getDetails?.userDetails?.last_name,
      email:getDetails?.userDetails?.email,
      mobile:getDetails?.userDetails?.mobile,
      whatsApp_number:getDetails?.userDetails?.whatsApp_number,
      gender:getDetails?.userDetails?.gender,
      designation:getDetails?.userDetails?.designation,
      degree:getDetails?.userDetails?.degree,
      last_occupation:getDetails?.userDetails?.last_occupation,
      address:getDetails?.userDetails?.address,
      city:getDetails?.userDetails?.city,
      pincode:getDetails?.userDetails?.pincode,
      state:getDetails?.userDetails?.state,
      country:getDetails?.userDetails?.country,
      dob:getDetails?.userDetails?.dob,
      joining_date:getDetails?.userDetails?.joining_date,
    }
  );

  const [formStateBD,setFormStateBD] = React.useState(
    {
      upiId:getDetails?.userDetails?.upiId,
      googlePay_number:getDetails?.userDetails?.googlePay_number,
      phonePe_number:getDetails?.userDetails?.phonePe_number,
      payTM_number:getDetails?.userDetails?.payTM_number,
      nameAsPerBankAccount:getDetails?.userDetails?.nameAsPerBankAccount,
      bankName:getDetails?.userDetails?.bankName,
      accountNumber:getDetails?.userDetails?.accountNumber,
      ifscCode:getDetails?.userDetails?.ifscCode,
    }
  );

  const [formStateKYC,setFormStateKYC] = React.useState(
    {
      aadhaarNumber:getDetails?.userDetails?.aadhaarNumber,
      panNumber:getDetails?.userDetails?.panNumber,
      aadhaarCardFrontImage:getDetails?.userDetails?.aadhaarCardFrontImage,
      aadhaarCardBackImage:getDetails?.userDetails?.aadhaarCardBackImage,
      panCardFrontImage:getDetails?.userDetails?.panCardFrontImage,
      passportPhoto:getDetails?.userDetails?.passportPhoto,
      addressProofDocument:getDetails?.userDetails?.addressProofDocument,
    }
  );

  async function formSubmit(id,data){
    console.log(id,data)
  }

  async function formSubmitBD(id,data){
    console.log(id,data)
  }

  async function formSubmitKYC(id,data){
    console.log(id,data)
  }

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileDataUrl = reader.result;
        const fileBlob = dataURLtoBlob(fileDataUrl);
        const newFile = new File([fileBlob], selectedFile.name, { type: selectedFile.type });
        console.log("New file object:", newFile);
        setAaadhaarFrontFileName(selectedFile.name);
        // setAaadhaarFrontFile(newFile);
        setAadhaarFrontPreview(reader.result);
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

  const handleInputSelect = (file) => {
    if (file) {
      console.log("File: ",file)
      setFormStateKYC(prevState => ({
        ...prevState,
        aadhaarCardBackImage: file,
      }));
    }
  };

  console.log("Aadhar File Name",aadhaarFrontFileName)
  console.log("Aadhar Card File Preview: ",aadhaarFrontPreview)


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  return (
    <Card sx={{ boxShadow: "none" }}>
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
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditablePD(false);formSubmit(formStatePD)}}>
                done
              </Icon>
            </Tooltip>}
        </MDBox>
        <Grid container spacing={2} mt={0.5}>
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
                />
              </DemoContainer>
            </LocalizationProvider>
        </Grid>
          </Grid>
      </MDBox>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pl={2} pr={2}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Bank Details
        </MDTypography>
            {!editableBD ? <Tooltip title="Edit Personal Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditableBD(true)}}>
                edit
              </Icon>
            </Tooltip>
            :
            <Tooltip title="Save Personal Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditableBD(false);formSubmitBD(formStateBD)}}>
                done
              </Icon>
            </Tooltip>}
        </MDBox>
        <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="UPI ID"
                defaultValue={formStateBD.upiId}
                fullWidth
              />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="Google Pay Number"
                defaultValue={formStateBD.googlePay_number}
                fullWidth
              />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="PhonePe Number"
                defaultValue={formStateBD.phonePe_number}
                fullWidth
              />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={!editableBD}
                id="outlined-required"
                label="PayTM Number"
                defaultValue={formStateBD.payTM_number}
                fullWidth
              />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <TextField
                required
                disabled={!editableBD}
                id="outlined-required"
                label="Your Name As per Bank Account"
                defaultValue={formStateBD.googlePay_number}
                fullWidth
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
              />
          </Grid>
          </Grid>
      </MDBox>

      <Divider orientation="horizontal" sx={{ ml: 1, mr: 1, color:'rgba(0, 0, 0, 0.87)' }} />

      <MDBox pl={2} pr={2}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          KYC Details
        </MDTypography>
            {!editableKYC ? <Tooltip title="Edit KYC Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditableKYC(true)}}>
                edit
              </Icon>
            </Tooltip>
            :
            <Tooltip title="Save KYC Details" placement="top">
              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={()=>{setEditableKYC(false);formSubmitKYC(formStateKYC)}}>
                done
              </Icon>
            </Tooltip>}
        </MDBox>
        <Grid container spacing={2} mt={0.5}>
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
          <Grid item xs={12} md={6} xl={3}>
              <MDButton variant="outlined" fullWidth color="success" component="label">
                Upload Aadhaar Card Front
                <input hidden accept="image/*" type="file" />
              </MDButton>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <MDButton variant="outlined" fullWidth color="success" component="label">
                Upload Aadhaar Card Back
                <input 
                hidden 
                accept="image/*" 
                type="file" 
                // onChange={(e) => {setFormStateKYC(prevState => ({
                //   ...prevState,
                //   aadhaarCardBackImage: e.target.value
                // }));
                // handleFileSelect
                // }}
                onChange={handleFileSelect}
                />
              </MDButton>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <MDButton variant="outlined" fullWidth color="success" component="label">
                Upload PAN Card Front
                <input hidden accept="image/*" type="file" />
              </MDButton>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              <MDButton variant="outlined" fullWidth color="success" component="label">
                Upload Passport SIze Photo
                <input hidden accept="image/*" type="file" />
              </MDButton>
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              {/* <MDBox> */}
                {aadhaarFrontPreview && (
                  <img style={{maxWidth:'100%',height:'auto'}} src={aadhaarFrontPreview} alt="Aadhaar Card Preview" />
                )}
              {/* </MDBox> */}
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              {/* <MDBox> */}
                {aadhaarFrontPreview && (
                  <img style={{maxWidth:'100%',height:'auto'}} src={aadhaarFrontPreview} alt="Aadhaar Card Preview" />
                )}
              {/* </MDBox> */}
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              {/* <MDBox> */}
                {aadhaarFrontPreview && (
                  <img style={{maxWidth:'100%',height:'auto'}} src={aadhaarFrontPreview} alt="Aadhaar Card Preview" />
                )}
              {/* </MDBox> */}
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
              {/* <MDBox> */}
                {aadhaarFrontPreview && (
                  <img style={{maxWidth:'100%',height:'auto'}} src={aadhaarFrontPreview} alt="Aadhaar Card Preview" />
                )}
              {/* </MDBox> */}
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
    </Card>
  );
}

export default PlatformSettings;
