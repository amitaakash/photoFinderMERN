import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  Grid,
  Paper,
  Card,
  Avatar,
  Container,
  Typography,
  Tabs,
  Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateProfile from './updateProfile';
import UpdatePassword from './updatePassword';
import Wislist from './wishlist';
import theme from '../../theme/theme';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3)
  },
  paper: {
    color: '#fff',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    padding: 30
  },
  avatarLarge: {
    width: 200,
    height: '100%',
    minHeight: 200,
    border: '5px solid #fff'
  }
});

const Profile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const { state } = useContext(AuthContext);
  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Card variant="outlined">
          <Grid container className={classes.paper}>
            <Grid item xs={3}>
              <Avatar
                src="./assets/img/profile.jpeg"
                className={classes.avatarLarge}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography variant="h4">{state.name}</Typography>
              <Typography variant="overline">{state.email}</Typography>
            </Grid>
          </Grid>
        </Card>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleChange}
          >
            <Tab label="Wishlist" />
            <Tab label="Update Profile" />
            <Tab label="Update Password" />
          </Tabs>
        </Paper>
        <div>
          {value === 1 ? (
            <UpdateProfile user={state} />
          ) : value === 2 ? (
            <UpdatePassword />
          ) : (
            <Wislist images={state.images} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Profile;
