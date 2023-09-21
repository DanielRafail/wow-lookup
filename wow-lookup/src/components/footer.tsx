import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";

/**
 * Create the HTML tags for a paragraph with the website and copyright
 * @returns String with the paragraph
 */
function Copyright() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Typography variant="body1">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="footer-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            How to contact me
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Cendo on Discord
            <br />
            Cendoray@gmail.com
            <br />
            <br />
            Please keep in mind this project was done for fun, and I have other
            obligations and hobbies. As such, I may not always be able to
            respond to your inquiries in a timely manner.
            <br />
            <br />
            Thank you for your understanding
          </Typography>
        </div>
      </Modal>
      {"Copyright © "}
      <Link color="inherit">WoW-Lookup.surge.sh</Link> 2023
      <br />
      <br />
      <span onClick={handleOpen} className="a-clicked-no-change">
        Contact me
      </span>{" "}
      -
      <a href="https://github.com/DanielRafail" className="a-clicked-no-change">
        {" "}
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
