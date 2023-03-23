import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  navBar: {
    ...theme.utils.row,
    margin: `${theme.utils.fromPx(12)} ${theme.utils.fromPx(24)} ${theme.utils.fromPx(
      0,
    )} ${theme.utils.fromPx(24)}`,
    paddingLeft: `${theme.utils.fromPx(30)}`,
  },
  tab: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray[400],
    textDecoration: 'none',
    paddingBottom: theme.utils.fromPx(12),
    '&.active': {
      color: theme.palette.blue.dark,
      borderBottom: `${theme.utils.fromPx(2)} solid ${theme.palette.blue.dark}`,

      fontFamily: 'Roboto',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: '18.75px',
      letterSpacing: '0em',
      textAlign: 'left',
    },
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '19px',
    letterSpacing: '0em',
    textAlign: 'left',
    marginRight: `${theme.utils.fromPx(35)}`,
  },
}));

const HorizontalBtnNav = ({ onChange, activeTab, tabs }) => {
  const classes = useStyles();

  return (
    <div className={classes.navBar} data-testid="horizontal-nav-bar">
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

HorizontalBtnNav.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default HorizontalBtnNav;
