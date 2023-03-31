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


import ContestRuleData from "./data/contestRuleData";
import CreateRuleForm from "./CreateRules"

const ContestRules = () => {

    const [reRender, setReRender] = useState(true);
    const [createRuleForm,setCreateRuleForm] = useState(false);
    const [constestRules,setContestRules] = useState([]);
    const { columns, rows } = ContestRuleData();
    const [id,setId] = useState();

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
  
      axios.get(`${baseUrl}api/v1/contestrules`)
      .then((res)=>{
                setContestRules(res.data);
                console.log(res.data)
        }).catch((err)=>{
          return new Error(err);
      })
  },[createRuleForm])

  constestRules.map((elem)=>{
    let contestRule = {}

    contestRule.view = (
      // <MDButton variant="text" color="info" size="small" sx={{fontSize:10}} fontWeight="medium">
        <GrFormView onClick={()=>{setCreateRuleForm(true);setId(elem._id)}}/>
      // </MDButton>
    );
    contestRule.ruleName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.ruleName}
      </MDTypography>
    );
    contestRule.createdby = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdBy}
      </MDTypography>
    );
    contestRule.createdon = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.createdOn}
      </MDTypography>
    );
    contestRule.status = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.status}
      </MDTypography>
    );

    rows.push(contestRule)
  })

      console.log(rows)

    return (
    <>
      {!createRuleForm ? 
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
                          Contest Rules
                      </MDTypography>
                      <MDButton hidden={true} variant="outlined" size="small" onClick={()=>setCreateRuleForm(true)}>
                          Create Contest Rule
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
        <CreateRuleForm createRuleForm={createRuleForm} setCreateRuleForm={setCreateRuleForm} id={id}/>
      </>
      }
      </>
    );
  }

  export default ContestRules;