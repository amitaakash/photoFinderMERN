import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Snackbar
} from '@material-ui/core';

import { Alert, AlertTitle } from '@material-ui/lab';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link } from 'react-router-dom';
import axios from '../../../axios';

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    text: ''
  });
  const [accoutStatus, setAccoutStatus] = useState(false);

  // const history = useHistory();

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      console.log(formData);
      const res = await axios.post('/signup', formData);

      setAccoutStatus(true);
      console.log(res);
      setAccoutStatus(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.log(error.response.data);
      setOpen(true);
      setMessage({ type: 'error', text: error.response.data.message });
    }
  };
  const handleClose = () => {
    setOpen(prev => !open);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
      {accoutStatus ? (
        <Alert severity="success">
          <AlertTitle>Account created successfully </AlertTitle>
          Please check your email to activate your account
        </Alert>
      ) : null}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                value={formData.name}
                onChange={event => {
                  const val = event.target.value;
                  setFormData(pre => ({ ...pre, name: val }));
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={event => {
                  const val = event.target.value;
                  setFormData(pre => ({ ...pre, email: val }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={event => {
                  const val = event.target.value;
                  setFormData(pre => ({ ...pre, password: val }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={event => {
                  const val = event.target.value;
                  setFormData(pre => ({ ...pre, confirmPassword: val }));
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
