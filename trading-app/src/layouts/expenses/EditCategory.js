import * as React from 'react';
import {useContext, useState, useEffect, useRef} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import uniqid from "uniqid";
import CreateCategoryTableData from "./CreateCategoryTableData"
import DataTable from "../../examples/Tables/DataTable";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import axios from "axios"





  const EditCategory = ({Render, setView, CategoryData, id}) => {

    const {columns, rows} = CreateCategoryTableData();
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    const {reRender, setReRender} = Render;
    const[editData, setEditData] = useState(CategoryData);
    const [category, setCategory] = useState();
    const [categoryName, setCategoryName] = useState();
    const [categoryId, setCategoryId] = useState();
    const [subCategory, setSubCategory] = useState([]);
    const [status, setStatus] = useState([]);
    const [editOn, setEditOn] = useState(true);
    const [formstate, setformstate] = useState({
      categoryName: "",
      categoryId: "",
      subCateogry: [],
      status: "",
    });
    let lengthOfsubCategory = 0;

    const handleChange = (e, index, checkEntity) => {
      const values = [...subCategory];

      switch(checkEntity) {
        case "subCategoryName":
          values[index].subCategoryName = e.target.value;
          break;
        case "subCategoryId":
          values[index].subCategoryId = e.target.value;
          break;
        case "status":
          values[index].status = e.target.value;
          break;         
        default:
          // code block
      }
      
      setSubCategory(values);
    };


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/category`)
        .then((res)=>{
          setCategory(res.data)
          console.log("res.data", res.data)
        })
        .catch(()=>{
          console.log("Fail to fetch data")
        })
      },[])
  
    const handleClose = () => {
      setView(false);
    };

  
  useEffect(()=>{
    let updatedData = CategoryData.filter((elem)=>{
        return elem._id === id
    })

    console.log("filtered category", updatedData)
    setEditData(updatedData);
    if(updatedData.length){
        setCategoryName(updatedData[0].name);
        setCategoryId(updatedData[0].unit);
        setSubCategory(updatedData[0].subCategory);
        setStatus(updatedData[0].status)
    }

    
  },[CategoryData, id])
  

  function onEdit(){
    setEditOn(false);
  }
  
  async function onSave() {
  
    formstate.categoryName = categoryName
    formstate.categoryId = categoryId
    formstate.subCategory = subCategory
    formstate.status = status

  
      setformstate(formstate);
      console.log(formstate)
      const {categoryName, categoryId, subCategory, status} = formstate;
  
  
      const res = await fetch(`${baseUrl}api/v1/category/update/${id}`, {
          method: "PUT",
          headers: {
              "Accept": "application/json",
              "content-type": "application/json"
          },
          body: JSON.stringify({
            categoryName, categoryId, subCategory, status
          })
      });
  
  
      const dataResp = await res.json();
      
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          console.log("Failed to Edit");
      }else {
          console.log(dataResp);
          window.alert("Edit succesfull");
          console.log("Edit succesfull");
      }
  
      setEditOn(true);
      setView(false);
  }
  
  async function Ondelete(){
    console.log(editData)
    const res = await fetch(`${baseUrl}api/v1/subCategory/delete/${id}`, {
        method: "PATCH",
    });
  
  
    const dataResp = await res.json();
    
    console.log(dataResp);
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        window.alert(dataResp.error);
        console.log("Failed to Delete");
    } else {
        console.log(dataResp);
        window.alert("Delete succesfull");
        console.log("Delete succesfull");
    }
    setView(false);
    reRender ? setReRender(false) : setReRender(true)
  }


  async function deletesubCategory(type_id, create_id){
    console.log(type_id, create_id, rows)
    if(type_id){
      const res = await fetch(`${baseUrl}api/v1/category/subCategoryDelete/${type_id}`, {
          method: "PATCH",
      });
    
    
      const dataResp = await res.json();
      
      console.log(dataResp);
      if (dataResp.status === 422 || dataResp.error || !dataResp) {
          window.alert(dataResp.error);
          console.log("Failed to Delete");
      } else {
          console.log(dataResp);
          window.alert("Delete succesfull");
          console.log("Delete succesfull");
      }

      subCategory.map((elem)=>{
        if(elem._id === type_id){
          console.log(elem);
          elem.is_Deleted = true;
        }
      })
      // setView(false);
    } else if(create_id){
      let update = subCategory.filter((elem)=>{
        return elem.id !== create_id;
      })

      console.log(update, subCategory)
      setSubCategory([...update]);
    }
    
    reRender ? setReRender(false) : setReRender(true)
  }
  



    subCategory.map((elem, index)=>{
        if(!elem.is_Deleted){
        let obj = {
          // id : Date.now(),
          delete : (
              <MDButton variant="Contained" color="info" fontWeight="medium" onClick={()=>{deletesubCategory(elem._id, elem.id , "database")}}>
                  🗑️
              </MDButton>
          ),
          subcategoryname : ( 
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            value={elem.subCategoryName} 
            onChange={e => handleChange(e, index, "ageStart")}
            />
          ),
          subcategoryid : ( 
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            value={elem.subCategoryId} 
            onChange={e => handleChange(e, index, "ageStart")}
            />
            ),
          status : ( 
            <TextField
            id="filled-basic" label="" variant="filled" type="number" disabled={editOn}
            sx={{margin: 1, padding : 1, width:"100px"}} 
            value={elem.status} 
            onChange={e => handleChange(e, index, "ageStart")}
            />
            ),
        }
          rows.push(obj)
      }

    })

    function onCreate(){

      let subCategoryDataFirst = {
        subCategoryName: "",
        subCategoryId: "",
        status: "",
      };

    let obj = {
      id : Date.now(),
      delete : (
          <MDButton variant="Contained" color="info" fontWeight="medium" onClick={()=>{deletesubCategory(obj.id, "created")}}>
              🗑️
          </MDButton>
      ),
      subcategoryname : ( 
        <TextField
        id="filled-basic" label="" variant="filled"  disabled={editOn}
        sx={{margin: 1, padding : 1, width:"100px"}} 
        value={subCategoryDataFirst.subCategoryName} 
        onChange={(e)=>{subCategoryDataFirst.subCategoryName = e.target.value}}
        />
      ),
      subcategoryid : ( 
        <TextField
        id="filled-basic" label="" variant="filled" disabled={editOn}
        sx={{margin: 1, padding : 1, width:"100px"}} 
        value={subCategoryDataFirst.subCategoryId} 
        onChange={(e)=>{subCategoryDataFirst.subCategoryId = e.target.value}}
        />
        ),
      status : ( 
        <TextField
        id="filled-basic" label="" variant="filled" disabled={editOn}
        sx={{margin: 1, padding : 1, width:"100px"}} 
        value={subCategoryDataFirst.status} 
        onChange={(e)=>{subCategoryDataFirst.status = e.target.value}}
        />
        ),
    }

    console.log(obj)
      rows.push(obj)
    //   console.log(rows)
      setSubCategory((oldState)=> [...oldState, obj])
      formstate.subCategory.push(((obj)));
    }
  
  
    return (
      <>

      {editOn ?
      <Button autoFocus onClick={onEdit}>
        Edit
      </Button>
      :
      <Button autoFocus onClick={onSave}>
      Save
      </Button>}
      <Button onClick={Ondelete} autoFocus>
        Delete
      </Button>
      <Button onClick={handleClose} autoFocus>
        Close
      </Button>

        <MDBox pt={2} pb={2}>

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch',margin: 1, padding: 1, width: "250px" },
          }}
          noValidate
          autoComplete="off"
        >
        <TextField
        id="filled-basic" label="Category Name" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} value={categoryName} disabled={editOn} onChange={(e)=>{ setCategoryName(e.target.value)}}/>

        <TextField
        id="filled-basic" label="Category ID" variant="filled"
          sx={{margin: 1, padding : 1, width:"300px"}} value={categoryId} disabled={editOn} onChange={(e)=>{ setCategoryId(e.target.value)}}/>
        

        <TextField
        id="filled-basic" label="Status" variant="filled"
        sx={{margin: 1, padding : 1, width:"300px"}} value={status} disabled={editOn} onChange={(e)=>{ setStatus(e.target.value)}}/>


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

                          {/* <MDTypography variant="h6" color="white" py={1}>
                            Add Bio Markers Type
                          </MDTypography> */}

                          <MDButton disabled={editOn} variant="outlined" color="white" onClick={onCreate}>
                            Add
                          </MDButton>
                      </MDBox>
                      <MDBox pt={2}>
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

        <MDBox mt={0.5} display="flex" alignItems="center">
          <MDBox component="span" variant="button" fontWeight="light" fontSize="15px" color="text">Status</MDBox>
          <Switch checked={status === "Active"} label="Status"  value={status} disabled={editOn} onClick={() => setStatus(prevStatus => prevStatus === "Active" ? "Inactive" : "Active" )}  />
        </MDBox>
        </Box>
        {console.log(status)}
        {/* <Button autoFocus onClick={formSubmit}>
          Save
        </Button>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button> */}
        </MDBox>
      </>
    );
  }

export default EditCategory

