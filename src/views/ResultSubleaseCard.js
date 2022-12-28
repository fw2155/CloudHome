import * as React from 'react';
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
import cookie from 'react-cookies';
import { aptService } from '../services/aptService';

const renterName = cookie.load('nm');
const renterEmail = cookie.load('em');

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


export default function ResultSubleaseCard({ address, price, fullAddress, bedroom, bathroom, imageUrl, startDate, endDate, contact, other }) {
    const [expanded, setExpanded] = React.useState(false);
    const [iconColor, setIconColor] = React.useState('inherit');
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    // console.log(address, renterName, renterEmail, contact)
    const data = {
        "address": address,
        "rentername": renterName,
        "renteremail": renterEmail,
        "landlordemail": contact,
    }
    const config = {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'text/plain',
            'X-Api-Key': 'CL93pjmrta9aRzTAxqzne9PLZ1zUaXwL2GRjLQCA',

        },
    };
    const dataString = JSON.stringify(data);
    const handleFavClick = () => {
        setIconColor(iconColor === 'inherit' ? 'secondary' : 'inherit');
        // console.log(address)
        if (iconColor == 'inherit') {
            console.log('here')
            aptService.notifyLandlord(dataString, config)
                .then(function (response) {
                    console.log(response)
                    // setUrls(response.data.results)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }



    };
    // const index = Math.floor(Math.random() * imageList.length);
    // const imageUrl = imageList[index];




    return (
        <Card sx={{ width: 345 }}>
            <CardHeader
                // avatar={
                //     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                //         R
                //     </Avatar>
                // }
                // action={
                //     <IconButton aria-label="settings">
                //         <MoreVertIcon />
                //     </IconButton>
                // }
                title={address}
                subheader={`$${price}`}
            />
            {/* <ImageComponent imageUrl={imageUrl} /> */}
            <CardMedia
                component="img"
                height="194"
                image={imageUrl}
            />
            <CardContent>
                {/* <Typography variant="body2" color="text.secondary">
                    {fullAddress}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                    Bedroom: {bedroom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Bathroom: {bathroom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Contact: {contact}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start Date: {startDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    End Date: {endDate}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={handleFavClick}>
                    <FavoriteIcon color={iconColor} />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Comments:</Typography>
                    <Typography paragraph>
                        {other}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
