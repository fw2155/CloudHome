import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import InputAdornment from '@mui/material/InputAdornment';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { aptService } from '../services/aptService';
// import Uploadfile from './Uploadfile';
import UploadAlert from './UploadAlert';

export default function UploadSublease() {
    const [open, setOpen] = React.useState(false);
    const [city, setCity] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [bedroom, setBedroom] = React.useState("");
    const [bathroom, setBathroom] = React.useState("");
    const [zipcode, setZipcode] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [contact, setContact] = React.useState("");
    const [other, setOther] = React.useState("");
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('info');

    //handle click open
    const handleClickOpen = () => {
        setOpen(true);
    };
    //handle file upload
    function handleCity(event) {
        setCity(event.target.value);
        console.log(city)
    }
    function handleAddress(event) {
        setAddress(event.target.value);
        console.log(address)
    }
    function handleBedroom(event) {
        setBedroom(event.target.value);
        console.log(bedroom)
    }
    function handleBathroom(event) {
        setBathroom(event.target.value);
        console.log(bathroom)
    }
    function handleContact(event) {
        setContact(event.target.value);
        console.log(contact)
    }
    function handlePrice(event) {
        setPrice(event.target.value);
        console.log(price)
    }
    function handleStartDate(event) {
        setStartDate(event.target.value);
        console.log(startDate)
    }
    function handleEndDate(event) {
        setEndDate(event.target.value);
        console.log(endDate)
    }
    function handleOther(event) {
        setOther(event.target.value);
        console.log(other)
    }
    function handleZipcode(event) {
        setZipcode(event.target.value);
        console.log(zipcode)
    }
    //handle cancel close page
    const handleClose = () => {
        setOpen(false);
    };
    //handle upload api call and close
    const handleUploadClose = () => {
        // const base64file = dataURLtoFile(base64)
        // console.log('inside', base64)
        // const type = file.type
        // const bucket = 'photo-fw2155-zz3523'
        // const imageName = file.name
        // var formTags = ''
        // if (tag1 !== '' && tag2 !== '') {
        //     formTags = tag1.concat(', ', tag2)
        // }
        // else if (tag1 !== '' && tag2 === '') {
        //     formTags = tag1
        // }
        // else if (tag1 === '' && tag2 !== '') {
        //     formTags = tag2
        // }
        // console.log(formTags)
        const config = {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'text/plain',
                'X-Api-Key': 'CL93pjmrta9aRzTAxqzne9PLZ1zUaXwL2GRjLQCA',
            },
        };
        // photoService.sendPhoto(bucket, imageName, file, config)
        //     .then(function (response) {
        //         console.log(response)
        //         // setUrls(response.data.results)
        //     })
        //     .catch(function (error) {
        //         console.log(error)
        //     })
        const data = {
            "city": city,
            "address": address,
            "zipcode": zipcode,
            "bedroom": bedroom,
            "bathroom": bathroom,
            "startDate": startDate,
            "endDate": endDate,
            "contact": contact,
            "price": price,
            "other": other,
        }
        aptService.uploadSublease(data, config)
            .then(function (response) {
                console.log(response)
                setAlertOpen(true);
                setAlertMessage(`Successfully upload sublease`);
                setAlertSeverity('success');
                // setUrls(response.data.results)
            })
            .catch(function (error) {
                console.log(error)
            })
        // setOpen(false);
    };


    return (
        <div>
            <Button color="inherit" onClick={handleClickOpen}>
                Upload Sublease
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Sublease Info</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="city"
                        label="City"
                        fullWidth
                        variant="standard"
                        onChange={handleCity}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="address"
                        label="Address"
                        fullWidth
                        variant="standard"
                        onChange={handleAddress}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="zipcode"
                        label="Zipcode"
                        fullWidth
                        variant="standard"
                        onChange={handleZipcode}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="bedroom"
                        label="Bedroom"
                        fullWidth
                        variant="standard"
                        onChange={handleBedroom}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="bathroom"
                        label="Bathroom"
                        fullWidth
                        variant="standard"
                        onChange={handleBathroom}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="startDate"
                        label="StartDate (year-month-date)"
                        fullWidth
                        variant="standard"
                        onChange={handleStartDate}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="endDate"
                        label="EndDate (year-month-date)"
                        fullWidth
                        variant="standard"
                        onChange={handleEndDate}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="email"
                        label="Contact email"
                        fullWidth
                        variant="standard"
                        onChange={handleContact}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="price"
                        label="Price $"
                        fullWidth
                        variant="standard"
                        onChange={handlePrice}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="price"
                        label="Additional Info"
                        multiline
                        fullWidth
                        variant="standard"
                        onChange={handleOther}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleUploadClose}>Upload</Button>
                </DialogActions>
                <UploadAlert
                    alertOpen={alertOpen}
                    alertMessage={alertMessage}
                    alertSeverity={alertSeverity}
                    closeAlert={() => { setAlertOpen(false) }}
                />
            </Dialog>

        </div>
    );
}