import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React from "react";
import TableRow from "@mui/material/TableRow";

/**
 * Single Tab elements with the general className and ...this.props to handle all props elements
 */
 class TableStyleDefault extends React.Component {
    /**
   * Function which returns the style the cells in the table will use
   * @returns The style for the cells
   */
     static  styleTableCell() {
        const StyledTableCell = styled(TableCell)(({ theme }) => ({
          [`&.${tableCellClasses.head}`]: {
            backgroundColor: "rgb(5, 5, 5)",
            fontWeight: "bold",
            color: theme.palette.common.white,
            fontSize: 24,
          },
          [`&.${tableCellClasses.body}`]: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.palette.common.white,
          },
        }));
        return StyledTableCell;
      }
    
      /**
       * Function which returns the style the rows in the table will use
       * @returns The style for the rows
       */
      static styleTableRow() {
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
};

export default TableStyleDefault;
