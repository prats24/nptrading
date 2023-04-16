import React,{useState, useEffect, useContext} from 'react'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import axios from "axios";
import { CircularProgress } from "@mui/material";



function LastTrade({contestId, portfolioId, Render}){

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [orders, setOrders] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
    const {render, setReRender} = Render;

    useEffect(()=>{
        // console.log("contestId", contestId)
        axios.get(`${baseUrl}api/v1/contest/${contestId}/trades/lastFiveTrade`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
        })
        .then((res) => {
            console.log("lastTrade",res.data)
            setOrders(res.data.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            return new Error(err);
        })

    }, [render])
    

return (
    <>
        <Grid container>
            <Grid item xs={12} md={12} lg={12}>
                <MDTypography fontSize={13} style={{fontWeight:500}} color="light">Contest Order</MDTypography>
            </Grid>
        </Grid>


        {isLoading ?
        <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>

        :
        <>
{/*    */}
        <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
            
            <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>INSTRUMENT</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>TYPE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.3} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>PRODUCT</MDTypography>
            </Grid>

            <Grid item xs={15} md={12} lg={1.3} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>QUANTITY</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>AVG. PRICE</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:500}}>AMOUNT</MDTypography>
            </Grid>

            <Grid item xs={12} md={12} lg={1.7} display="flex" justifyContent="center">
                <MDTypography fontSize={10} color="light" style={{fontWeight:400}}>STATUS</MDTypography>
            </Grid>

        </Grid>

        {orders.map((elem)=>{

            return(
            <Grid container mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
        
                <Grid item xs={12} md={12} lg={2.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:600}}>{elem.symbol}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color={elem.buyOrSell == "BUY" ? 'success' : 'error'} style={{fontWeight:600}}>{elem.buyOrSell}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.2} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:600}}>{elem.Product}</MDTypography>
                </Grid>
    
                <Grid item xs={12} md={12} lg={1.2} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:600}}>
                        {elem.Quantity}
                    </MDTypography>
                </Grid>
                <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:600}}>
                        {"₹"+elem.average_price.toFixed(2)}
                    </MDTypography>
                </Grid>
                

    
                <Grid item xs={12} md={12} lg={1.5} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color="light" style={{fontWeight:600}}>
                        {"₹"+Math.abs(elem.amount).toFixed(0)}
                    </MDTypography>
                </Grid>

                <Grid item xs={12} md={12} lg={1.7} display="flex" justifyContent="center">
                    <MDTypography fontSize={11.5} color={elem.status == "COMPLETE" ? "success" : "error"} style={{fontWeight:600}}>
                        {elem.status}
                    </MDTypography>
                </Grid>
    
            </Grid>
            )
        })}
        </>
        }
    </>
);
}

export default LastTrade;