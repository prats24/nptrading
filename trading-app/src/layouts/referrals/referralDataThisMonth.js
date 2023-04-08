import React, {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../AuthContext";
import { FcApprove } from 'react-icons/fc';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDBox";


// Material Dashboard 2 React example components
import DataTable from "../../examples/Tables/DataTable";

// Data
// import authorsTableData from "./data/authorsTableData";
import ReferralDataThisMonthData from './data/referralData';


const ReferralDataThisMonth = ({thisMonthsReferral,setThisMonthsReferral}) => {

    const getDetails = useContext(userContext);

    const id = getDetails.userDetails._id

    const { columns, rows } = ReferralDataThisMonthData();

    const [referralData, setReferralData] = useState([]);

    const [reRender, setReRender] = useState(true);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
    useEffect(()=>{
  
        axios.get(`${baseUrl}api/v1/myreferrals/${id}`)
        .then((res)=>{
           console.log(res?.data)
           setReferralData(res?.data?.data);
           setThisMonthsReferral(res?.data?.count);

        }).catch((err)=>{

            return new Error(err);

        })
    },[reRender])

    console.log(referralData);
    
    referralData?.map((elem)=>{
        
        let refData = {}

        const date = new Date(elem.joining_date);
        const formattedJoiningDate = date.toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
  
        refData.fullName = (
          <MDButton variant="Contained" color="info" fontWeight="medium">
            {elem.first_name} {elem.last_name}
          </MDButton>
        );
        
        refData.email = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.email}
          </MDTypography>
        );
        
        refData.doj = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {formattedJoiningDate}
          </MDTypography>
        );
        
        refData.status = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {elem.status}
          </MDTypography>
        );
     
        rows.push(refData)
        
    })


    return (
        <>
            <MDBox pt={5} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={0}
                                mt={-3}
                                py={0}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="md"
                                // coloredShadow="info"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={0}>
                                    My Referrals(This Month)
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={1}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={true}
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

export default ReferralDataThisMonth