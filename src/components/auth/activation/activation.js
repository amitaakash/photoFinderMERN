import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Button,
  TextField
} from '@material-ui/core';
import axios from '../../../axios';
import { makeStyles } from '@material-ui/core/styles';

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
const Activate = () => {
  const classes = useStyles();
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [reactivate, setReactivate] = useState(false);
  const [email, setEmail] = useState('');
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    async function activateUser() {
      console.log(params.id);
      if (params.id) {
        try {
          const res = await axios.get(`activate/${params.id}`);
          console.log(res);
          setStatus(true);
          setMessage('Your account is succefully activated! Please try again');
          setTimeout(() => {
            history.push('/login');
          }, 3000);
        } catch (error) {
          const errMessage = error.response.data.message;
          if (errMessage === 'expired') {
            setReactivate(true);
          } else {
            setStatus(true);
            setMessage('There was something wrong! Please try again');
          }
        }
      }
    }
    activateUser();
    return () => {
      setStatus(false);
      setMessage('');
      setReactivate(false);
    };
  }, [history, params]);

  const submitForm = async event => {
    event.preventDefault();
    try {
      await axios.patch(`/activate`, { email });
    } catch (error) {
      const errMsg = error.response.data.message;
      if (errMsg === error.response.data.message) {
        setStatus(true);
        setMessage(
          'Your Acoount is already activated. Please login with your email and password'
        );
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      }
    }
  };

  let content = <CircularProgress />;

  if (reactivate || !params.id) {
    content = (
      <div>
        <h1>Activate your account</h1>
        <form className={classes.form} noValidate onSubmit={submitForm}>
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
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Reactivation Link
          </Button>
        </form>
      </div>
    );
  }
  if (status) {
    content = (
      <div>
        <h1>{message}</h1>
      </div>
    );
  }
  return (
    <Container
      maxWidth="sm"
      style={{ marginTop: 30, padding: 30, textAlign: 'center' }}
    >
      <div>{content}</div>
    </Container>
  );
};

export default Activate;
