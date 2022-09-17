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
      <a
        href="https://www.youtube.com/watch?v=eQjlMk33sdk&ab_channel=tRistanthedumbifunny"
        className="a-clicked-no-change"
      >
        Contact me (change link later)
      </a>{" "}
      - 
      <a
        href="https://github.com/DanielRafail"
        className="a-clicked-no-change"
      >
        Github
      </a>
      <br />
      <br />
      Special thanks to{" "}
      <a href="https://raider.io" className="a-clicked-no-change">
        Raider.IO
      </a>
      ,{" "}
      <a href="https://www.warcraftlogs.com" className="a-clicked-no-change">
        WarcraftLogs
      </a>
      ,{" "}
      <a href="https://check-pvp.fr" className="a-clicked-no-change">
        Check-PVP
      </a>{" "}
      for the inspiration and APIs
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
        <Container maxWidth="md">
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}
