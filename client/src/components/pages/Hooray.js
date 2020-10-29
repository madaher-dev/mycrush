import React, { Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  },
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  email: {
    color: '#A9A9A9'
  },
  fb: {
    color: '#3b5998'
  },
  phone: {
    color: '#34B7F1'
  },
  twitter: {
    color: '#00acee'
  },
  insta: {
    color: '#C13584'
  }
  
}))
const Hooray = ({ match, userId }) => {

  const classes = useStyles();
  let type = 'sourceId';
  let me = 'targetId'
  let name1, name2, initials1, initials2
  if (match && match.sourceId._id === userId) {type = 'targetId'
me = 'sourceId'};

if(match){
name1 = match.[me].name
 name2 = match.[type].name



  if (name1) {
    initials1 = name1.match(/\b\w/g) || [];
    initials1 = (
      (initials1.shift() || '') + (initials1.pop() || '')
    ).toUpperCase();
  }



  if (name2) {
    initials2 = name2.match(/\b\w/g) || [];
    initials2 = (
      (initials2.shift() || '') + (initials2.pop() || '')
    ).toUpperCase();
  }
}
  const email = (
    <Grid container>
      <Grid item>
        <EmailIcon color="primary" />
      </Grid>
      <Grid item>{match ? match.[type].email : <Fragment/>}</Grid>
    </Grid>
  );
  const phone = (
    <Grid container>
      <Grid item>
        <PhoneIcon className={classes.phone} />
      </Grid>
      <Grid item>{match ? match.[type].phone : <Fragment/>}</Grid>
    </Grid>
  );
  const facebook = (
    <Grid container>
      <Grid item>
        <FacebookIcon className={classes.fb} />
      </Grid>
      <Grid item>{match ? match.[type].facebook: <Fragment/>}</Grid>
    </Grid>
  );
  const twitter = (
    <Grid container>
      <Grid item>
        <TwitterIcon className={classes.twitter} />
      </Grid>
      <Grid item>{match ? match.[type].twitter: <Fragment/>}</Grid>
    </Grid>
  );
  const insta = (
    <Grid container>
      <Grid item>
        <InstagramIcon className={classes.insta} />
      </Grid>
      <Grid item>{match ? match.[type].instagram: <Fragment/>}</Grid>
    </Grid>
  );
  return (
    <Grid container direction="column"
    alignItems="center"
    justify="center">
      <Grid item container  alignItems="center"
    justify="center" xs={12}>
      <Grid item xs={2}>
        
      {match && match.[type].photo ? (<Avatar aria-label="recipe" className={classes.avatar} src= {match.[type].photo}/>
      
      ) : (
           <Avatar aria-label="recipe" className={classes.avatar}>
             {initials2}
           </Avatar>)}</Grid>
           <Grid item xs={2}>
           {match && match.[me].photo ? (<Avatar aria-label="recipe" className={classes.avatar} src= {match.[type].photo}/>
      
      ) : (
           <Avatar aria-label="recipe" className={classes.avatar}>
             {initials1}
           </Avatar>)}</Grid>
      </Grid>
    
      <Grid item xs={12} className={classes.main}>
        <Typography>
          You and   <b>{match ? match.[type].name : <Fragment/>} </b>have a crush on each others. Below are the
          contacts you can reach them on!
        </Typography>
      </Grid>
      <Grid item container xs={12} className={classes.main}>
        <Grid item>
      {match && match.[type].email ? email : ''}
        {match && match.[type].phone ? phone : ''}
        {match && match.[type].facebook ? facebook : ''}
        {match && match.[type].twitter ? twitter : ''}
        {match && match.[type].instagram ? insta : ''}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Hooray;
