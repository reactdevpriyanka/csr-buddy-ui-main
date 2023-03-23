import PropTypes from 'prop-types';
import { getDayDateYearTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import { Card } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '12px',
  },
  chewyCard: {
    position: 'relative',
    padding: '16px',
    backgroundColor: '#F5F5F5',
    border: '1px solid #999999',
    '&.sticky': {
      background: '#f9f4dc',
      border: '1px solid #bbbbbb',
      boxShadow: 'none',
    },
  },
  heading: {},
  contactChannel: {},
  iconButtonContactChannel: {
    color: theme.palette.blue[800],
    backgroundColor: theme.palette.blue[100],
    padding: '8px',
    '&:hover': {
      cursor: 'unset',
      color: theme.palette.blue[800],
      backgroundColor: theme.palette.blue[100],
    },
  },
  icon: {
    //used by initials as well
    height: '20px',
    width: '20px',
  },
  initials: {
    fontSize: '18px',
    fontWeight: 500,
    position: 'absolute',
    width: '34px',
  },
  iconAgentName: {
    right: 16,
    bottom: 16,
    padding: '8px',
    position: 'absolute',
    color: theme.palette.white,
    backgroundColor: theme.palette.gray[175],
    '&:hover': {
      cursor: 'unset',
      color: theme.palette.white,
      backgroundColor: theme.palette.gray[175],
    },
  },
  commentType: {
    lineHeight: '28px',
    fontSize: '18px',
    fontWeight: 500,
    color: theme.palette.primary.main,
    letterSpacing: '0.25px',
  },
  comment: {
    color: '#000000',
    fontWeight: 400,
    lineHeight: '18px',
  },
  commentDate: {
    fontWeight: 700,
  },
}));

const getInitials = (name = '') => {
  if (!name) return '';
  const arr = name.split(' ');
  if (arr.length < 3) {
    return arr.reduce((acc, cur) => `${acc}${cur[0].toUpperCase()}`, '');
  }
  return arr[0][0].toUpperCase() + arr[arr.length - 1][0].toUpperCase();
};

const CommentCard = ({
  date,
  commentType,
  comment,
  contactChannel = '',
  agentName,
  tempBubbleDisabled = false,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div data-testid={props['data-testid']} className={classes.root}>
      <Card
        elevation={0}
        className={classnames(classes.chewyCard, contactChannel === 'sticky' && 'sticky')}
      >
        <div className={classes.heading}>
          <div>
            <span className={classes.commentDate}>{getDayDateYearTimeTimezone(date)}</span>
            <span>{agentName && ` | ${agentName}`}</span>
            <div className={classes.commentType}>
              {commentType}
              {commentType === 'Sticky' ? ' Note' : ' Comment'}
            </div>
          </div>
        </div>
        <div className={classes.comment}>{comment}</div>
        {!tempBubbleDisabled && (
          <IconButton disableRipple aria-label="close" className={classes.iconAgentName}>
            <div className={classes.icon}>&nbsp;</div>
            <div className={classnames(classes.icon, classes.initials)}>
              {getInitials(agentName)}
            </div>
          </IconButton>
        )}
      </Card>
    </div>
  );
};

CommentCard.propTypes = {
  tempBubbleDisabled: PropTypes.bool,
  'data-testid': PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  commentType: PropTypes.string,
  comment: PropTypes.string.isRequired,
  contactChannel: PropTypes.string,
  agentName: PropTypes.string,
};

export default CommentCard;
