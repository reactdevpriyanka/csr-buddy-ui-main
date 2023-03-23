import TooltipPrimary from '@/components/TooltipPrimary';
import { capitalize } from '@/utils/string';
import MessageIcon from '@mui/icons-material/Message';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { formatReturnState, formatReturnType } from '@/components/Card/utils';

const useStyles = makeStyles((theme) => ({
  actionContainer: {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  unorderedList: {
    paddingLeft: theme.utils.fromPx(16),
    marginTop: theme.utils.fromPx(4),
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
    },
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  itemAction: {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '18px',
  },
  itemActionDescription: {
    color: '#666666',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '18px',
  },
  messageIcon: {
    color: '#031657',
    display: 'inline-block',
    paddingLeft: theme.utils.fromPx(8),
    verticalAlign: 'top',
    '& svg': {
      fontSize: 13,
      marginTop: 3,
    },
  },
  inlineMessageIcon: {
    display: 'inline',
  },
  tooltipInfo: {
    fontSize: theme.utils.fromPx(12),
    '& > *:not(:last-child)': {
      marginBottom: theme.utils.fromPx(8),
    },
  },
}));

const Appeasement = ({
  actions = [],
  description = '',
  actionDescription = '',
  comment = '',
  itemId,
}) => {
  const classes = useStyles();

  const toolTipInfo = () => {
    return (
      <div className={classes.tooltipInfo}>
        <div>{actionDescription}</div>
        <div>{comment}</div>
      </div>
    );
  };

  return (
    actions &&
    actions?.length > 0 &&
    actions.map((action) => (
      <div
        key={action.actionId}
        data-testid={`action-${action.actionId}:history-card`}
        className={classes.actionContainer}
      >
        <ul className={classes.unorderedList}>
          <li>
            <span className={classes.itemAction}>
              {formatReturnType(action?.type)} ({formatReturnState(action?.state)})
              {itemId && <span className={classes.itemActionDescription}>: Item # {itemId}</span>}
            </span>
            <div
              className={classnames(
                classes.itemActionDescription,
                classes.textEllipsisContainer,
                !description ? classes.inlineMessageIcon : '',
              )}
            >
              <span>
                {capitalize(description)}
                <div className={classes.messageIcon}>
                  <TooltipPrimary title={toolTipInfo()}>
                    <MessageIcon />
                  </TooltipPrimary>
                </div>
              </span>
            </div>
          </li>
        </ul>
      </div>
    ))
  );
};

Appeasement.propTypes = {
  actions: PropTypes.array,
  description: PropTypes.string,
  actionDescription: PropTypes.string,
  comment: PropTypes.string,
  itemId: PropTypes.string,
};

export default Appeasement;
