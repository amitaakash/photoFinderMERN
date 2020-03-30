import React, { useEffect, useState } from 'react';
import { pixBayAxios } from '../../axios';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '../imageList/imageList';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

const Wislist = ({ images }) => {
  const classes = useStyles();
  const [fetchedImages, setImages] = useState([]);
  //const [page, setPage] = React.useState(1);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const resArray = images.map(image =>
          pixBayAxios.get(
            `?key=15125998-7c752c1330aec57890fecd448&q=&id=${image}`
          )
        );
        const imagesValue = await Promise.all(resArray);
        // console.log(imagesValue);
        setImages(imagesValue.map(val => val.data.hits[0]));
      } catch (error) {}
    };
    fetchImages();
  }, [images]);
  /*  const handlePageChange = (event, pageNumber) => {
    setPage(pageNumber);
  }; */

  return (
    <div className={classes.root}>
      <ImageList
        images={fetchedImages}
        //apiKey="15125998-7c752c1330aec57890fecd448"
        //onPageChange={handlePageChange}
        //totalHits={images.length}
      />
    </div>
  );
};

export default Wislist;
