import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Button, List } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import UserInfo from '../imageDetails/userInfo';
//import axios from '../../axios';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    margin: 10,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 3
  },
  img: {
    width: '100%'
  },
  lists: {
    '&:not(:last-child)': {
      borderBottom: '1px solid #ccc'
    }
  },
  button: {
    margin: '1rem auto 0 auto'
  }
}));

const ImageView = props => {
  const classes = useStyles();
  const [image, setImage] = useState({});
  //const { id } = useParams();
  const history = useHistory();
  //const apiKey = process.env.react_app_api_key;
  //const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    setImage(history.location.state);
    // console.log(id);
    /* axios
      .get(`?key=${apiKey}&id=${id}`)
      .then(res => {
        //  console.log(res);
        setImage(res.data.hits[0]);
      })
      .catch(err => console.log(err)); */
  }, [history.location.state]);
  console.log('histoy:', history);
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={8}>
        <Box className={classes.paper}>
          <img
            src={image.largeImageURL}
            alt={image.tags}
            className={classes.img}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <UserInfo image={image} />
        <Box className={classes.paper}>
          <List className={classes.lists}>Type: {image.type}</List>
          <List className={classes.lists}>Tags: {image.tags}</List>
          <List className={classes.lists}>
            Dimension: {image.imageWidth} x {image.imageHeight}
          </List>
          <List className={classes.lists}>Size: {image.imageSize}</List>
          <List className={classes.lists}>Views: {image.views}</List>
          <List className={classes.lists}>Downloads: {image.downloads}</List>
          <List className={classes.lists}>Favorites: {image.favorites}</List>
          <List className={classes.lists}>Likes: {image.likes}</List>
          <List className={classes.lists}>Comments: {image.comments}</List>
          <List className={classes.lists}>User: {image.user}</List>
          <Button
            href={image.pageURL}
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
            targer="_blank"
          >
            Download
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ImageView;
