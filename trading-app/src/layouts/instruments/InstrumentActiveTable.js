import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";
import Header from "./Header";

// Data
import authorsTableData from "./data/authorsTableData";
// import companyOrdersmock from "./data/companyOrdersmock";
import projectsTableData from "./data/projectsTableData";
import MDButton from '../../components/MDButton';

const InstrumentActiveTable = () => {
    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();
    return (<>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={2}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    sx={{
                                        display: 'flex',
                                        // flexDirection: 'row',
                                        justifyContent: "space-between",
                                      }}>

                                    <MDTypography variant="h6" color="white" py={1}>
                                        Active Instruments
                                    </MDTypography>
                                    <MDButton 
                                    // sx={{
                                    //     display: 'flex',
                                    //     flexDirection: 'row',

                                    //     // mt: 0,
                                    //     // mx: 3,
                                    //     // py: 2,
                                    //     // px: 2,
                                    //   }}
                                    >Add Instrument</MDButton>
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
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Histroical Traders Orders(Mock)
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: pColumns, rows: pRows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>*/}
                    </Grid> 
                </MDBox> 
                </>
    )
}

export default InstrumentActiveTable;