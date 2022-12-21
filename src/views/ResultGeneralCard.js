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

export default function ResultGeneralCard({ address, price, fullAddress, bedroom, imageUrl }) {
    const [expanded, setExpanded] = React.useState(false);
    const [iconColor, setIconColor] = React.useState('inherit');
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleFavClick = () => {
        setIconColor(iconColor === 'inherit' ? 'secondary' : 'inherit');
    };
    // const index = Math.floor(Math.random() * imageList.length);
    // const imageUrl = imageList[index];


    return (
        <Card sx={{ width: 345, height: 430 }}>
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
                <Typography variant="body2" color="text.secondary">
                    {fullAddress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Bedroom: {bedroom}
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={handleFavClick}>
                    <FavoriteIcon color={iconColor} />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                {/* <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore> */}
            </CardActions>
            {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                        aside for 10 minutes.
                    </Typography>
                    <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                        medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                        occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
                        large plate and set aside, leaving chicken and chorizo in the pan. Add
                        pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
                        stirring often until thickened and fragrant, about 10 minutes. Add
                        saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                    </Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with artichokes and
                        peppers, and cook without stirring, until most of the liquid is absorbed,
                        15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
                        mussels, tucking them down into the rice, and cook again without
                        stirring, until mussels have opened and rice is just tender, 5 to 7
                        minutes more. (Discard any mussels that don&apos;t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                </CardContent>
            </Collapse> */}
        </Card>
    );
}
