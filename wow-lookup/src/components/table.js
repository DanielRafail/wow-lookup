import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import { useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

class CustomTable extends React.Component {
  styleTableCell(){
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      return StyledTableCell;
  }

  styleTableRow(){
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
      return StyledTableRow;
  }

  render() {
    const StyledTableCell = this.styleTableCell();
    const StyledTableRow = this.styleTableRow();
    //Filler for now while working on APIs
    const rows = [
      {
        name: "Frozen yoghurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: "Frozen yoghurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: "Frozen yoghurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: "Frozen yoghurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
      {
        name: "Frozen yoghurt",
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
      },
    ];

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
                {this.props.headers.map((header, i) => {
                    return <StyledTableCell key={i}>{header}</StyledTableCell>
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* First element is header, following elements are not. Only give th to first element and on dictionary read, skip first element*/}
            {rows.map((row, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                {Object.entries(row).slice(1).map((rowValue, j) => {
                    <StyledTableCell align="right">{rowValue}</StyledTableCell>
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
export default CustomTable;
