import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  menu: {
    transition: 'all 0.2s',
    '& .MuiMenuItem-root': {
      fontSize: `${theme.utils.fromPx(14)}`,
      borderLeft: `${theme.utils.fromPx(5)} solid transparent`,
      minHeight: '42px',
      minWidth: '207px',
      '&:hover': {
        backgroundColor: '#010B39',
        borderLeft: `${theme.utils.fromPx(5)} solid #006DEA`,
      },
    },
    '& .MuiList-root': {
      backgroundColor: theme.palette.blue.dark,
      color: theme.palette.white,
      padding: '0px',
    },
  },
}));

const OrderActionsButton = ({ menuItems = [], orderNumber }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleActionsMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{
          backgroundColor: '#031657',
          color: 'white',
          fontSize: '14px',
          minWidth: '158px',
          minHeight: '40px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#010B39',
          },
        }}
        data-testid={`order-actions-button:${orderNumber}`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleActionsMenuClick}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        Manage Order
      </Button>
      <Menu
        id="order-actions-menu"
        className={classes.menu}
        anchorEl={anchorEl}
        open={open}
        onClose={handleActionsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems
          .filter((menuItem) => menuItem?.display)
          .map(({ label, action, testId }) => (
            <MenuItem
              key={label}
              data-testid={testId}
              sx={{
                backgroundColor: '#031657',
                color: label === 'Cancel Order' ? '#F9BBC7' : 'white',
                fontSize: '12px',
                padding: '8px 12px',
                borderTop: label === 'Cancel Order' ? '1px solid #E5EAF0' : '',
                transition: 'all 0.2s',
              }}
              onClick={() => {
                handleActionsMenuClose();
                action();
              }}
            >
              {label}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

OrderActionsButton.propTypes = {
  menuItems: PropTypes.array,
  orderNumber: PropTypes.string,
};

export default OrderActionsButton;
