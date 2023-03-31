import * as React from 'react';
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

function createData(orderNo, rule) {
  return { orderNo, rule };
}

const rows = [
  createData(1, 'In case the number of participants are less than the minimum number of participants, the contest will get cancelled'),
  createData(2, 'In case the number of participants are less than the minimum number of participants, the contest will get cancelled'),
  createData(3, 'In case the number of participants are less than the minimum number of participants, the contest will get cancelled'),
  createData(4, 'In case the number of participants are less than the minimum number of participants, the contest will get cancelled'),
  createData(5, 'In case the number of participants are less than the minimum number of participants, the contest will get cancelled'),
];

export default function CustomizedTables() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        {/* <TableHead>
          <TableRow>
            <StyledTableCell>Rule No.</StyledTableCell>
            <StyledTableCell align="right">Rule</StyledTableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              {/* <StyledTableCell component="th" scope="row">
                {row.orderNo}
              </StyledTableCell> */}
              <StyledTableCell align="center">{row.orderNo}</StyledTableCell>
              <StyledTableCell align="left">{row.rule}</StyledTableCell>
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