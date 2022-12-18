import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
// import UploadImage from './UploadImage';
import { useNavigate } from "react-router-dom";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// import { TextField } from '@mui/material';

const Searchbar = () => {

    const inputQuery = (e) => {
        var lowercase = e.target.value.toLowerCase()
        setInputText(lowercase);
        console.log(inputText)
    }
    const navigate = useNavigate();
    const [inputText, setInputText] = React.useState('');

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }



    const goToPhotos = () => {
        if (transcript !== '') {
            // var getTranscript = transcript
            // setInputText(getTranscript)
            console.log('get transcript', transcript, inputText)
            navigate({
                pathname: '/photos',
                search: `?q=${transcript}`
            });
            // getTranscript = ''
        }
        else {
            navigate({
                pathname: '/photos',
                search: `?q=${inputText}`
            });
        }

    }

    return (
        <Box
        // sx={{
        //     display: 'flex',
        //     flexDirection: 'column',
        //     alignContent: 'center',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     minHeight: "100vh",
        //     // backgroundImage: `url(${image})`,
        //     backgroundSize: "cover",
        //     backgroundPosition: "center center",
        // }}
        >

            <Box item xs={12} align="center">
                <Paper
                    component="form"
                    sx={{ m: '1px', p: '4px 4px', display: 'flex', alignItems: 'center', width: 570 }}
                >
                    {!transcript ? (<InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search location, properties, residental group"
                        inputProps={{ 'aria-label': 'search houses' }}
                        value={inputText}
                        onChange={inputQuery}
                    />) : (<InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search location, properties, residental group"
                        inputProps={{ 'aria-label': 'search houses' }}
                        value={transcript}
                    />)}

                    <IconButton type="button" sx={{ p: '10px' }} onClick={SpeechRecognition.startListening} onDone={inputQuery}>
                        <KeyboardVoiceIcon />
                    </IconButton>
                    <IconButton type="button" sx={{ p: '10px' }} onClick={SpeechRecognition.stopListening}>
                        <MicOffIcon />
                    </IconButton>
                    <IconButton type="button" sx={{ p: '10px' }} onClick={resetTranscript}>
                        <RestartAltIcon />
                    </IconButton>
                    {/* <MicTranscribe  /> */}
                    <IconButton type="button" sx={{ p: '10px' }} component={Link} aria-label="search" onClick={goToPhotos} to={`/photos?q=${transcript || inputText}`}>
                        <SearchIcon />
                    </IconButton>

                </Paper>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                {/* <UploadImage /> */}
            </Box>

        </Box >


    );
};

export default Searchbar;