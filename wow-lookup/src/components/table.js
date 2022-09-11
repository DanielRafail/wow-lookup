import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

class CustomTable extends React.Component {
  /**
   * Function which returns the style the cells in the table will use
   * @returns The style for the cells
   */
  styleTableCell() {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgb(5, 5, 5)",
        color: theme.palette.common.white,
        fontSize: 24,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
        color: theme.palette.common.white,
      },
    }));
    return StyledTableCell;
  }

  /**
   * Function which returns the style the rows in the table will use
   * @returns The style for the rows
   */
  styleTableRow() {
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      "&": {
        backgroundColor: "rgb(18, 18, 18)",
      },
      // hide last border
      "&:last-child td, &:last-child th": {
        border: 0,
      },
    }));
    return StyledTableRow;
  }

  render() {
    const StyledTableCell = this.styleTableCell();
    const StyledTableRow = this.styleTableRow();
    console.log();
    return (
      <TableContainer component={Paper}>
        <Table aria-label="customized table" sx={{borderStyle:"solid"}}>
          <TableHead>
            <TableRow>
              {this.props.headers.map((header, i) => {
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
            {this.props.rows.map((row, i) => (
              <StyledTableRow key={i}>
                {Object.entries(row).map((cell, j) => {
                  if (j === 0)
                    return (
                      <StyledTableCell key={j} component="th" scope="row">
                        {cell[1]}
                      </StyledTableCell>
                    );
                  else
                    return (
                      <StyledTableCell key={j} align="center">
                        {cell[1]}
                      </StyledTableCell>
                    );
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
