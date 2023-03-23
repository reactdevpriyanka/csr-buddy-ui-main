import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import pako from 'pako';
import { getDayDateYearTimeTimezone } from '@/utils';
import cn from 'classnames';
import { Button, ButtonGroup } from '@mui/material';
import useFeature from '@/features/useFeature';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link } from '@material-ui/core';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useReturnDetails from '@/hooks/useReturnDetails';
import { AllowableActions } from '../OrderDetailsView/utils';
import CreateNewLabelsDialog from './Dialogs/CreateNewLabelsDialog';
import ResendLabelsDialog from './Dialogs/ResendLabelsDialog';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginBottom: theme.utils.fromPx(10),
    color: theme.palette.blue.dark,
    marginTop: theme.utils.fromPx(20),
  },
  labelRow: {
    display: 'grid',
    gridTemplateColumns: '30% 20% 20% 15% auto',
    backgroundColor: '#EEEEEE',
    height: '50px !important',
    columnGap: '7px',
  },
  labelPanel: {
    display: 'grid',
    gridTemplateColumns: '30% 20% 20% 15% auto',
    columnGap: '10px',
    backgroundColor: '#FFFFFF',
  },
  labelHeading: {
    marginTop: '15px',
    marginLeft: '15px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: theme.utils.fromPx(16),
  },
  labelValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
  },
  labelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {},
  titlePanel: {
    display: 'flex',
    marginTop: '15px',
    marginBottom: '15px',
  },
  buttonPanel: {
    width: '100%',
    textAlign: 'right',
    alignSelf: 'center',
  },
  button: {
    boxSizing: 'border-box',
    pointerEvents: 'all',
    opacity: '1',
    float: 'right',
    height: '40px',
    padding: '14px 20px 14px 20px',
    border: '1px solid #1C49C2 !important',
    backgroundColor: '#FFFFFF !important',
    '&:hover': {
      backgroundColor: '#B8D7F3',
    },
  },
  btnTxt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#1C49C2',
    textTransform: 'none',
  },
  links: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#1C49C2',
    textTransform: 'none',
    cursor: 'pointer',
    marginTop: '15px',
    textDecoration: 'none',
  },
  leftMargin: {
    marginLeft: '15px',
  },
  titleLayout: {
    alignSelf: 'center',
  },
  noDataFoundPanel: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    gridTemplateColumns: 'none',
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    fontSize: '16px',
    lineHeight: '22px',
  },
}));
const ReturnDetailsViewLabels = ({ returnData, returnId, orderId, isActionAllowed }) => {
  const classes = useStyles();

  const [showCreateNewLabelsDialog, setShowCreateNewLabelsDialog] = useState(false);

  const [showResendLabelsDialog, setShowResendLabelsDialog] = useState(false);

  const resendLabelFlag = useFeature('feature.explorer.resendLabelEnabled');

  const { markAllItemsAsReceived } = useReturnDetails();

  const { captureInteraction } = useAgentInteractions();

  const { enqueueSnackbar } = useSnackbar();

  const getPDFLink = (id, value) => {
    const binaryString = atob(value);
    const output = pako.inflate(binaryString);
    const blob = new Blob([output], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(blob);
    return (
      <Link
        target="_blank"
        href={fileURL}
        className={classes.links}
        data-testid={`returnDetailsViewLabels:${id}:pdf:url`}
      >
        <span
          className={classes.labelValue}
          data-testid={`returnDetailsViewLabels:${id}:pdf:url:label`}
        >
          PDF
        </span>
      </Link>
    );
  };

  const handleMarkAllAsReceived = () => {
    markAllItemsAsReceived(returnId)
      .then(() =>
        captureInteraction({
          type: 'MARKED_ALL_AS_RECEIVED',
          subjectId: orderId,
          action: 'UPDATE',
          currentVal: { returnId: returnId },
          prevVal: {},
        }),
      )
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Marked all items as received`,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to mark all items as received`,
        });
      });
  };

  return (
    <div data-testid="returnDetailsViewLabels:container">
      <div>
        <div className={classes.titlePanel}>
          <div className={classes.titleLayout}>
            <span className={classes.title}>{'Labels'}</span>
          </div>
          <div className={classes.buttonPanel}>
            <ButtonGroup
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
              aria-label="outlined primary button group"
            >
              {isActionAllowed({ actionName: AllowableActions.MARK_AS_RECEIVED }) && (
                <Button
                  data-testid="order-button-mark-all-as-received"
                  className={classes.button}
                  disableRipple
                  aria-label="Mark All as Received"
                  onClick={handleMarkAllAsReceived}
                >
                  <span className={classes.btnTxt}>{'Mark All as Received'}</span>
                </Button>
              )}
              {isActionAllowed({ actionName: AllowableActions.CREATE_NEW_LABELS }) && (
                <Button
                  data-testid="order-button-create-new-labels"
                  className={classes.button}
                  disableRipple
                  aria-label="Create New Labels"
                  onClick={() => setShowCreateNewLabelsDialog(true)}
                >
                  <span className={classes.btnTxt}>{'Create New Labels'}</span>
                </Button>
              )}
              {resendLabelFlag &&
                isActionAllowed({ actionName: AllowableActions.CREATE_NEW_LABELS }) && (
                  <Button
                    data-testid="order-button-resend-label"
                    className={classes.button}
                    disableRipple
                    aria-label="Resend Label"
                    onClick={() => setShowResendLabelsDialog(true)}
                  >
                    <span className={classes.btnTxt}>{'Resend Labels'}</span>
                  </Button>
                )}
            </ButtonGroup>
          </div>
        </div>
      </div>
      {returnData?.labels?.length > 0 ? (
        <div className={classes.labelRow}>
          <div className={classes.labelHeading}>{'Tracking'}</div>
          <div className={classes.labelHeading}> {'Created'}</div>
          <div className={classes.labelHeading}> {'Label'}</div>
          <div className={classes.labelHeading}>{'Destination'}</div>
          <div className={classes.labelHeading}>{'Received'}</div>
        </div>
      ) : null}
      {returnData?.labels?.length > 0 ? (
        returnData?.labels.map((label) => {
          return (
            <div
              key={label.id}
              data-testid="return:labels:accordion:details"
              className={classes.layout}
            >
              <div className={classes.labelPanel}>
                <div className={classes.labelValuePanel}>
                  <Link
                    target="_blank"
                    className={cn(classes.links, classes.leftMargin)}
                    data-testid={`returnDetailsViewLabels:${label?.trackingnumber}:tracking:link`}
                    href={`https://www.fedex.com/fedextrack/?tracknumbers=${label.trackingNumber}`}
                  >
                    <span
                      data-testid={`returnDetailsViewLabels:${label?.trackingnumber}:tracking:link:label`}
                    >
                      {label?.trackingNumber}
                    </span>
                  </Link>
                </div>

                <div className={classes.labelValuePanel}>
                  <span
                    className={classes.labelValue}
                    data-testid={`returnDetailsViewLabels:${label?.trackingnumber}:created`}
                  >
                    {getDayDateYearTimeTimezone(label?.timeCreated)}
                  </span>
                </div>

                <div className={classes.labelValuePanel}>
                  {getPDFLink(label?.trackingNumber, label?.content)}
                </div>

                <div className={cn(classes.labelValuePanel)}>
                  <span
                    className={classes.labelValue}
                    data-testid={`returnDetailsViewLabels:${label?.trackingnumber}:destination`}
                  >
                    {label?.destinationCode}
                  </span>
                </div>
                <div className={cn(classes.labelValuePanel)}>
                  <span
                    className={classes.labelValue}
                    data-testid={`returnDetailsViewLabels:${label?.trackingnumber}:received`}
                  >
                    {label?.received ? 'YES' : 'NO'}
                  </span>
                </div>
                <br />
              </div>
            </div>
          );
        })
      ) : (
        <div className={classes.noDataFoundPanel}>
          <span data-testid="returnDetailsViewLabels:noDataFoundPanel">
            {'No send back, no return label (no RMA)'}
          </span>
        </div>
      )}

      {showCreateNewLabelsDialog && (
        <CreateNewLabelsDialog
          isOpen={showCreateNewLabelsDialog}
          handleClose={() => setShowCreateNewLabelsDialog(false)}
          returnId={returnId}
          orderId={orderId}
        />
      )}

      {showResendLabelsDialog && (
        <ResendLabelsDialog
          isOpen={showResendLabelsDialog}
          handleClose={() => setShowResendLabelsDialog(false)}
          returnId={returnId}
          orderId={orderId}
        />
      )}
    </div>
  );
};

ReturnDetailsViewLabels.propTypes = {
  returnData: PropTypes.object,
  returnId: PropTypes.string,
  orderId: PropTypes.string,
  isActionAllowed: PropTypes.func.isRequired,
};

export default ReturnDetailsViewLabels;
