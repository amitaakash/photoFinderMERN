import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Snackbar
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../axios';
import { Alert } from '@material-ui/lab';

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

const ResetPassword = () => {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [type, setType] = useState(false);

  const history = useHistory();
  const params = useParams();

  const submitHandler = async event => {
    event.preventDefault();
    try {
      const data = { password, confirmPassword };
      const res = await axios.patch(`/resetpassword/${params.id}`, data);
      setMessage(res.data.message);
      setType(true);
      setTimeout(() => {
        history.push('/');
      }, 5000);
      console.log(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
      setType(false);
      console.log(error.response.data.message);
    }
  };
  console.log(params);

  const handleClose = () => {
    setMessage(null);
    setType(false);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="Password"
            name="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ResetPassword;
