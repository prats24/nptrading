import * as React from 'react';
import {useContext, useState, useEffect} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import uniqid from "uniqid";
import CreateCategoryTableData from "./CreateCategoryTableData"
import DataTable from "../../examples/Tables/DataTable";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";



  const CreateCategory = ({setCreateCategory}) => {
    // const {reRender, setReRender} = Render
    let subCategoryDataFirst = {
      subCategoryName: "",
      subCategoryId: "",
      status: "",
    }

    const {columns, rows} = CreateCategoryTableData();
    const [row, setRow] = useState([
      // obj
    ]);



    let uId = uniqid();
    let date = new Date();
    let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    let createdBy = "prateek";
    let isDeleted = false;
    let lastModifiedBy = createdBy;
    let lastModifiedOn = createdOn

    let [formData, setFormData] = useState({
      categoryName: "",
      categoryId: "",
      status: "",
      subCategories: [
        
      ]
    });



    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
    const [render, setRender] = useState(true);
  
    const handleClose = () => {
      setCreateCategory(false);
    };

    // data sent to backend function
    async function formSubmit(){

      setFormData(formData);
      console.log(formData)
      const { categoryName, categoryId, status, subCategoryData } = formData;

      const res = await fetch(`${baseUrl}api/v1/category`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          categoryName, categoryId,  subCategories: subCategoryData
        })
    });
    
    const data = await res.json();
             
      console.log(data);
      if(data.status === 422 || data.error || !data){ 
          window.alert(data.error);
          console.log("Invalid Entry");
      }else{
          window.alert("Category Created Successfully");
          console.log("entry succesfull");
      }

      setCreateCategory(false);
    }
    
    function deleteItem(id){
      // if(row.length !== 1){
        let update = row.filter((elem)=>{
          console.log(elem.id.props.children , id)
          return elem.id.props.children !== id;
        })
        setRow(update);
      // }
    }

    console.log("row outer", row)

    function onCreate(){
      let obj = {};

      let subCategoryData = {
      subCategoryName: "",
      subCategoryId: "",
      status: "",
      };


      obj.id = (
        <MDTypography component="a" variant="caption">
          {Date.now()}
        </MDTypography>
      );

      // console.log("id", obj.id)

      obj.delete = (
        <MDButton variant="Contained" color="info" fontWeight="medium" onClick={(e)=>{deleteItem(obj.id.props.children)}}>
          🗑️
        </MDButton>
      );

      obj.subcategoryname = (
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{subCategoryData.subCategoryName = e.target.value}}/>
        );

      obj.subcategoryid = ( 
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{subCategoryData.subCategoryId = e.target.value}}/>
        );

      obj.status = (
        <TextField
        id="filled-basic" label="" variant="filled"
        sx={{margin: 1, padding : 1, width:"150px"}} onChange={(e)=>{subCategoryData.status = e.target.value}}/>);

        // tempRow.push(obj);
      setRow((oldState)=> [...oldState, obj])
      formData.subCategoryData.push(subCategoryData);


      render ? setRender(false):setRender(true)
    }


    console.log(formData)
  
    return ( 
      <>
        <MDBox pt={3} pb={3}>
        <MDTypography variant="h6" fontWeight="medium" borderRadius="10px" color="white" backgroundColor="#afb0b2" marginLeft="15px">
          &nbsp;&nbsp;Create Category
        </MDTypography>
        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding : 1, width:"200px"  },
            }}
            noValidate
            autoComplete="off"
          >
        <TextField
        id="filled-basic" label="Unit Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"200px"}} onChange={(e)=>{formData.categoryName = e.target.value}}/>
        
        <TextField
        id="filled-basic" label="Unit Id" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} onChange={(e)=>{formData.categoryId = e.target.value}}/>

        <MDBox pt={3} pb={3}>
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
                            Add Sub Category
                          </MDTypography>

                          <MDButton variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton>
                      </MDBox>
                      <MDBox pt={2}>
                          <DataTable
                              table={{ columns, rows: row }}
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

        <MDBox mt={1} ml={2} display="flex" alignItems="center">
          <MDBox component="span" variant="button" fontWeight="dark" fontSize="15px" color="text">Status</MDBox><Switch label="Status"  onChange={(e) => {formData.status = e.target.value}} />
        </MDBox>
        </Box>

        <Button autoFocus onClick={formSubmit}>
          Save
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
        </MDBox>
      </>
    );
  }

export default CreateCategory