import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme/theme';

const useStyles = makeStyles({
  tagContainer: {
    marginLeft: theme.spacing(2)
  },
  tag: {
    backgroundColor: theme.palette.primary.dark,
    margin: theme.spacing(0.5),
    color: theme.palette.primary.contrastText,
    textTransform: 'capitalize'
  }
});
const UserInfo = props => {
  console.log(theme);
  const classes = useStyles();
  let UserInitial = '#';
  if (props.image.user) {
    UserInitial = props.image.user.split('')[0];
  }
  let tags = [];

  if (props.image.tags) {
    tags = props.image.tags.split(',');
  }

  return (
    <>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{UserInitial}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={props.image.user}
            secondary={props.image.user_id}
          />
        </ListItem>
      </List>
      <div className={classes.tagContainer}>
        {tags.map(tag => (
          <Chip label={tag} className={classes.tag} key={tag} />
        ))}
      </div>
    </>
  );
};
export default React.memo(UserInfo);
