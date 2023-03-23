import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { formatReturnState, formatReturnType } from '@components/Card/utils';
import classnames from 'classnames';
import { capitalize } from '@utils/string';
import { getContactReason } from '@components/InteractionSummary/utils';
import MessageIcon from '@mui/icons-material/Message';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  extraTopPadding: {
    marginTop: theme.utils.fromPx(16),
  },
  contactReason: {
    lineHeight: '1.35rem',
    fontWeight: '700',
    letterSpacing: '0.25px',
    marginTop: '10px',
    marginBottom: '6px',
  },
  actionContainer: {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  unorderedList: {
    paddingLeft: '24px',
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
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
    wordBreak: 'break-word',
  },
  actionsRightGrid: {
    paddingLeft: theme.utils.fromPx(16),
  },
  hideElement: {
    display: 'none',
  },
  messageIconContainer: {
    textAlign: 'end',
    marginRight: 8,
  },
  messageIcon: {
    color: '#031657',
    '& svg': {
      fontSize: 13,
      marginTop: 3,
    },
  },
}));
const LegacyOrderInteractionSummaryData = ({ appeasements }) => {
  const classes = useStyles();
  const orderIds = useMemo(() => {
    return appeasements
      ?.filter((appeasement) => appeasement?.appeasementId)
      ?.map((a) => a.appeasementId)
      ?.filter((value, index, self) => self.indexOf(value) === index);
  }, [appeasements]);

  return (
    <div>
      {orderIds &&
        orderIds.length > 0 &&
        orderIds.map((orderId, index) => (
          <div key={orderId} className={index > 0 ? classes.extraTopPadding : ''}>
            <Typography
              data-testid={`order-number:${orderId}`}
              variant="h6"
              className={classes.contactReason}
            >
              Order #{orderId}
            </Typography>
            {appeasements
              ?.filter((currAppeasement) => currAppeasement.appeasementId === orderId)
              ?.map((appeasement, appeasementIndex) => {
                return appeasement?.actions?.map((action) => (
                  <div key={action.actionId} className={classes.actionContainer}>
                    <Grid data-testid={`action:${action.actionId}`} container>
                      <Grid item xs={8}>
                        <ul className={classes.unorderedList}>
                          <li>
                            <div data-testid="type-state-itemId" className={classes.itemAction}>
                              <span>{formatReturnType(action?.type)}</span>
                              <span> ({formatReturnState(action?.state)})</span>
                              {appeasement?.details?.itemId && (
                                <span
                                  data-testid={`itemId:${appeasement.details.itemId}`}
                                  className={classes.itemActionDescription}
                                >
                                  : Item #{appeasement.details.itemId}
                                </span>
                              )}
                            </div>
                            <div
                              data-testid="description"
                              className={classnames(classes.itemActionDescription)}
                            >
                              {capitalize(appeasement?.description)}
                            </div>
                          </li>
                        </ul>
                      </Grid>
                      {!!getContactReason(appeasement?.details) && (
                        <Grid item xs={4}>
                          <Grid
                            container
                            className={classnames(
                              classes.actionsRightGrid,
                              appeasement.details?.selectAll && appeasementIndex !== 0
                                ? classes.hideElement
                                : null,
                            )}
                          >
                            <Grid item xs={1} className={classes.messageIconContainer}>
                              <div className={classes.messageIcon}>
                                <MessageIcon />
                              </div>
                            </Grid>
                            <Grid item xs zeroMinWidth>
                              <div data-testid="contact-reason" className={classes.itemAction}>
                                {getContactReason(appeasement.details)}
                              </div>
                              <div data-testid="comment" className={classes.itemActionDescription}>
                                {appeasement?.details?.comment}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                ));
              })}
          </div>
        ))}
    </div>
  );
};

LegacyOrderInteractionSummaryData.propTypes = {
  appeasements: PropTypes.array,
};

export default LegacyOrderInteractionSummaryData;
