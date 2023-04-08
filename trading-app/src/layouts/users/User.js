import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";

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
import UserModel from './UserModel';
import UserData from './data/UserData';
import InactiveUserData from './data/InactiveUserData';
import UserEditModel from "./UserEditModel";



const User = () => {
    const { columns, rows } = UserData();
    // const { icolumns, irows } = InactiveUserData();
    const { icolumns, irows } = InactiveUserData();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    const [activeData, setActiveData] = useState([]);
    const [reRender, setReRender] = useState(true);
  
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/readuserdetails`)
        .then((res)=>{
          let data = res.data;
                  let active = data.filter((elem) => {
                      return elem.status === "Active"
                  })
                  setActiveData(active);
                  console.log(active);
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])

    function getWeekNumber(d) {
      // Copy date so don't modify original
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
      // Get first day of year
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      // Return array of year and week number
      return [d.getUTCFullYear(), weekNo];
    }
    
  
    console.log(activeData);
    
    activeData.map((elem)=>{
      let activeusers = {}
      const dojWeekNumber = getWeekNumber(new Date(elem.joining_date))[1];
      const statuscolor = elem.status == "Active" ? "success" : "error"
  
      activeusers.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <UserEditModel data={activeData} id={elem._id} Render={{setReRender, reRender}}/>
          </MDButton>
        );
        activeusers.employeeid = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.employeeid}
          </MDTypography>
        );
      activeusers.name = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.name}
        </MDTypography>
      );
      activeusers.cohort = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.cohort}
        </MDTypography>
      );
      activeusers.designation = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.designation}
        </MDTypography>
      );
      activeusers.email = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.email}
        </MDTypography>
      );
      activeusers.mobile = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.mobile}
        </MDTypography>
      );
      activeusers.gender = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.gender}
        </MDTypography>
      );
      activeusers.tradingexp = (
        <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
          {elem.trading_exp}
        </MDTypography>
      );
      activeusers.location = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.location}
        </MDTypography>
      );
      activeusers.doj = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.joining_date}
        </MDTypography>
      );
      activeusers.dojweek = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {dojWeekNumber}
        </MDTypography>
      );
      activeusers.role = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.role}
        </MDTypography>
      );
      activeusers.fund = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.fund}
        </MDTypography>
      );
    //   activeusers.userPass = (
    //     <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
    //       {elem.password}
    //     </MDTypography>
    //   );
      activeusers.status = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.status}
        </MDTypography>
      );
     
      rows.push(activeusers)
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
                                <MDTypography variant="h6" color="white" py={2.5}>
                                    Users (Active Users)
                                </MDTypography>
                                <UserModel />
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

export default User