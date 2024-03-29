import "../CSS/main.css";
import "../CSS/main.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableStyleDefault from "../CSS/tableStyleDefault.js"
import {iParse, iMythicPlusRun, iRecentMythicPlusRun, PvPBrackets} from "../interfaces/lookup/interface"

interface Props {
  headers: string[],
  rows: iParse["data"] | iMythicPlusRun[] | iRecentMythicPlusRun[] | PvPBrackets[],
  headerAlign?: "left" | "center" | "right" | "justify" | "inherit",
  personalizedCells? : any
}



const CustomTable = (props: Props) => {
  /**
   * Default cells to be used in the table if none are given
   * @param {int} index index of cell we are on
   * @param {string} cell value for each table cell
   * @returns The default cell to be used in the table
   */
  function defaultCells(index: number, cell: string) {
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
      <Table aria-label="customized table" sx={{ borderStyle: "solid", borderColor:"RGB(115,115,115)"}}>
        <TableHead>
          <TableRow>
            {props.headers.map((header, i) => {
              if (i === 0)
                return <StyledTableCell key={i}>{header}</StyledTableCell>;
              else
                return (
                  <StyledTableCell key={i} align={props.headerAlign ? props.headerAlign : "center"}>
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
                  return props.personalizedCells ? props.personalizedCells(row, j, i) : defaultCells(j, cell);
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
