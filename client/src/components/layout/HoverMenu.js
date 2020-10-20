import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from 'material-ui-popup-state/HoverMenu';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from 'react-router-dom';

import PopupState, {
  bindHover,
  bindMenu,
  bindToggle
} from 'material-ui-popup-state';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const ParentPopupState = React.createContext(null);

const menuStyles = theme => ({
  button: {
    color: 'white'
  }
});
const HoverMenu = () => (
  <PopupState variant="popover" popupId="demoMenu">
    {popupState => (
      <ClickAwayListener onClickAway={popupState.close}>
        <div>
          <IconButton
            edge="start"
            {...bindToggle(popupState)}
            style={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>

          <ParentPopupState.Provider value={popupState}>
            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              getContentAnchorEl={null}
            >
              <MenuItem onClick={popupState.close} to="/" component={Link}>
                Home
              </MenuItem>
              <MenuItem onClick={popupState.close} to="/about" component={Link}>
                About
              </MenuItem>

              <Submenu popupId="contribute" title="Contribute">
                <MenuItem
                  onClick={popupState.close}
                  to="/donate"
                  component={Link}
                >
                  To Samidoun
                </MenuItem>
                <MenuItem onClick={popupState.close}>To Benificiary</MenuItem>
                <MenuItem
                  onClick={popupState.close}
                  to="/musicians"
                  component={Link}
                >
                  To Musicians
                </MenuItem>
              </Submenu>
              <MenuItem onClick={popupState.close} to="/" component={Link}>
                Volunteer
              </MenuItem>
              <MenuItem
                onClick={popupState.close}
                to="/contact"
                component={Link}
              >
                Contact
              </MenuItem>
            </Menu>
          </ParentPopupState.Provider>
        </div>
      </ClickAwayListener>
    )}
  </PopupState>
);

export default HoverMenu;

const submenuStyles = theme => ({
  menu: {
    marginTop: theme.spacing(-1)
  },
  title: {
    flexGrow: 1
  },
  moreArrow: {
    marginRight: theme.spacing(-1)
  }
});

const Submenu = withStyles(submenuStyles)(
  // Unfortunately, MUI <Menu> injects refs into its children, which causes a
  // warning in some cases unless we use forwardRef here.
  React.forwardRef(({ classes, title, popupId, children, ...props }, ref) => (
    <ParentPopupState.Consumer>
      {parentPopupState => (
        <PopupState
          variant="popover"
          popupId={popupId}
          parentPopupState={parentPopupState}
        >
          {popupState => (
            <ParentPopupState.Provider value={popupState}>
              <MenuItem
                {...bindHover(popupState)}
                selected={popupState.isOpen}
                ref={ref}
              >
                <span className={classes.title}>{title}</span>
                <ChevronRight className={classes.moreArrow} />
              </MenuItem>
              <Menu
                {...bindMenu(popupState)}
                classes={{ paper: classes.menu }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                getContentAnchorEl={null}
                {...props}
              >
                {children}
              </Menu>
            </ParentPopupState.Provider>
          )}
        </PopupState>
      )}
    </ParentPopupState.Consumer>
  ))
);
