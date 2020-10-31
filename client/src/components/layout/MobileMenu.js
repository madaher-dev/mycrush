import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setMobileMenuClose, logout } from '../../actions/userActions';
import { Link } from 'react-router-dom';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import StarsIcon from '@material-ui/icons/Stars';
import AdjustIcon from '@material-ui/icons/Adjust';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileMenu = ({
  openMenu,
  setMobileMenuClose,
  logout,
  points,
  isAuthenticated
}) => {
  const classes = useStyles();

  const handleClose = () => {
    setMobileMenuClose();
  };
  const handleLogout = () => {
    handleClose();
    logout();
  };
  const authLinks = (
    <List>
      <ListItem button component={Link} to={'/welcome'} onClick={handleClose}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          secondary="An overiview page of you crushes and matches"
        />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/crushes'} onClick={handleClose}>
        <ListItemIcon>
          <LoyaltyIcon />
        </ListItemIcon>
        <ListItemText primary="Crushes" secondary="Manage your added Crushes" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/verify'} onClick={handleClose}>
        <ListItemIcon>
          <PermDataSettingIcon />
        </ListItemIcon>
        <ListItemText
          primary="Networks"
          secondary="Manage your connected Networks"
        />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/matches'} onClick={handleClose}>
        <ListItemIcon>
          <StarsIcon />
        </ListItemIcon>
        <ListItemText primary="Matches" secondary="View all your Matches" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/points'} onClick={handleClose}>
        <ListItemIcon>
          <Badge badgeContent={points} color="secondary">
            <AdjustIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText
          primary="Points"
          secondary="Invite friens to get more Points"
        />
      </ListItem>
      <Divider />
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
  const guestLinks = (
    <List>
      <ListItem button component={Link} to={'/'} onClick={handleClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/tutorial'} onClick={handleClose}>
        <ListItemIcon>
          <ImportContactsIcon />
        </ListItemIcon>
        <ListItemText primary="How it Works" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to={'/about'} onClick={handleClose}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
    </List>
  );
  return (
    <Dialog
      fullScreen
      open={openMenu}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
      {isAuthenticated ? authLinks : guestLinks}
    </Dialog>
  );
};

MobileMenu.propTypes = {
  openMenu: PropTypes.bool,
  setMobileMenuClose: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  openMenu: state.users.mobileMenu,
  points: state.users.points,
  isAuthenticated: state.users.isAuthenticated
});

export default connect(mapStateToProps, { setMobileMenuClose, logout })(
  MobileMenu
);
