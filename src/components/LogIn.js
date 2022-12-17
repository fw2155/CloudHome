import UserPool from "../UserPool";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import userEvent from "@testing-library/user-event";
// import login from '../services/jwtService';
// import cookie from 'react-cookies';
// import { JWT_TOKEN_COOKIE_NAME } from '../constants';

export default function LogIn() {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClickOpen = () => {
        setErrorMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = (event) => {
        // send login request to server (xhr, ajax) POST /api/token, return a promise
        // 1. success, store access token (jwt) to browser cookie
        // 2. failure, display error message
        // login(username, password)
        //     .then((response) => {
        //         cookie.save(JWT_TOKEN_COOKIE_NAME, response.data.access);
        //         window.location.reload();
        //     })
        //     .catch((error) => {
        //         setErrorMessage(error.response.data.detail);
        //         //   alert(error.response.data.detail);
        //     });
        // event.preventDefault();
        // UserPool.signUp(email,password,[],null,(err,data)=>{
        //     if (err)
        // })
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        })
        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });
        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: ", data)
            },
            onFailure: (err) => {
                console.error("onFailure: ", err)
            },
            newPasswordRequired: (data) => {
                console.log("newPassWordRequired: ", data)
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button color="inherit" onClick={handleClickOpen}>
                Login
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={(event) => { setEmail(event.target.value) }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(event) => { setPassword(event.target.value) }}
                    />
                    <DialogContentText color='red'>
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleLogin}>Login</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}