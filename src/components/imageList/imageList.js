import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Axios from 'axios';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Backdrop,
  Button,
  CircularProgress
} from '@material-ui/core';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import { useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },

  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    background: 'rgba(00, 00, 00, 0.9)'
  },
  imgborder: {
    border: '10px solid #fff',
    maxHeight: '80vh',
    maxWidth: '80vh',
    backgroundColor: '#fff',
    textAlign: 'center',
    overflow: 'hidden'
  },
  img_full: {
    width: '100%',

    borderRadius: '3px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    cursor: 'pointer'
  },
  arrow: {
    color: 'rgba(255, 255, 255, 1)',
    zIndex: theme.zIndex.drawer + 2
  },
  close: {
    right: 10,
    top: 10,
    color: 'rgba(255, 255, 255, 1)',
    position: 'absolute'
  },
  img__info: {
    position: 'relative',
    textAlign: 'center'
  },
  more__info: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 300,
    backgroundColor: '#fff',
    borderRadius: 50,
    '&:hover': {
      backgroundColor: '#3f51b5',
      color: '#fff'
    }
  },
  block: {
    width: '100%'
  },
  brdr: {
    width: '20%',
    maxHeight: '200px',

    [theme.breakpoints.down('sm')]: {
      width: '50%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      width: '25%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '20%'
    }
  },
  pagination: { margin: '30px 0' }
}));

const ImageList = props => {
  const [images, setImages] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [currentImg, setCurrentImg] = React.useState('');

  const history = useHistory();
  // pagination Count
  const paginationCount = Math.round(props.totalHits / props.images.length);

  useEffect(() => {
    console.log('{ImageListJS ==> renders}');
    setImages(props.images);
  }, [props.images]);

  const handleOpen = img => {
    setOpen(true);
    setCurrentImg(img);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const changeImage = direction => {
    const imageIndex = images.findIndex(
      el => el.largeImageURL === currentImg.largeImageURL
    );
    // console.log(imageIndex);

    if (direction === 'next' && imageIndex < images.length - 1) {
      setCurrentImg(images[imageIndex + 1]);
    } else if (direction === 'prev' && imageIndex > 0) {
      setCurrentImg(images[imageIndex - 1]);
    }
  };
  const showImage = event => {
    // console.log(currentImg);
    history.push(`/photos/${currentImg.id}`, currentImg);
  };
  const classes = useStyles();
  let imageGrid;
  if (images.length !== 0) {
    imageGrid = (
      <>
        {/* <ImageGrid images={images} /> */}
        <div className={classes.block}>
          <GridList className={classes.gridList} cols={0} cellHeight="auto">
            {images.map(image => (
              <GridListTile
                key={image.id}
                /* cols={image.cols || 1} */ className={classes.brdr}
              >
                <img src={image.largeImageURL} alt={image.tags} />
                <GridListTileBar
                  title={image.tags}
                  subtitle={
                    <span>
                      by: <strong>{image.user}</strong>
                    </span>
                  }
                  actionIcon={
                    <IconButton onClick={() => handleOpen(image)}>
                      <ZoomIn className={classes.icon} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>

        {paginationCount > 1 ? (
          <div className={classes.pagination}>
            <Pagination
              count={paginationCount}
              color="primary"
              onChange={props.onPageChange}
            />
          </div>
        ) : null}
      </>
    );
  } else {
    imageGrid = <CircularProgress disableShrink />;
  }
  return (
    <div className={classes.root}>
      {imageGrid}
      <Backdrop
        className={classes.backdrop}
        open={open}
        transitionDuration={(100, 100, 100)}
      >
        <IconButton onClick={() => changeImage('prev')}>
          <ArrowBack className={classes.icon} />
        </IconButton>
        <div className={classes.imgborder}>
          <div className={classes.img__info}>
            <img
              src={currentImg.largeImageURL}
              alt=""
              className={classes.img_full}
              onClick={() => showImage()}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => showImage()}
              disableElevation
              className={classes.more__info}
            >
              More information
            </Button>
          </div>
        </div>

        <IconButton onClick={() => changeImage('next')}>
          <ArrowForward className={classes.icon} />
        </IconButton>

        <IconButton
          onClick={handleClose}
          className={classes.close}
          size="medium"
        >
          <HighlightOffRoundedIcon className={classes.icon} fontSize="large" />
        </IconButton>
      </Backdrop>
    </div>
  );
};

export default React.memo(ImageList);
