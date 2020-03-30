import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Container, Snackbar } from '@material-ui/core';

import { useParams } from 'react-router-dom';
import axios from '../../axios';
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

const UpdatePassword = () => {
  const classes = useStyles();
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [type, setType] = useState(false);

  const params = useParams();

  const submitHandler = async event => {
    event.preventDefault();
    try {
      const data = { passwordCurrent, password, confirmPassword };
      const res = await axios.patch(`/updatemypassword/`, data);
      setMessage(res.data.message);
      setType(true);
      resetInput();
      console.log(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
      setType(false);
      console.log(error.response.data.message);
    }
  };
  console.log(params);

  const resetInput = () => {
    setPassword('');
    setConfirmPassword('');
    setPasswordCurrent('');
  };

  const handleClose = () => {
    setMessage(null);
    setType(false);
  };
  return (
    <Container maxWidth={'xs'}>
      <div className={classes.paper}>
        <Snackbar
          open={message ? true : false}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={type ? 'success' : 'error'}>
            {message}
          </Alert>
        </Snackbar>
        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="passwordCurrent"
            label="Current Password"
            name="passwordCurrent"
            value={passwordCurrent}
            onChange={event => setPasswordCurrent(event.target.value)}
            autoFocus
          />

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

export default UpdatePassword;
