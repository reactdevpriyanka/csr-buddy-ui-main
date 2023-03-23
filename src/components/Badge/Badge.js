import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase } from '@mui/material';
import ConditionalWrapper from '@/utils/conditionalWrapper';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#BECADC',
    padding: `${theme.utils.fromPx(4)} ${theme.utils.fromPx(8)}`,
    borderRadius: theme.utils.fromPx(4),
    color: 'black',
    lineHeight: theme.utils.fromPx(18),
    fontWeight: 400,
    fontSize: theme.utils.fromPx(14),
  },
}));

export const Badge = ({ title = null, onBadgeClick, id, className }) => {
  const classes = useStyles();

  if (title === null) return null;

  const clickableWrapper = (children) => <ButtonBase onClick={onBadgeClick}>{children}</ButtonBase>;

  return (
    <ConditionalWrapper condition={onBadgeClick} wrapper={clickableWrapper}>
      <span className={cn([classes.root, className])} data-testid={`badge:${id}`}>
        {title}
      </span>
    </ConditionalWrapper>
  );
};

Badge.propTypes = {
  title: PropTypes.string.isRequired,
  onBadgeClick: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default Badge;
