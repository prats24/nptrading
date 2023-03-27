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
import axios from "axios";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Header from "../Header";

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
  const [newsletter, setNewsletter] = useState(false);
  const [editablePD, setEditablePD] = useState(false);
  const [editableBD, setEditableBD] = useState(false);
  const [editableKYC, setEditableKYC] = useState(false);
  const [aadhaarFrontFileName,setAaadhaarFrontFileName] = useState(null);
  const [aadhaarFrontPreview, setAadhaarFrontPreview] = useState(null);
  const getDetails = useContext(userContext);

  // const blankImageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='130px' %3E%3Crect width='100%' height='130px' fill='lightgrey'/%3E%3C/svg%3E`;
  const blankImageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='130px'%3E%3Crect width='100%' height='130px' fill='lightgrey'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='15px' fill='black'%3EDocument Preview%3C/text%3E%3C/svg%3E`;

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
      family_yearly_income:getDetails?.userDetails?.family_yearly_income,
      profilePhoto:getDetails?.userDetails?.profilePhoto,
      profilePhotoPreview:"",
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
      aadhaarCardFrontPreview:"",
      aadhaarCardBackPreview:"",
      panCardFrontPreview:"",
      passportPhotoPreview:"",
      addressProofDocumentPreview:"",
      KYCStatus:getDetails?.userDetails?.KYCStatus,
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
            profilePhotoPreview: reader.result
          }))
        }
        if(fieldName === "aadhaarCardFront"){
          setFormStateKYC(prevState => ({
            ...prevState,
            aadhaarCardFrontPreview: reader.result
          }))
        }
        if(fieldName === "aadhaarCardBack"){
          setFormStateKYC(prevState => ({
            ...prevState,
            aadhaarCardBackPreview: reader.result
          }))
        }
        if(fieldName === "panCardFront"){
          setFormStateKYC(prevState => ({
            ...prevState,
            panCardFrontPreview: reader.result
          }))
        }
        if(fieldName === "passportPhoto"){
          setFormStateKYC(prevState => ({
            ...prevState,
            passportPhotoPreview: reader.result
          }))
        }
        if(fieldName === "addressProofDocument"){
          setFormStateKYC(prevState => ({
            ...prevState,
            addressProofDocument: reader.result
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
      }))
    }
    if(fieldPreview === "aadhaarCardBack"){
      setFormStateKYC(prevState => ({
        ...prevState,
        aadhaarCardBackPreview: "",
      }))
    }
    if(fieldPreview === "panCardFront"){
      setFormStateKYC(prevState => ({
        ...prevState,
        panCardFrontPreview: "",
      }))
    }
    if(fieldPreview === "passportPhoto"){
      setFormStateKYC(prevState => ({
        ...prevState,
        passportPhotoPreview: "",
      }))
    }
    if(fieldPreview === "addressProofDocument"){
      setFormStateKYC(prevState => ({
        ...prevState,
        addressProofDocument: "",
      }))
    }
  }



  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox mb={2} />
    <Header/>
    </DashboardLayout>
    )
}

export default PlatformSettings;
