import Accordion from "@mui/material/Accordion";
import React from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const customAccordion = (props) => {
  return (
    <div>
      {props.content.map((section, i) => {
        return (
          <Accordion
            key={i}
            sx={{ color: "white" }}
            defaultExpanded={props.expanded}
          >
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
    </div>
  );
};

export default customAccordion;
