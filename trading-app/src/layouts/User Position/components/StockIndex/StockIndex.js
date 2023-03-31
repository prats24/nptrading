import React, {memo} from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../../components/MDBox";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';



function StockIndex() {

    const lightTheme = createTheme({ palette: { mode: 'light' } });

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 40,
        lineHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));

  return (
    <MDBox mb={0} mt={0}>
        <Grid container spacing={3}>
        {[lightTheme].map((theme, index) => (
            <Grid item xs={12} key={index} >
            <ThemeProvider theme={theme}>
                <MDBox
                sx={{
                    p: 1,
                    pb:2,
                    // bgcolor: 'background.default',
                    bgcolor: 'none',
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr 1fr 1fr' },
                    gap: 3,
                }}
                >
                {[{elevation:2,instrument:'NIFTY 50',ltp:16000,percentageChange:20,valueChange:120},{elevation:2,instrument:'BANKNIFTY',ltp:38000,percentageChange:-25,valueChange:-134}].map((e) => (
                    <Item key={e.elevation} elevation={e.elevation}>           
                    <MDBox m={0.5} fontWeight={700}>{e.instrument}</MDBox>
                    <MDBox m={0.5} fontWeight={700}>{e.ltp}</MDBox>
                    <MDBox ml={0.5} fontWeight={700} mr={0.5} mt={0.5} mb={0.2} fontSize={10} color={e.valueChange > 0 ? "success" : "error"}>{e.valueChange>0 ? '+' : ''}{e.valueChange}</MDBox>
                    <MDBox ml={0.5} fontWeight={700} mr={0.5} mt={0.5} mb={0.2} fontSize={10} color={e.percentageChange > 0 ? "success" : "error"}>({e.percentageChange>0 ? '+' : ''}{e.percentageChange}%)</MDBox>
                    </Item>
                ))}
                    <Item elevation={2}>           
                    <MDBox m={0.5} fontWeight={700}>P&L:</MDBox>
                    <MDBox m={0.5} fontWeight={700}>+12,300</MDBox>
                    </Item>
                </MDBox>
            </ThemeProvider>
            </Grid>
        ))}

        </Grid>
    </MDBox>
    )
}

export default memo(StockIndex);
