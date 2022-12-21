import React, { useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { inputAdornmentClasses } from "@mui/material";
import { aptService } from "../services/aptService";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import ResultGeneralCard from "./ResultGeneralCard";
import ResultSubleaseCard from "./ResultSubleaseCard";
// import { AccountContext } from "../components/Account";


export default function SearchApts() {
    const location = useLocation();
    // console.log(location.pathname)
    //fetch passed value from previous page
    const textInput = location.search.slice(3, location.search.length) //"1%20Dekalb%20Ave"
    const decodedAddress = decodeURIComponent(textInput); //1 Dekalb
    const searchType = location.state.searchType
    console.log('getInput', decodedAddress)
    console.log('searchType', searchType)

    // const [urls, setUrls] = React.useState([]);
    const [obj, setObj] = React.useState([]);
    useEffect(function () {
        getSearchResult(textInput);
    }, [])

    // console.log(renterName, renterEmail)
    const getSearchResult = (decodedAddress) => {
        // call API
        console.log('hi', decodedAddress)
        aptService.getApt(decodedAddress, {
            headers: {
                'isgeneral': searchType
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

    const imageList = [
        'https://media.istockphoto.com/id/1388026461/photo/apartment-buildings-in-a-residential-area.jpg?b=1&s=170667a&w=0&k=20&c=qXuT2g8XBsOlEcFNGltso_GApGFZEV0FjR2S44VuFK4=',
        'https://thumbs.cityrealty.com/assets/smart/736x/webp/1/16/1655f4e3904fb79cb987ab7755d2b3f4b8f37f88/1-city-point.jpg',
        'https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg',
        'https://img.zumpercdn.com/486165561/1280x960',
        'https://www.relatedrentals.com/sites/default/files/2022-10/Westminster_16H_3.jpg',
        'https://images1.apartments.com/i2/F7_APKUtPtKPLll5pNYij_Z7YqW0p6swHTh4mEXsqbI/117/95-wall-new-york-ny-building-photo.jpg',
        'https://cdn.vox-cdn.com/thumbor/KUvQg5uiYBTU0txCmnv3DTu1nL4=/0x0:1000x667/1200x800/filters:focal(420x254:580x414)/cdn.vox-cdn.com/uploads/chorus_image/image/50994531/90sfstudio.0.jpg',
        'https://res.cloudinary.com/apartmentlist/image/upload/f_auto,q_auto,t_web-base/0ae853f54511b8f343168aae5d86a326.jpg',
        'https://www.decorilla.com/online-decorating/wp-content/uploads/2022/03/New-York-apartment-style-concept-by-Decorilla.jpg',
        'https://wp-tid.zillowstatic.com/bedrock/app/uploads/sites/26/nyc-apartments-for-1m-west-village-e3b3e3.jpeg',
        'https://images1.apartments.com/i2/8t5pitCqc_akYi1v0sgsGGWPex7l6cgw0Frlk7xhcmE/117/the-ritz-plaza-new-york-ny-building-photo.jpg',
        'https://images1.apartments.com/i2/QXrOPFeW1b-em5PR_I3yNdDgtvlhO5fvdO_Mvrwl9iU/117/park-towers-south-new-york-ny-building-photo.jpg',
        'https://img.zumpercdn.com/434939807/1280x960',
        'https://cdngeneral.rentcafe.com/dmslivecafe/3/1112048/HawkinsWay-97ColumbiaHeights-3925.jpg?width=380',
        'https://images1.apartments.com/i2/c4ZU6MfpZ0HHHw2TYSLsSUNREKiCdB4waAEcNnAqs98/117/517-w-113th-st-new-york-ny-building-photo.jpg',
        'https://photos.zillowstatic.com/fp/00ca20c0f040f67e66bfc6738275e5fa-p_e.jpg',
        'https://images1.apartments.com/i2/47YF1asg2uFn7Gadwamv0VMhCQmkAmWEGiDGCNIM37k/117/the-cole-by-stonehenge-new-york-ny-interior-photo.jpg',
        'https://photos.renthop.com/p/c/420x300/65252945_68e70135d1d0455e808b9a7ec60f70d4.jpg',
        'https://photos.zillowstatic.com/fp/3b3f51fa2a0c860bd84541b81d1e0a96-se_large_800_400.jpg',
        'https://photos.renthop.com/p/c/420x300/65900238_7ceeae776287d8c733be574e98f64e65.jpg',
        'https://images1.forrent.com/i2/VW-X3p9vcQ2YBd8WiTj9lOkF8y9XUK6O0cNEGukjwvU/117/image.jpg',

    ]
    // const index = Math.floor(Math.random() * imageList.length);
    // const imageUrl = imageList[index];
    if (searchType == 'general') {
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
                                    <ResultGeneralCard
                                        address={result.Address}
                                        price={result.Price}
                                        fullAddress={result.FullAddress}
                                        bedroom={result.Bedroom}
                                        imageUrl={imageList[Math.floor(Math.random() * imageList.length)]}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </div>
            </Box >
        );
    }
    else {
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
                                <Box key={result.address} flex={1} m={1}>
                                    <ResultSubleaseCard
                                        address={result.address}
                                        price={result.price}
                                        bedroom={result.bedrooms}
                                        bathroom={result.bathroom}
                                        contact={result.contact}
                                        other={result.other}
                                        startDate={result.startDate}
                                        endDate={result.endDate}
                                        imageUrl={imageList[Math.floor(Math.random() * imageList.length)]}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </div>
            </Box >
        );
    }

};