/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import { getDayDateYearTimeTimezone } from '@/utils';
import { useState } from 'react';
import { ButtonGroup, Button } from '@mui/material';
import PropTypes from 'prop-types';
import useAthena from '@/hooks/useAthena';
import { AllowableActions } from '../OrderDetailsView/utils';
import CancelReturnDialog from './CancelReturnDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '10px',
  },
  headerPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailPanel: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'right',
    columnGap: '1px',
  },
  placed: {
    fontFamily: 'Roboto, Regular',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  placedTime: {
    fontFamily: 'Roboto, Regular',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#121212',
  },
  header: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    letterSpacing: '1%',
    color: '#031657',
  },
  btnTxt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#1C49C2',
    textTransform: 'none',
  },
  button: {
    backgroundColor: '#FFFFFF !important',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    opacity: '1',
    height: '40px',
    padding: '14px 20px 14px 20px',
    border: '1px solid #1C49C2 !important',
    '&:hover': {
      backgroundColor: '#B8D7F3 !important',
    },
  },
  placedPanel: {
    display: 'flex',
  },
}));

const ReturnDetailsViewHeader = ({ returnData, isActionAllowed, orderId }) => {
  const classes = useStyles();
  const [openCancelReturnDialog, setOpenCancelReturnDialog] = useState(false);
  const { getLang } = useAthena(); // athena config
  const handleCancelReturn = () => {
    setOpenCancelReturnDialog(true);
  };

  return (
    <div data-testid="returnDetailsViewHeaderContainer" className={classes.root}>
      <div className={classes.detailPanel}>
        <div className={classes.headerPanel}>
          <span className={classes.header}>
            {' '}
            {returnData?.type} Detail ({returnData?.id})
          </span>
          <div className={classes.placedPanel}>
            <span className={classes.placed}>{`Placed: ${getDayDateYearTimeTimezone(
              returnData?.timeCreated,
            )}`}</span>
          </div>
        </div>
        {isActionAllowed({ actionName: AllowableActions.CANCEL_RETURN }) && (
          <div className={classes.buttonPanel}>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
              <Button
                variant="outlined"
                data-testid={`order-button-cancel-${returnData?.id}`}
                className={classes.button}
                disableRipple
                aria-label="Cancel Return"
                onClick={handleCancelReturn}
              >
                <span className={classes.btnTxt}>
                  {getLang('returnCancelReturnLabel', { fallback: 'Cancel Return' })}
                </span>
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>
      {openCancelReturnDialog && (
        <CancelReturnDialog
          isOpen={openCancelReturnDialog}
          openDialog={setOpenCancelReturnDialog}
          returnId={returnData?.id}
          orderId={orderId}
        />
      )}
    </div>
  );
};

ReturnDetailsViewHeader.propTypes = {
  returnData: PropTypes.object,
  isActionAllowed: PropTypes.func.isRequired,
  orderId: PropTypes.string,
};

export default ReturnDetailsViewHeader;
