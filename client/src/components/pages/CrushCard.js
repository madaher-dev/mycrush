import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
//import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
//import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Moment from 'moment';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { deleteCrush } from '../../actions/crushActions';

const useStyles = makeStyles(theme => ({
  root: {
    //minWidth: 450,
    // maxWidth: 450,

    [theme.breakpoints.up('sm')]: {
      maxWidth: 650,
      minWidth: 650
    }
  },

  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63'
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
}));

const CrushCard = ({ deleteCrush, crush }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    deleteCrush(crush._id);
    setOpen(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // if (crush.name) {
  //   var initials = crush.name.match(/\b\w/g) || [];
  //   initials = (
  //     (initials.shift() || '') + (initials.pop() || '')
  //   ).toUpperCase();
  // } else {
  //   var initials = null;
  // }

  let initials = null;

  if (crush.name) {
    initials = crush.name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || '') + (initials.pop() || '')
    ).toUpperCase();
  }

  const email = (
    <Grid container>
      <Grid item>
        <EmailIcon color="primary" />
      </Grid>
      <Grid item>{crush.email}</Grid>
    </Grid>
  );
  const phone = (
    <Grid container>
      <Grid item>
        <PhoneIcon className={classes.phone} />
      </Grid>
      <Grid item>{crush.phone}</Grid>
    </Grid>
  );
  const facebook = (
    <Grid container>
      <Grid item>
        <FacebookIcon className={classes.fb} />
      </Grid>
      <Grid item>{crush.facebook}</Grid>
    </Grid>
  );
  const twitter = (
    <Grid container>
      <Grid item>
        <TwitterIcon className={classes.twitter} />
      </Grid>
      <Grid item>@{crush.twitter}</Grid>
    </Grid>
  );
  const insta = (
    <Grid container>
      <Grid item>
        <InstagramIcon className={classes.insta} />
      </Grid>
      <Grid item>{crush.instagram}</Grid>
    </Grid>
  );
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {initials}
          </Avatar>
        }
        action={
          <IconButton onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        }
        title={crush.name}
        subheader={Moment(crush.createdAt).format('LLL')}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete this crush?'}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      /> */}
      <CardContent>
        {/* <Typography variant="body2" color="textSecondary" component="p">
          {crush.email ? email : ''}
        </Typography> */}
        {/* <Typography variant="body2" color="textSecondary" component="p"></Typography>*/}
        {crush.email ? email : ''}
        {crush.phone ? phone : ''}
        {crush.facebook ? facebook : ''}
        {crush.twitter ? twitter : ''}
        {crush.instagram ? insta : ''}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Contact Card</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

CrushCard.propTypes = {
  deleteCrush: PropTypes.func.isRequired,

  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  loading: state.crushes.loading
});

export default connect(mapStateToProps, { deleteCrush })(CrushCard);
