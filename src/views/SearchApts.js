import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { inputAdornmentClasses } from "@mui/material";
import { aptService } from "../services/aptService";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function SearchApts() {
    const location = useLocation();
    // console.log(location.pathname)
    const textInput = location.search.slice(3, location.search.length) //"1%20Dekalb%20Ave"
    const decodedAddress = decodeURIComponent(textInput); //1 Dekalb
    const searchType = location.state.searchType
    console.log('getInput', decodedAddress)
    console.log('searchType', searchType)

    const [urls, setUrls] = React.useState([]);

    useEffect(function () {
        getSearchResult(textInput);
    }, [])

    const config = {
        headers: {
            // 'isGeneral': searchType,
            'isGeneral': 'general',
            // 'Accept': '*/*',
            // 'Content-Type': 'application/json',
            // 'X-Api-Key': 'CL93pjmrta9aRzTAxqzne9PLZ1zUaXwL2GRjLQCA',

        },
    };
    const getSearchResult = (decodedAddress) => {
        // call API
        console.log('hi', decodedAddress)
        aptService.getApt(decodedAddress, config)
            .then(function (response) {
                console.log(response)
                // setUrls(response.data.results)
            })
            .catch(function (error) {
                console.log(error)
            })
        console.log('check')
    }
    // console.log(urls)

    // const urls = ['https://photo-fw2155-zz3523.s3.amazonaws.com/dragon-posing-with-fire.png', 'https://photo-fw2155-zz3523.s3.amazonaws.com/006.png']

    return (
        // <h1>{location.search}</h1>
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {urls.map((item) => (
                <ImageListItem key={item}>
                    <img
                        src={`${item}?w=164&h=164&fit=crop&auto=format`}
                        // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        // alt={item.title}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};