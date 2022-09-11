import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

/**
 * Create the HTML tags for a paragraph with the website and copyright
 * @returns String with the paragraph
 */
function Copyright() {
  return (
    <Typography variant="body1">
      {"Copyright © "}
      <Link color="inherit">WoW-Lookup.surge.sh</Link> 2022
      <br />
      <br />
      Also add here references to all APIs used
    </Typography>
  );
}

/**
 * Footer page with copyright information
 * @returns HTML and logic components for the Footer page
 */
export default function Footer() {
  return (
    <div className="no-margin footer-container">
      <footer className="footer">
        <CssBaseline />
        <Container maxWidth="sm">
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}
