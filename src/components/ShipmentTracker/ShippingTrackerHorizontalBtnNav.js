import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  navBar: {
    margin: `${theme.utils.fromPx(10)} ${theme.utils.fromPx(32)}`,
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(200)} ${theme.utils.fromPx(200)}`,
    justifyContent: 'left',
  },
  tab: {
    ...theme.fonts.body.normal,
    color: '#121212',
    textDecoration: 'none',
    paddingBottom: theme.utils.fromPx(12),
    '&.active': {
      color: '#1C49C2',
      borderBottom: `${theme.utils.fromPx(2)} solid #1C49C2`,
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: '16px',
      letterSpacing: '0em',
      textAlign: 'left',
      marginRight: '16px',
    },
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '16px',
    letterSpacing: '0em',
    textAlign: 'left',
    marginRight: '16px',
    marginLeft: '30px',
  },
}));

const ShippingTrackerHorizontalBtnNav = ({ onChange, activeTab, tabs }) => {
  const classes = useStyles();

  return (
    <div className={classes.navBar} data-testid="horizontal-tracking-nav-bar">
      {tabs.map((tab) => (
        <ButtonBase
          data-testid={`${tab}_tab`}
          disableRipple
          key={tab}
          className={cn([classes.tab, tab === activeTab && 'active'])}
          onClick={() => onChange(tab)}
        >
          {tab}
        </ButtonBase>
      ))}
    </div>
  );
};

ShippingTrackerHorizontalBtnNav.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default ShippingTrackerHorizontalBtnNav;
