import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  navBar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  tab: {
    ...theme.fonts.body.normal,
    backgroundColor: '#EEEEEE',
    color: theme.palette.gray[400],
    textDecoration: 'none',
    padding: `${theme.utils.fromPx(16)} 0px`,
    '&.active': {
      color: theme.palette.primary.alternate,
      borderBottom: `${theme.utils.fromPx(2)} solid ${theme.palette.primary.alternate}`,
      backgroundColor: '#FFFFFF',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: '18.75px',
      letterSpacing: '0em',
      textAlign: 'left',
    },
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '19px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
}));

const AlertHorizontalBtnNav = ({ onChange, activeTab, tabs }) => {
  const classes = useStyles();

  return (
    <div className={classes.navBar} data-testid="alert-horizontal-nav-bar">
      {tabs.map(({ tab, component }) => (
        <ButtonBase
          data-testid={`${tab}_tab`}
          disableRipple
          key={tab}
          className={cn([classes.tab, tab === activeTab && 'active'])}
          onClick={() => onChange(tab)}
        >
          {component}
        </ButtonBase>
      ))}
    </div>
  );
};

AlertHorizontalBtnNav.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default AlertHorizontalBtnNav;
