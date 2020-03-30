import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Container,
  Snackbar
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, useHistory } from 'react-router-dom';
import axios from '../../../axios';
import { Alert } from '@material-ui/lab';
import { AuthContext } from '../../../context/authContext';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = async event => {
    event.preventDefault();
    try {
      const data = { email, password };
      const user = await axios.post('/login', data);
      console.log(user.data.user);
      dispatch({ type: 'LOGIN_USER', user: user.data.user });
    } catch (error) {
      setError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (state.id) {
      history.push('/profile');
    }
  }, [state, history]);

  /* useEffect(() => {
    if (!state.name) {
      const fetchUser = async () => {
        try {
          const user = await axios.post('/islogin');
          dispatch({ type: 'LOGIN_USER', user: user.data.user });
          console.log(user);
        } catch (error) {
          console.log(error.response);
        }
      };
      fetchUser();
    }
  }, [state, dispatch]); */

  const handleClose = () => {
    setError(null);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={error ? true : false}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
