import {useState, useEffect, createFactory} from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import DataTable from "../../examples/Tables/DataTable";
import MDButton from "../../components/MDButton"
import MDBox from "../../components/MDBox"
import MDTypography from "../../components/MDTypography"
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { GrFormView } from 'react-icons/gr';
import { CircularProgress } from "@mui/material";


import indicesData from "./data/indicesData";
import CreateIndexForm from "./createIndex"

const StockIndex = () => {

    const [reRender, setReRender] = useState(true);
    const [createIndexForm,setCreateIndexForm] = useState(false);
    const [stockIndices,setStockIndices] = useState([]);
    const { columns, rows } = indicesData();
    const [id,setId] = useState();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/stockindex`)
      .then((res)=>{
                setStockIndices(res.data);
                console.log(res.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[createIndexForm])

  stockIndices.map((elem)=>{
    let stockindex = {}

    stockindex.view = (
      // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
        <GrFormView onClick={()=>{setCreateIndexForm(true);setId(elem._id)}}/>
      // </MDButton>
    );
    stockindex.displayName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.displayName}
      </MDTypography>
    );
    stockindex.instrumentSymbol = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.instrumentSymbol}
      </MDTypography>
    );
    stockindex.exchange = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.exchange}
      </MDTypography>
    );
    stockindex.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    rows.push(stockindex)
  })

      console.log(rows)

    return (
    <>
      {!createIndexForm ? 
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

                      <MDTypography variant="h6" color="white" py={0}>
                          Indices
                      </MDTypography>
                      <MDButton hidden={true} variant="outlined" size="small" onClick={()=>setCreateIndexForm(true)}>
                          Create Index
                      </MDButton>
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
      :
      <>
        <CreateIndexForm createIndexForm={createIndexForm} setCreateIndexForm={setCreateIndexForm} id={id}/>
      </>
      }
      </>
    );
  }

  export default StockIndex;