import React from 'react';
import Verify from './Verify';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: 500
  },

  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  button: {
    flex: 3,
    display: 'flex'
  },
  button2: {
    alignSelf: 'flex-end'
  }
});

const NetworksBox = () => {
  const classes = useStyles();
  const addNetwork = {
    pathname: '/verify',
    addOpen: true
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Networks
        </Typography>
        <Verify />
      </CardContent>
      <CardActions className={classes.button}>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          className={classes.button2}
          component={Link}
          to={addNetwork}
        >
          Connect More
        </Button>
      </CardActions>
    </Card>
  );
};

export default NetworksBox;
