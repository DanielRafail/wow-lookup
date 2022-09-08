import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                danielrafail.surge.sh
      </Link>{' '}
            2021
            {'.'}
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