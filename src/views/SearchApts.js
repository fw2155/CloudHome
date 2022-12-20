import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { inputAdornmentClasses } from "@mui/material";
import { aptService } from "../services/aptService";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import ResultCard from "./ResultCard";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function SearchApts() {
    const location = useLocation();
    // console.log(location.pathname)
    //fetch passed value from previous page
    const textInput = location.search.slice(3, location.search.length) //"1%20Dekalb%20Ave"
    const decodedAddress = decodeURIComponent(textInput); //1 Dekalb
    const searchType = location.state.searchType
    console.log('getInput', decodedAddress)
    console.log('searchType', searchType)

    const [urls, setUrls] = React.useState([]);
    const [obj, setObj] = React.useState([]);
    useEffect(function () {
        getSearchResult(textInput);
    }, [])

    const getSearchResult = (decodedAddress) => {
        // call API
        console.log('hi', decodedAddress)
        aptService.getApt(decodedAddress, {
            headers: {
                'isgeneral': 'general'
            }
        })
            .then(function (response) {
                console.log(response)
                setObj(response.data.results)
                console.log(obj)
            })
            .catch(function (error) {
                console.log(error)
            })
        console.log('check')
    }


    const numColumns = 3;
    const numRows = Math.ceil(obj.length / numColumns);



    return (
        // <h1>{location.search}</h1>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: "100vh",
                backgroundColor: '#e2deee',
                backgroundSize: "cover",
                backgroundPosition: "center center",
            }}
        >
            <div>
                {[...Array(numRows)].map((_, rowIndex) => (
                    <Box key={rowIndex} display="flex">
                        {obj.slice(rowIndex * numColumns, (rowIndex + 1) * numColumns).map(result => (
                            <Box key={result.Address} flex={1} m={1}>
                                <ResultCard
                                    address={result.Address}
                                    price={result.Price}
                                    fullAddress={result.FullAddress}
                                    bedroom={result.Bedroom}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </div>

            {/* <div>
                {obj.map(result => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: "100vh",
                            backgroundColor: '#e2deee',
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                        }}
                    >
                        <ResultCard
                            // key={result.address}
                            // address={result.address}
                            // price={result.price}
                            // fullAddress={result.fullAddress}
                            // bedroom={result.bedroom}
                            address={result.Address}
                            price={result.Price}
                            fullAddress={result.FullAddress}
                            bedroom={result.Bedroom}
                        />
                    </Box>
                ))}
            </div> */}




            {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
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
            </ImageList> */}
        </Box >
    );
};