import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function UploadAlert(props) {
    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={props.alertOpen}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={props.closeAlert}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                    severity={props.alertSeverity}
                >
                    {props.alertMessage}
                </Alert>
            </Collapse>
        </Box>
    );
}