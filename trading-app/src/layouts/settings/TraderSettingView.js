import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";
import DataTable from "../../examples/Tables/DataTable";
import TraderSetting from "./TraderSetting";


function TraderSettingView() {

  const [userData,setUserData] = useState([]);
  const [algo, setAlgo] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

 useEffect(()=>{
       axios.get(`${baseUrl}api/v1/readpermission`)
      .then((res)=>{
          setUserData(res.data)
      }).catch((err)=>{
          return new Error(err);
      })

      axios.get(`${baseUrl}api/v1/readTradingAlgo`)
      .then((res)=>{
        let data = res.data;
                let active = data.filter((elem) => {
                    return elem.isDefault === true
                })

                setAlgo(active);

      }).catch((err)=>{
          return new Error(err);
      })
  },[])

  let columns = [
    { Header: "Trader Name", accessor: "name", align: "center" },
    { Header: "Mock/Real", accessor: "mockOrReal", align: "center" },
  ]

  let rows = [];

  userData.sort((a,b)=>{
    if(a.userName > b.userName){
        return 1
    }
    if(a.userName < b.userName){
        return -1
    }
    return 0
  })

  userData.map((elem)=>{
    let obj = {};
    if(elem.algoName === algo[0]?.algoName){
        obj.name = (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
                {(elem.userName)}
            </MDTypography>
        );
        obj.mockOrReal = (
            <MDTypography component="a" variant="caption"  fontWeight="medium">
                <TraderSetting userId={elem.userId}  isRealTradeEnable={elem.isRealTradeEnable}/>
            </MDTypography>
        );

        rows.push(obj)
    }
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
                        Trader Setting
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={true}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>
        </Grid> 
    </MDBox> 
    </>

  );
}

export default TraderSettingView;

