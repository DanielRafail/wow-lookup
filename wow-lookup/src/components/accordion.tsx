import Accordion from "@mui/material/Accordion";
import React from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  content: React.ReactElement[];
  titles: string[];
  defaultExpanded: boolean;
  border?: string,
  margin?: string,
}

const customAccordion = (props: Props) => {
  return (
    <>
      {props.content.map((section: any, i: number) => {
        return (
          <Accordion sx={{ color: "white", border: props.border ? props.border : "", margin: props.margin ? props.margin : "inherit"}} defaultExpanded = {props.defaultExpanded}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: "white", transform: "scale(2.2)" }}
                />
              }
              aria-controls={"panel" + i + "a-content"}
              id={"panel" + i + "-header"}
              sx={{
                backgroundColor: "rgb(18, 18, 18)",
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  marginRight: "30px",
                },
                "& .MuiAccordionSummary-expandIconWrapper": {
                  marginRight: "30px",
                },
              }}
            >
              <h2>{props.titles[i]}</h2>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "rgb(18, 18, 18)" }}>
              {section}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default customAccordion;
