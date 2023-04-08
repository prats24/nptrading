import * as React from 'react';
import {useContext, useState} from "react";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MDButton from "../../../components/MDButton"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));





export default function CustomizedTables({id, addRuleObject, setAddRuleObject}) {
console.log("rending...")
const [ruleData,setRuleData] = useState();
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
React.useEffect(()=>{

  axios.get(`${baseUrl}api/v1/contestrule/${id}`)
  .then((res)=>{
          setRuleData(res.data);
          console.log(res.data)
  }).catch((err)=>{
      //window.alert("Server Down");
      return new Error(err);
  })

},[addRuleObject])

const rows = ruleData ? ruleData[0]?.contestRules : [];
console.log(ruleData)
// console.log(ruleData[0]?.contestRules)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableBody>
          {rows?.map((row) => (
            <StyledTableRow key={row?._id}>
              {/* <StyledTableCell component="th" scope="row">
                {row.orderNo}
              </StyledTableCell> */}
              <StyledTableCell align="center">{row?.orderNo}</StyledTableCell>
              <StyledTableCell align="left">{row?.rule}</StyledTableCell>
              <StyledTableCell align="center">
                <MDButton size="small" color="warning" style={{fontSize:10, margin:-10}}>
                    Edit
                </MDButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}