import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.utils.fromPx(287)}`,
  },
  content: {
    padding: `0 ${theme.utils.fromPx(24)} 0 0`,
  },
  actions: {},
}));

const SplitContent = ({ content, contentClassName = '', actions, actionsClassName = '' }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="card:split-content">
      <div
        data-testid="card:split-content:content"
        className={cn(classes.content, contentClassName)}
      >
        {content}
      </div>
      <div
        data-testid="card:split-content:actions"
        className={cn(classes.actions, actionsClassName)}
      >
        {actions}
      </div>
    </div>
  );
};

SplitContent.propTypes = {
  content: PropTypes.node,
  contentClassName: PropTypes.string,
  actions: PropTypes.node,
  actionsClassName: PropTypes.string,
};

export default SplitContent;
