import React, { useState, createRef, useEffect } from 'react';
import axios from '../../axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Container,
  Snackbar,
  Chip,
  Avatar
} from '@material-ui/core';

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

const UpdateProfile = props => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setprofilePic] = useState('');

  const [message, setMessage] = useState('');
  const [type, setType] = useState(false);
  const fileInputRef = createRef();
  console.log(props);

  useEffect(() => {
    setName(props.user.name);
    setEmail(props.user.email);
    setprofilePic(props.user.photo);
  }, [props]);
  const handleChange = event => {
    event.preventDefault();
    const Url = URL.createObjectURL(event.target.files[0]);
    setFile(event.target.files[0]);
    setPreviewUrl(Url);
  };

  const submitHandler = async event => {
    // console.log(event.target.files);
    event.preventDefault();
    try {
      if (!name || !email) {
        throw new Error('Please provide name and email');
      }
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('name', name);
      formData.append('email', email);
      const res = await axios.patch(`/updateme`, formData);

      console.log(res.data.message);
    } catch (error) {
      const message = error.message;
      setType(false);
      setMessage(message);
      //console.log(error.response.data.message);
    }
  };
  const handleClose = () => {
    setMessage(null);
    setType(false);
  };
  return (
    <div>
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
              type="text"
              id="name"
              label="Name"
              name="name"
              value={name}
              onChange={event => setName(event.target.value)}
              autoFocus
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
            <input
              type="file"
              onChange={event => handleChange(event)}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Chip
              avatar={
                <Avatar
                  alt="Natacha"
                  src={
                    previewUrl ? previewUrl : `./assets/img/users/${profilePic}`
                  }
                />
              }
              label="Upload photo"
              size="medium"
              onClick={() => fileInputRef.current.click()}
            />

            {previewUrl ? (
              <img src={previewUrl} alt=" " width="200" height="200" />
            ) : null}

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
    </div>
  );
};

export default UpdateProfile;
