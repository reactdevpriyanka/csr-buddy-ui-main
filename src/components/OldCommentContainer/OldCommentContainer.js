import { makeStyles } from '@material-ui/core/styles';
import CommentCard from '@components/CommentCard';
import useCustomer from '@/hooks/useCustomer';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import HorizontalBtnNav from '@components/HorizontalBtnNav';

const TABS = {
  ALLCOMMENTS1POINT0: 'All Comments (1.0)',
};

const tabsList = [TABS.ALLCOMMENTS1POINT0];

const useStyles = makeStyles((theme) => ({
  //copied from src/components/ShipmentTracker/ShipmentTracker.js
  root: {
    backgroundColor: theme.palette.white,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    overflowY: 'auto',
    marginTop: theme.utils.fromPx(24),
  },
}));

const OldCommentContainer = () => {
  const classes = useStyles();

  const { data: customer } = useCustomer();
  const comments = customer?.comments || [];

  return (
    <div className={classes.root}>
      <ModalSideHeader text="Comments Archive" />
      <HorizontalBtnNav activeTab={tabsList[0]} onChange={() => {}} tabs={tabsList} />
      <div className={classes.scrollContainer}>
        {comments.map(({ comment, agentName, contactChannel, createdDate }) => (
          <CommentCard
            tempBubbleDisabled //todo remove when agentContact is populated
            key={createdDate}
            comment={comment}
            commentType="Customer"
            agentName={agentName} //data not present - property name assumed
            contactChannel={contactChannel} //data not present - property name assumed
            date={createdDate}
          />
        ))}
      </div>
    </div>
  );
};

export default OldCommentContainer;
