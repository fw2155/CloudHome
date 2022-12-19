import UserPool from "../UserPool";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import login from '../services/jwtService';
// import cookie from 'react-cookies';
// import { JWT_TOKEN_COOKIE_NAME } from '../constants';
const correct_format = '@nyu.edu';
export default function SignUp() {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    // const [NetID, setNetID] = React.useState('');
    const [name, setName] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleClickOpen = () => {
        setErrorMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateEmail = (value) => {
        if (value.length < 8 || value.substring(value.length - 8) !== '@nyu.edu') {
            return 'Please enter a valid NYU email address';
        }
        return null;
    };

    const handleRegister = (event) => {
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
        const attributeList = [
            { Name: 'email', Value: email }, { Name: 'name', Value: name },
        ]
        event.preventDefault();
        UserPool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(data);
        })


        setOpen(false);
    };

    return (
        <div>
            <Button color="inherit" onClick={handleClickOpen}>
                Register
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        // validate={validateEmail}
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        // error={this.state.errorText.length === 0 ? false : true}
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="string"
                        fullWidth
                        variant="standard"
                        onChange={(event) => { setName(event.target.value) }}
                    />

                    <DialogContentText color='red'>
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleRegister}>Register</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}