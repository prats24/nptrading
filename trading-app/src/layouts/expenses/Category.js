import React from 'react'
import {useEffect, useState} from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
// import authorsTableData from "./data/authorsTableData";
import ExpenseData from "./data/ExpenseData";
import CategoryModel from './CategoryModel';
import CategoryData from './data/CategoryData';



const Categories = () => {
    const { columns, rows } = CategoryData();
    const { columns: pColumns, rows: pRows } = ExpenseData();
    const [reRender, setReRender] = useState(true);
    const [categoryDetail, setCategoryDetail] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readCategoryDetails`)
        .then((res)=>{
            setCategoryDetail(res.data);
          }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
    }, [reRender])

    console.log("categoryDetail", categoryDetail)

    categoryDetail.map((elem)=>{
        let obj={};
        obj.edit = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {}
            </MDButton>
        );
        obj.isCategory = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {(String(elem.isCategory)).toUpperCase()}
            </MDButton>
        );
        obj.subCategory = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {elem.sub_category}
            </MDButton>
        );
        obj.category = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {elem.category}
            </MDButton>
        );
        obj.createdBy = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {elem.created_by}
            </MDButton>
        );
        obj.createdOn = (
            <MDButton variant="Contained" color="info" fontWeight="medium">
                {elem.createdOn}
            </MDButton>
        );

        rows.push(obj);

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
                                    Categories
                                </MDTypography>
                                <CategoryModel />
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

export default Categories