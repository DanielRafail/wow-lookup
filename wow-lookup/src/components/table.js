import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableStyleDefault from "../Helper/tableStyleDefault.js"


const CustomTable = (props) => {
  /**
   * Default cells to be used in the table if none are given
   * @param {int} index index of cell we are on
   * @param {string} cell value for each table cell
   * @returns The default cell to be used in the table
   */
  function defaultCells(index, cell) {
    return (
      <StyledTableCell key={index} align="center">
        {cell}
      </StyledTableCell>
    );
  }

  const StyledTableCell = TableStyleDefault.styleTableCell();
  const StyledTableRow = TableStyleDefault.styleTableRow();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table" sx={{ borderStyle: "solid" }}>
        <TableHead>
          <TableRow>
            {props.headers.map((header, i) => {
              if (i === 0)
                return <StyledTableCell key={i}>{header}</StyledTableCell>;
              else
                return (
                  <StyledTableCell key={i} align="center">
                    {header}
                  </StyledTableCell>
                );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* First element is header, following elements are not. Only give th to first element and on dictionary read, skip first element*/}
          {props.rows.map((row, i) => (
            <StyledTableRow key={i}>
              {Object.values(row).map((cell, j) => {
                if (j === 0)
                  return (
                    <StyledTableCell key={j} component="th" scope="row">
                      {cell}
                    </StyledTableCell>
                  );
                else {
                  return props.personalizedCells ? props.personalizedCells(row, j) : defaultCells(j, cell);
                }
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CustomTable;
