/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import cn from 'classnames';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRight from '@icons/chevron-right.svg';
import FeatureFlag from '@/features/FeatureFlag';
import { convertOrderStatus } from '@/constants/OrderStatus';
import { currencyFormatter } from '@/utils/string';
import Badge from '../Badge/Badge';
import EventHistoryDialog from '../EventHistory/EventHistoryDialog';
import AutoshipStatusHistoryDialog from '../AutoshipStatusHistory/AutoshipStatusHistoryDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    gridTemplateColumns: `1fr ${theme.utils.fromPx(167)}`,
    alignItems: 'center',
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)}`,
    paddingLeft: '10px',
    paddingRight: '20px',
    width: '100%',
  },
  title: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    margin: 0,
    paddingBottom: theme.utils.fromPx(0),
    fontSize: theme.utils.fromPx(21),
    lineHeight: theme.utils.fromPx(28),
    marginRight: theme.utils.fromPx(8),
  },
  subtitle: {
    ...theme.fonts.body.medium,
    color: theme.palette.gray.light,
    margin: 0,
    padding: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(2)}`,
    '&:not(:nth-of-type(1))': {
      paddingTop: theme.utils.fromPx(8),
    },
  },
  isError: {
    color: theme.palette.red.medium,
  },
  actionWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginLeft: 'auto',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      ...theme.fonts.h3,
      color: theme.palette.blue.dark,
      textDecoration: 'none',
    },
  },
  chevron: {
    fill: theme.palette.blue.dark,
    display: 'inline-block',
    width: theme.utils.fromPx(12),
    height: theme.utils.fromPx(12),
    marginLeft: theme.utils.fromPx(4),
  },
  dateSpan: {
    display: 'flex',
    alignItems: 'flex-end',
    '& hr:last-of-type': {
      display: 'none',
    },
  },
  dateSpanHr: {
    height: '15px',
    marginBottom: '0px',
    marginLeft: theme.utils.fromPx(6),
    marginRight: theme.utils.fromPx(2),
  },
  topContainer: {
    display: 'inline-flex',
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  inlineContainer: {
    display: 'inline-flex',
  },
  badge: {
    marginLeft: theme.utils.fromPx(0),
    pointerEvents: 'all',
  },
  srOnly: {
    textIndent: -9999,
    overflow: 'hidden',
    position: 'absolute',
    width: 0,
    height: 0,
  },
  totalSection: {
    marginRight: theme.utils.fromPx(25),
    textAlign: 'right',
  },
  orderTitle: {
    color: theme.palette.gray.light,
    float: 'right',
  },
  orderTotalValue: {
    ...theme.fonts.body.medium,
  },
}));

const ActivityHeader = ({
  title = '',
  subtitle = '',
  action = null,
  showActionIcon = true,
  titleSection = '',
  headerSection = '',
  className = '',
  status,
  orderNumber,
  orderTotal,
  subscriptionId,
  autoshipCard = false,
}) => {
  const classes = useStyles();
  const [eventHistoryDialogOpen, setEventHistoryDialogOpen] = useState(false);
  const [statusHistoryDialogOpen, setStatusHistoryDialogOpen] = useState(false);

  status = orderNumber ? convertOrderStatus(status) : status;

  return (
    <>
      <a id={subscriptionId || orderNumber} className={classes.srOnly}>
        {subscriptionId || orderNumber}
      </a>
      <div className={cn(classes.topContainer, className)}>
        {headerSection}
        <div data-testid="card:activity-header" className={classes.root}>
          <div className={classes.inlineContainer}>
            {titleSection}
            <div>
              <span className={classes.inlineContainer}>
                <span className={classes.title}>{title}</span>
                {orderNumber ? (
                  <FeatureFlag flag="feature.explorer.orderEventHistoryEnabled">
                    <Badge
                      className={classes.badge}
                      title={status}
                      id={orderNumber}
                      onBadgeClick={() => setEventHistoryDialogOpen(true)}
                    />
                  </FeatureFlag>
                ) : (
                  <FeatureFlag flag="feature.explorer.autoshipStatusHistoryEnabled">
                    <Badge
                      className={classes.badge}
                      title={status}
                      id={subscriptionId}
                      onBadgeClick={() => setStatusHistoryDialogOpen(true)}
                    />
                  </FeatureFlag>
                )}
              </span>

              <span className={classes.dateSpan}>
                {Array.isArray(subtitle) ? (
                  subtitle.map(({ text, isError }, index) => (
                    <React.Fragment key={index}>
                      <h4 key={text} className={cn(classes.subtitle, isError && classes.isError)}>
                        {text}
                      </h4>
                      <hr className={classes.dateSpanHr} />
                    </React.Fragment>
                  ))
                ) : (
                  <h4 className={classes.subtitle}>{subtitle}</h4>
                )}
              </span>
            </div>
          </div>

          <div className={classes.actionWrap}>
            {!autoshipCard && (
              <FeatureFlag flag="feature.explorer.orderTotalEnabled">
                {!Number.isNaN(orderTotal) && (
                  <div>
                    <div className={classes.totalSection}>
                      <span className={classes.orderTitle}>Order Total</span>
                      <p
                        data-testid={`${orderNumber}-total-amount`}
                        className={classes.orderTotalValue}
                      >
                        {currencyFormatter(typeof orderTotal === 'undefined' ? 0 : orderTotal)}
                      </p>
                    </div>
                  </div>
                )}
              </FeatureFlag>
            )}
            <span className={classes.action}>
              {action}
              {showActionIcon && (
                <span data-testid="card:activity-header-action-icon">
                  <ChevronRight className={classes.chevron} />
                </span>
              )}
            </span>
          </div>
        </div>
        {orderNumber && eventHistoryDialogOpen && (
          <EventHistoryDialog
            open={eventHistoryDialogOpen}
            onClose={() => setEventHistoryDialogOpen(false)}
            status={status}
            orderNumber={orderNumber}
            data-testid={`event-history-dialog:${orderNumber}`}
          />
        )}

        {subscriptionId && statusHistoryDialogOpen && (
          <AutoshipStatusHistoryDialog
            open={statusHistoryDialogOpen}
            onClose={() => setStatusHistoryDialogOpen(false)}
            status={status}
            subscriptionId={subscriptionId}
            data-testid={`status-history-dialog:${subscriptionId}`}
          />
        )}
      </div>
    </>
  );
};

ActivityHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        isError: PropTypes.bool,
      }),
    ),
  ]).isRequired,
  action: PropTypes.node.isRequired,
  showActionIcon: PropTypes.bool,
  autoshipCard: PropTypes.bool,
  titleSection: PropTypes.node,
  headerSection: PropTypes.node,
  className: PropTypes.string,
  status: PropTypes.string,
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subscriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ActivityHeader;
