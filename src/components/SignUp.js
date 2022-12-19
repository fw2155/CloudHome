import UserPool from "../UserPool";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
// import login from '../services/jwtService';
// import cookie from 'react-cookies';
// import { JWT_TOKEN_COOKIE_NAME } from '../constants';

export default function SignUp() {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isValid, setIsValid] = React.useState(true);
    // const [NetID, setNetID] = React.useState('');
    const [name, setName] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [alertOpen, setAlertOpen] = React.useState(true);

    const handleClickOpen = () => {
        setErrorMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEmail = (event) => {
        const value = event.target.value;
        if (value.length >= 8) {
            setIsValid(value.match(/^[^@]+@nyu\.edu$/));
        }

    };

    const handleAlertClose = () => {
        setAlertOpen(false);
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
                    <Collapse in={alertOpen}>
                        <Alert
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setAlertOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            style={{ color: '#00000099' }}
                            severity="info"
                        // sx={{ mb: 2 }}
                        >
                            You will receive a verification email after register.
                        </Alert>
                    </Collapse>
                    {/* <Alert style={{ color: '#00000099' }} severity="info" icon={<InfoIcon fontSize="inherit" />}>
                        You will receive a verification email after register.
                    </Alert> */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        // validate={validateEmail}
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        error={!isValid}
                        helperText={isValid ? '' : 'Please enter a valid NYU email address'}
                        InputProps={{
                            inputProps: {
                                pattern: '^[^@]+@nyu\.edu$',
                                onChange: handleEmail
                            }
                        }}
                    // error={this.state.errorText.length === 0 ? false : true}
                    // onChange={(event) => { setEmail(event.target.value) }}
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