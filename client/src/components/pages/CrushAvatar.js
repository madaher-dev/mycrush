import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63'
  }
}));

const CrushAvatar = ({ name }) => {
  let initials = null;
  const classes = useStyles();
  if (name) {
    initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || '') + (initials.pop() || '')
    ).toUpperCase();
  }
  return (
    <Avatar aria-label="recipe" className={classes.avatar}>
      {initials}
    </Avatar>
  );
};

export default CrushAvatar;
