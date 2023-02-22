import React, {useState, useEffect} from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ModeTwoToneIcon from '@mui/icons-material/ModeTwoTone';


// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";
import ExpenseData1 from "./data/ExpenseData";


const ExpenseTable = ({setCreateExpense, setView, setEditData, reRender}) => {

  const {columns, rows} = ExpenseData1();
  function onCreate(){
    setCreateExpense(true);
  }


  const {checkIsView, setGetId} = setView
  const [ExpenseData,setExpenseData] = useState([]);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://ocalhost:5000/"
  async function getExpense (){
    const res = await fetch(`${baseUrl}api/v1/Expense`, {
      method: "GET",
      credentials:"include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
    },
    },
  )
  let data = await res.json()
    setExpenseData(data);
    console.log(data)
  }

  useEffect(()=>{
    getExpense()
    .then();
  },[reRender])

  function setViewFunc(id){
    setGetId(id);
    checkIsView(true)
    setEditData(ExpenseData)
    console.log("in view func")
  }


  ExpenseData.map((elem)=>{
    let ExpenseRow = {}
    const createdondate = new Date(elem.createdOn);
    const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
    const createdOn = createdondate.toLocaleDateString('en-US', options1)

    let subExpense = elem.subExpense.filter((subelem)=>{
                      return !subelem.is_Deleted
                  })
     

    ExpenseRow.view = (
        <MDButton variant="Contained" color="info" fontWeight="medium">
          <ModeTwoToneIcon onClick={(e)=>{setViewFunc(elem._id)}}/>
        </MDButton>
      );
      ExpenseRow.name = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem.name}
        </MDTypography>
      );
      ExpenseRow.unit = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.unit}
      </MDTypography>
    );
    ExpenseRow.bioMarkerTypeCount = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        { subExpense.length}
      </MDTypography>
    );
    ExpenseRow.createdOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {createdOn}
      </MDTypography>
    );
   
    rows.push(ExpenseRow)
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
                                    Expense
                                </MDTypography>

                                <MDButton variant="outlined" color="white" onClick={onCreate}>
                                  Create Expense
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
        </>
    )
}

export default ExpenseTable