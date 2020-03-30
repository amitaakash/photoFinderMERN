import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const date = new Date();
const useStyles = makeStyles({
  root: {
    border: 0,
    borderTop: '1px solid #ccc',
    marginTop: 5,
    fontSize: '0.8rem',
    padding: '1rem',
    textAlign: 'center'
  }
});

function Footer() {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Typography variant="subtitle2" color="textSecondary">
        &copy; {date.getFullYear()} | amit mishra
      </Typography>
    </Paper>
  );
}
export default Footer;
