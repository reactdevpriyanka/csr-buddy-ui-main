import { makeStyles } from '@material-ui/core/styles';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import HorizontalBtnNav from '@components/HorizontalBtnNav';
import classnames from 'classnames';
import useInteractions from '@/hooks/useInteractions';
import { Fragment } from 'react';
import { getContactChannelIcon } from '../InteractionSummary/utils';
import ConnectedSideNavCards from '../Base/ConnectedSideNavCards/ConnectedSideNavCards';
import { InteractionHistoryCard } from '.';

const TABS = {
  ALLCONTACTS: 'All Contacts',
};

const tabsList = [TABS.ALLCONTACTS];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    height: '100%',
    overflowY: 'auto',
    padding: '0px 24px 24px 24px',
    backgroundColor: '#F5F5F5',
  },
  customerContactsContainer: {
    margin: `${theme.utils.fromPx(24)} 0`,
  },
  totalCustomerContacts: {
    fontSize: theme.utils.fromPx(16),
    fontWeight: 400,
    verticalAlign: 'middle',
  },
  totalCountChip: {
    display: 'inline-block',
    backgroundColor: '#031657',
    borderRadius: '12px',
    minWidth: '32px',
    color: 'white',
    fontSize: '12px',
    textAlign: 'center',
    marginRight: theme.utils.fromPx(10),
  },
  dottectedConnectingLine: {
    position: 'relative',
    stroke: 'grey',
    strokeDasharray: '4, 3',
    left: '50%',
    transform: 'translateX(-50%)',
    '&:last-child': {
      display: 'none',
    },
  },
}));

const InteractionHistoryContainer = () => {
  const classes = useStyles();
  const { data: interactions } = useInteractions();

  return (
    <div className={classnames(classes.root)}>
      <ModalSideHeader text="Contact History" />
      <HorizontalBtnNav activeTab={tabsList[0]} onChange={() => {}} tabs={tabsList} />
      <div className={classes.scrollContainer}>
        <div className={classes.customerContactsContainer}>
          <span className={classes.totalCountChip}>{interactions?.length}</span>
          <span className={classes.totalCustomerContacts}>Total Customer Contacts</span>
        </div>
        {interactions &&
          interactions?.map((interaction) => (
            <Fragment key={`${interaction?.incidentId}-history-container`}>
              <ConnectedSideNavCards>
                <InteractionHistoryCard
                  interaction={interaction}
                  contactChannelIcon={getContactChannelIcon(interaction.contactChannel)}
                />
              </ConnectedSideNavCards>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default InteractionHistoryContainer;
