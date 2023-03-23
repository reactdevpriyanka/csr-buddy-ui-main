import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  profileInfoRoot: {
    boxSizing: 'border-box',
    display: 'inline-block',
    marginRight: theme.utils.fromPx(75),
    '&.disabled': {
      opacity: '0.5',
    },
  },
  header: {
    ...theme.fonts.body.medium,
    fontSize: theme.utils.fromPx(16),
    color: theme.palette.gray.medium,
    margin: `0 0 ${theme.utils.fromPx(4)} 0`,
    lineHeight: theme.utils.fromPx(22),
    whiteSpace: 'nowrap',
  },
  content: {
    ...theme.fonts.body.medium,
    margin: 0,
    color: theme.palette.gray['medium-light'],
  },
}));

const ProfileInfo = ({ header, content, children, disabled = false, className = '' }) => {
  const classes = useStyles();

  return (
    <div
      className={classNames(classes.profileInfoRoot, className, disabled && 'disabled')}
      data-testid="card:profile-info"
    >
      <strong className={classes.header}>{header}</strong>
      <div className={classes.content}>{content || children}</div>
    </div>
  );
};

ProfileInfo.propTypes = {
  header: PropTypes.node,
  content: PropTypes.node,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ProfileInfo;
