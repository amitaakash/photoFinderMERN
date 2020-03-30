import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';

import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  toolbar: {
    background: 'linear-gradient(45deg, #ff6600 30%, #FF8E53 90%)'
  },
  title: {
    flexGrow: 1
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  profile: {
    textDecoration: 'none',
    color: '#fff'
  }
}));
const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);
  const handleLink = () => {
    history.push('/login');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      dispatch({ type: 'LOGOUT_USER' });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    console.log('{HeaderJS ==> renders}');
    if (!state.id) {
      const fetchUser = async () => {
        try {
          const res = await axios.get('/me');
          console.log(res);
          const user = {
            name: res.data.data.name,
            email: res.data.data.email,
            id: res.data.data._id,
            images: res.data.data.wislistImages,
            photo: res.data.data.photo
          };
          dispatch({ type: 'LOGIN_USER', user });
          // console.log('new');
        } catch (error) {
          console.log(error.response);
        }
      };
      fetchUser();
    }
  }, [state.id, dispatch]);
  //console.log(state);
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.toolbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.profile}>
              PHOTOFINDER
            </Link>
          </Typography>

          {!state.id ? (
            <Button color="inherit" onClick={handleLink} variant="outlined">
              Login
            </Button>
          ) : (
            <>
              <Avatar
                alt={state.name}
                src={`./assets/img/users/${state.photo}`}
                className={classes.menuButton}
              />
              <Typography className={classes.menuButton} variant="body1">
                <Link to="/profile" className={classes.profile}>
                  {state.name}
                </Link>
              </Typography>
              <Button color="inherit" onClick={handleLogout} variant="outlined">
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default React.memo(Header);
