import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { BaseDialog } from '@components/Base';
import useSubscriptions from '@/hooks/useSubscriptions';
import useAthena from '@/hooks/useAthena';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '1%',
    color: '#333333',
  },
}));

const AutoshipSkipNextDialog = ({
  name,
  customerId,
  subscriptionId,
  isOpen = false,
  openDialog,
  postInteraction,
}) => {
  const classes = useStyles();
  const { skipNextShipment } = useSubscriptions();
  const { getLang } = useAthena();

  const pageName = 'Autoship Skip Next Dialog - VT';

  const captureInteraction = useCallback(() => {
    const data = {
      name: name,
      skip: 'true',
    };
    postInteraction('AUTOSHIP_SKIPPED', data, 'CREATE');
  }, [postInteraction, name]);

  const handleSkipAutoship = () => {
    skipNextShipment({ subscriptionId, customerId, data: {} }, captureInteraction);
    openDialog(false);
  };

  const handleClose = () => {
    openDialog(false);
  };

  return isOpen ? (
    <BaseDialog
      data-testid="autoship-skip-next"
      dialogTitle={
        <span className={classes.dialogTitle}>
          {getLang('skipNextShipmentText', { fallback: 'Skip Next Shipment' })}
        </span>
      }
      open={isOpen}
      okLabel={getLang('skipNextOkText', { fallback: 'Skip' })}
      onOk={handleSkipAutoship}
      closeLabel={getLang('cancelText', { fallback: 'Cancel' })}
      onClose={handleClose}
      pageName={pageName}
    >
      {getLang('skipNextShipmentQuestionText', {
        fallback: `Skip customers next shipment associated with Autoship ID #${subscriptionId}?`,
      })}
    </BaseDialog>
  ) : null;
};

AutoshipSkipNextDialog.propTypes = {
  name: PropTypes.string,
  customerId: PropTypes.string.isRequired,
  subscriptionId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  postInteraction: PropTypes.func,
};

export default AutoshipSkipNextDialog;
