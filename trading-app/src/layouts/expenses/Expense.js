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
import ExpenseModel from './ExpenseModel';
import ExpenseData from './data/ExpenseData';
import ExpenseEditModel from "./ExpenseEditModel";



const Expense = () => {
    const { columns, rows } = ExpenseData();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [expenseData, setExpenseData] = useState([]);
    const [reRender, setReRender] = useState(true);
    // const [inactiveData, setInactiveData] = useState([]);
  
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/readExpenseDetails`)
        .then((res)=>{
                  setExpenseData(res.data);
                  console.log(res.data);
        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })
    },[reRender])
  
    console.log(expenseData);
    
    expenseData.map((elem)=>{
      let expense = {}
      const statuscolor = elem.status == "Active" ? "success" : "error"
  
      expense.edit = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            <ExpenseEditModel data={expenseData} id={elem._id} Render={{setReRender, reRender}}/>
          </MDButton>
        );
        expense.expenseby = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.expense_by}
          </MDTypography>
        );
        expense.category = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.category}
        </MDTypography>
      );
      expense.subcategory = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.sub_category}
        </MDTypography>
      );
      expense.amount = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.amount}
        </MDTypography>
      );
      expense.gst = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.gst}
        </MDTypography>
      );
      expense.totalamount = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.total_amount}
        </MDTypography>
      );
      expense.description = (
        <MDTypography component="a" variant="caption" color={statuscolor} fontWeight="medium">
          {elem.description}
        </MDTypography>
      );
      expense.paymentstatus = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.payment_status}
        </MDTypography>
      );
      expense.invoice = (
        <a href={elem.invoice_upload}>
            <MDTypography component="span" variant="caption" color="text" fontWeight="medium">
              View Invoice
            </MDTypography>
        </a>
    );
      expense.createdon = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.createdOn}
        </MDTypography>
      );
     
      rows.push(expense)
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
                                    Expense(s)
                                </MDTypography>
                                <ExpenseModel />
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
                    {/* <Grid item xs={12} md={12} lg={12}>
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
                                    User Details (Inactive Users)
                                </MDTypography>
                                <UserModel />
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ icolumns, irows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid> */}
                </Grid>
            </MDBox>
        </>
    )
}

export default Expense