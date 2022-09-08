import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
    return (
        <Typography variant="body1">
            {'Copyright © '}
            <Link color="inherit">
                WoW-Lookup.surge.sh
            </Link>{' '}
            2022
        </Typography>
    );
}

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