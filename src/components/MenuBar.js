//import * as React from 'react';
import React, { useState, useContext, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Status from './Status';
import { AccountContext } from "./Account";

const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#e2deee',
        },
    },
});



export default function MenuBar() {
    //   const token = cookie.load(JWT_TOKEN_COOKIE_NAME);
    //   const handleLogout = () => {
    //     cookie.remove(JWT_TOKEN_COOKIE_NAME);
    //     window.location.reload();
    //   };
    const [status, setStatus] = useState(false);
    const { getSession, logout } = useContext(AccountContext);
    useEffect(() => {
        getSession()
            .then(session => {
                console.log("Session: ", session);
                setStatus(true);
            });
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
                <AppBar position="static" color='secondary'>

                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        </Typography>
                        <Button to="/" component={Link} color="inherit">Home</Button>
                        <Button to="/chat" component={Link} color="inherit">BOTChat</Button>
                        <Button to="/contact" component={Link} color="inherit">Contact</Button>
                        {/* <Button color='inherit'>Register/Login</Button> */}
                        {/* <Account.Account> */}
                        {/* <Account> */}
                        {/* <Status /> */}

                        {/* <SignUp /> */}
                        {/* <LogIn /> */}
                        <>
                            {status ? <Button color='inherit' onClick={logout}>Logout</Button> : (<><LogIn /><SignUp /></>)}
                        </>
                        {/* </Account> */}
                        {/* </Account.Account> */}
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </Box>
    );
}