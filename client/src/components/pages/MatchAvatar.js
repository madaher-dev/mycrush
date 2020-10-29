import React, {Fragment} from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63'
  }
}));

const MatchAvatar = ({ match, userId }) => {
  const classes = useStyles();
  let type = 'sourceId'

if(match.sourceId._id === userId) type = 'targetId'


let name = match.[type].name

let initials = null;

  if (name) {
    initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || '') + (initials.pop() || '')
    ).toUpperCase();
  }

  return (
    <Fragment>
    {match.[type].photo ? (<Avatar aria-label="recipe" className={classes.avatar} src=  {match.[type].photo}/>
      
    ) : (
         <Avatar aria-label="recipe" className={classes.avatar}>
           {initials}
         </Avatar>)
       }</Fragment>
  );
};

export default MatchAvatar;
