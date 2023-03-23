import { useMemo } from 'react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CommentCard from '@components/CommentCard';
import useAthena from '@/hooks/useAthena';
import use1Point0Comments from '@/hooks/use1Point0Comments';
import ConnectedSideNavCards from '../Base/ConnectedSideNavCards/ConnectedSideNavCards';

const useStyles = makeStyles((theme) => ({
  scrollContainer: {
    height: '100%',
    overflowY: 'auto',
    padding: theme.utils.fromPx(24),
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
  endMessage: {
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
  },
  nullMessage: {
    fontSize: theme.fonts.size.xl,
    color: theme.palette.gray[400],
  },
}));

const CommentContainer = () => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const { data: comments, error } = use1Point0Comments();

  const grouped = useMemo(
    () =>
      Object.assign(
        { stickied: [], comments: [] },
        groupBy(comments || [], (comment) => (comment.stickied ? 'stickied' : 'comments')),
      ),
    [comments],
  );

  if (!comments) {
    return <div>{getLang('loadingCommentsText', { fallback: 'Loading comments' })}</div>;
  }

  if (error) {
    return <div>{getLang('errorLoadingCommentsText', { fallback: 'Error loading comments' })}</div>;
  }

  const descDateSortedStickies = orderBy(
    grouped.stickied,
    (sticky) => new Date(sticky.createdDate),
    ['desc'],
  );

  const descDateSortedComments = orderBy(
    grouped.comments,
    (comment) => new Date(comment.createdDate),
    ['desc'],
  );

  return (
    <div className={classes.scrollContainer} data-testid="comment-container">
      {descDateSortedStickies.map(({ id, comment, agentName, createdDate }) => (
        <ConnectedSideNavCards key={id}>
          <CommentCard
            data-testid={`comment-card-${id}`}
            tempBubbleDisabled
            comment={comment}
            commentType="Sticky"
            agentName={agentName}
            contactChannel="sticky" // @see {https://chewyinc.atlassian.net/browse/CSRBT-918} - removes the contact channel icon
            date={createdDate}
          />
        </ConnectedSideNavCards>
      ))}
      {descDateSortedComments.map(({ id, comment, agentName, contactChannel, createdDate }) => (
        <ConnectedSideNavCards key={createdDate}>
          <CommentCard
            data-testid={`comment-card-${id}`}
            tempBubbleDisabled //todo remove when agentContact is populated
            comment={comment}
            commentType="Customer"
            agentName={agentName} //data not present - property name assumed
            contactChannel={contactChannel} //data not present - property name assumed
            date={createdDate}
          />
        </ConnectedSideNavCards>
      ))}
      <Box className={classes.footer}>
        {grouped.comments.length === 0 && grouped.stickied.length === 0 ? (
          <p data-testid="comments:null" className={classes.nullMessage}>
            {getLang('noCommentsText', { fallback: 'There are no comments to display.' })}
          </p>
        ) : (
          <p data-testid="comments:end" className={classes.endMessage}>
            {getLang('endOfCommentsText', { fallback: 'End of Comments' })}
          </p>
        )}
      </Box>
    </div>
  );
};

export default CommentContainer;
