import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
import { FcApprove } from 'react-icons/fc';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDBox";


// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import EditSharpIcon from '@mui/icons-material/EditSharp';


// Data
// import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";
import SignedUpUserData from './data/SignedUpUserData';
import InactiveUserData from './data/InactiveUserData';
import SignedUpUserEditModel from "./SignedUpUserEditModel";



const SignedUpUser = () => {
    const { columns, rows } = SignedUpUserData();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [signedUpUserData, setSignedUpUserData] = useState([]);
    const [reRender, setReRender] = useState(true);
  
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/signedupusers`)
        .then((res)=>{
           setSignedUpUserData(res.data);
        }).catch((err)=>{
            return new Error(err);
        })
    },[reRender])

    console.log(signedUpUserData);
    
    signedUpUserData.map((elem)=>{
      let signedupusers = {}
  
        signedupusers.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <SignedUpUserEditModel data={signedupusers} id={elem._id} Render={{setReRender, reRender}}/>
          </MDButton>
        );
        signedupusers.fname = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.first_name}
          </MDTypography>
        );
        signedupusers.lname = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.last_name}
          </MDTypography>
        );
        signedupusers.email = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.email}
          </MDTypography>
        );
        signedupusers.mobile = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.mobile}
          </MDTypography>
        );
        signedupusers.wmobile = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.watsApp_number}
          </MDTypography>
        );
        signedupusers.gender = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.gender}
          </MDTypography>
        );
        signedupusers.tradingexp = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.trading_exp} Months
          </MDTypography>
        );
        signedupusers.city = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.city}
          </MDTypography>
        );
        signedupusers.dob = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.dob}
          </MDTypography>
        );
        signedupusers.status = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              {elem.status}
            </MDTypography>
          );
     
      rows.push(signedupusers)
    })


    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={1}>
                                    Signed Up User Details
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    )
}

export default SignedUpUser