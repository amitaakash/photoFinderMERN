import React, { Suspense, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Switch,
  Grid
} from '@material-ui/core';
import { pixBayAxios } from '../../axios';
import { Route, useHistory, useParams } from 'react-router-dom';
import ImageList from '../imageList/imageList';
//import ImageView from '../imageView/imageView';

const ImageView = React.lazy(() => import('../imageView/imageView'));
const useStyles = makeStyles(themes => ({
  root: {
    minWidth: 275,
    marginBottom: 5
  },
  TextField: {
    marginBottom: 20
  },
  formControl: {
    [themes.breakpoints.down('sm')]: {
      justifyContent: 'center'
    },
    [themes.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  radioGroup: { justifyContent: 'center' },
  switch: { alignSelf: 'center' }
}));

const Search = () => {
  const [state, setState] = useState({
    searchText: '',
    features: {
      amount: 20,
      typeOfImage: 'all',
      safeSearch: true,
      imageCount: 0
    },
    //apiKey: process.env.react_app_api_key,
    apiKey: '15125998-7c752c1330aec57890fecd448', //process.env.REACT_APP_API_KEY,
    images: []
  });
  const [page, setPage] = React.useState(1);
  const history = useHistory();
  const params = useParams();

  const prevStateRef = useRef();
  prevStateRef.current = state;

  useEffect(() => {
    console.log('{SearchJS ==> renders}');

    const fetchImages = async () => {
      try {
        const res = await pixBayAxios.get(
          `?key=${state.apiKey}&q=${state.searchText}&per_page=${state.features.amount}&page=${page}&image_type=${state.features.typeOfImage}&safesearch="${state.features.safeSearch}"`
        );
        setState(prevState => ({
          ...prevState,
          images: res.data.hits,
          imageCount: res.data.totalHits
        }));

        /*  setState(prevState => ({
            ...prevState,
            images: res.data.hits,
            imageCount: res.data.totalHits
          })); */
        /* if (Object.keys(params).length) {
            history.push('/');
            setState(prevState => ({
              ...prevState,
              images: res.data.hits,
              imageCount: res.data.totalHits
            }));
          } else {
           ;
          } */
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, [state.features, state.searchText, state.apiKey, history, page]);

  const classes = useStyles();
  const onTextChange = e => {
    const val = e.target.value;
    setState(prevState => ({ ...prevState, searchText: val }));
    if (Object.keys(params).length) {
      history.push('/');
    }
    //setState({ [e.target.name]: val });
    if (val === '') {
      setState(prevState => ({ ...prevState, images: [] }));
    }
  };

  const handleChange = (event, field) => {
    // console.log(event.target.checked);
    const stateNew = { ...state };
    const features = { ...stateNew.features };
    if (field === 'safeSearch') {
      features[field] = event.target.checked;
    } else {
      features[field] = event.target.value;
    }
    setState(prevState => ({ ...prevState, features }));
    if (Object.keys(params).length) {
      history.push('/');
    }
  };
  const handlePageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  console.log(params);
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12}>
              <TextField
                className={classes.TextField}
                id="standard-basic"
                name="searchText"
                label="Enter your search"
                fullWidth
                onChange={onTextChange}
                value={state.searchText}
              />
            </Grid>
          </Grid>

          <div>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={12} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                  <Select
                    name="amount"
                    label="Amount"
                    value={state.features.amount}
                    onChange={e => handleChange(e, 'amount')}
                    autoWidth
                  >
                    <MenuItem value={5}>05</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl className={classes.formControl}>
                  <RadioGroup
                    aria-label="position"
                    name="position"
                    value={state.features.typeOfImage}
                    onChange={e => handleChange(e, 'typeOfImage')}
                    row
                    className={classes.radioGroup}
                  >
                    <FormControlLabel
                      value="all"
                      control={<Radio color="primary" />}
                      label="All"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="photo"
                      control={<Radio color="primary" />}
                      label="Photo"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="illustration"
                      control={<Radio color="primary" />}
                      label="Illustration"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="vector"
                      control={<Radio color="primary" />}
                      label="Vector"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl className={classes.formControl}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.features.safeSearch}
                        onChange={e => handleChange(e, 'safeSearch')}
                        value={state.features.safeSearch}
                        color="primary"
                      />
                    }
                    label="Safe Search"
                    className={classes.switch}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <Route
          path="/"
          exact
          render={() => (
            <ImageList
              images={state.images}
              apiKey={state.apiKey}
              onPageChange={handlePageChange}
              totalHits={state.imageCount}
            />
          )}
        />
        <Route path="/photos/:id" component={ImageView} />
      </Suspense>
    </>
  );
};
export default React.memo(Search);
