import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { Link } from 'react-router-dom';
import HoverMenu from './HoverMenu';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'white'
  },
  title: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  menu: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },

  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },

  drop: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

export default function Navbar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // const large = require('../../images/logo_header.png');

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.sectionMobile}>
            <HoverMenu />
          </div>

          <Grid item container xs={12}>
            <Grid item container xs={12} sm={6}>
              <Grid item xs={12}>
                <Typography className={classes.title} variant="h6" noWrap>
                  <LoyaltyIcon /> My Crush
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={false} sm={6} className={classes.menu}>
              <Button to="/" component={Link} color="inherit">
                Home
              </Button>
              <Button to="/about" component={Link} color="inherit">
                About
              </Button>
              <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="inherit"
              >
                Contribute
              </Button>
              <ClickAwayListener onClickAway={handleClose}>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                  onMouseLeave={handleClose}
                  className={classes.drop}
                  color="inherit"
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom'
                            ? 'center top'
                            : 'center bottom'
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem
                              onClick={handleClose}
                              to="/donate/Direct"
                              component={Link}
                            >
                              To Samidoun
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              To Benificiary
                            </MenuItem>
                            <MenuItem
                              onClick={handleClose}
                              to="/musicians"
                              component={Link}
                            >
                              To Musicians
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </ClickAwayListener>
              <Button color="inherit">Volunteer</Button>
              <Button to="/contact" component={Link} color="inherit">
                Contact
              </Button>
            </Grid>
          </Grid>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
