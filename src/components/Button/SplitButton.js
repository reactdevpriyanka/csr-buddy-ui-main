import { ButtonGroup, Divider, Menu, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useRef, useState } from 'react';
import Button from '.';

const useStyles = makeStyles((theme) => ({
  labelButton: {
    marginRight: '0px !important',
  },
  dropDownButton: {
    maxWidth: '33px',
    backgroundColor: theme.palette.blue.dark,
    color: theme.palette.white,
    borderLeft: `1px ${theme.palette.white} solid;`,
  },
  menu: {
    '& .MuiMenuItem-root': {
      fontSize: `${theme.utils.fromPx(14)}`,
      borderLeft: `${theme.utils.fromPx(5)} solid transparent`,
      '&:hover': {
        backgroundColor: '#010B39',
        borderLeft: `${theme.utils.fromPx(5)} solid #006DEA`,
      },
    },
    '& .MuiList-root': {
      backgroundColor: theme.palette.blue.dark,
      color: theme.palette.white,
    },
  },
  divider: {
    backgroundColor: theme.palette.white,
  },
  menuItemIcon: {
    marginLeft: '5px',
  },
}));

const SplitButton = ({ label, action, disabled = false, menuItems = [], menuIcon, ...props }) => {
  const classes = useStyles();

  const anchorRefButtonGroup = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggle = (event) => setAnchorEl(event?.currentTarget);

  const closeMenu = () => setAnchorEl(null);

  const open = !!anchorEl;

  const getMenuItem = (menuItem) => {
    return menuItem?.isDivider ? (
      <Divider key="divider" className={classes.divider} />
    ) : (
      <MenuItem
        key={menuItem.label}
        className={menuItem.menuItemClasses}
        disabled={menuItem.disabled}
        data-testid={`split-button-${menuItem.label}:menu-item`}
        onClick={() => {
          menuItem.action();
          closeMenu();
        }}
      >
        {' '}
        {menuItem.label}
        {menuItem.menuItemIcon && (
          <span className={classes.menuItemIcon}>{menuItem.menuItemIcon}</span>
        )}
      </MenuItem>
    );
  };

  return (
    <>
      <ButtonGroup
        disabled={disabled}
        variant="contained"
        color="primary"
        ref={anchorRefButtonGroup}
        aria-label="split button"
        data-testid={props['data-testid'] || `split-button-group`}
      >
        <Button
          onClick={action}
          className={classes.labelButton}
          full
          solid
          data-testid="split-button-label"
        >
          {label}
        </Button>
        <Button
          size="small"
          className={classes.dropDownButton}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select a secondary action"
          aria-haspopup="menu"
          onClick={handleToggle}
          data-testid="split-button-menu-button"
        >
          {menuIcon}
        </Button>
      </ButtonGroup>
      <Menu
        id="button-menu"
        anchorEl={anchorEl}
        className={classes.menu}
        open={open}
        onClose={closeMenu}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menuItems &&
          menuItems.length > 0 &&
          menuItems
            .filter((menuItem) => menuItem.display)
            .map((menuItem) => {
              return getMenuItem(menuItem);
            })}
      </Menu>
    </>
  );
};

SplitButton.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.func,
  disabled: PropTypes.bool,
  'data-testid': PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      action: PropTypes.func,
      display: PropTypes.bool,
      disabled: PropTypes.bool,
      isDivider: PropTypes.bool,
      menuItemClasses: PropTypes.string,
      menuItemIcon: PropTypes.node,
    }),
  ),
  menuIcon: PropTypes.object,
};

export default SplitButton;
