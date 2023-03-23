import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import useAthena from '@/hooks/useAthena';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import useCustomer from '@/hooks/useCustomer';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import BaseDialog from '@/components/Base/BaseDialog';
import { makeStyles } from '@material-ui/core/styles';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import useOrder from '@/hooks/useOrder';

const useStyles = makeStyles((theme) => ({
  baseDialog: {
    '& .MuiPaper-root': {
      maxWidth: '582px',
      width: '582px',
    },
    '& .MuiDialogActions-root': {
      padding: '1rem 1.75rem',
      backgroundColor: theme.palette.gray[375],
    },
    '& .MuiDialogTitle-root': {
      padding: '1rem 1.75rem',
      backgroundColor: theme.palette.gray[375],
    },
  },
  dropDown: {
    width: `${theme.utils.fromPx(534)}`,
    height: `${theme.utils.fromPx(56)}`,
    '& .MuiSelect-selectMenu': {
      backgroundColor: `white`,
    },
  },
  header: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    color: '#031657',
  },
}));

export default function ShowShippingAddressDialog({
  isOpen,
  openDialog,
  orderNumber,
  currentShipment,
  shippingAddress,
}) {
  const classes = useStyles();

  const { getLang } = useAthena();

  const { enqueueSnackbar } = useSnackbar();

  const { updateShippingAddress, mutate } = useOrder();

  const { data: customer, error: customerError } = useCustomer();

  const [currentShipmentAddress, setShipmentAddress] = useState(shippingAddress);

  const { captureInteraction } = useAgentInteractions();

  const { revalidateOrderDetails } = useOrderDetailsContext();

  const [requestInFlight, setRequestInFlight] = useState(false);

  const pageName = 'Show Shipping Address Dialog - VT';

  const handleSubmit = useCallback(() => {
    setRequestInFlight(true);
    updateShippingAddress(orderNumber, currentShipmentAddress.kyriosId)
      .then(() => {
        mutate();
        captureInteraction({
          type: 'UPDATED_SHIPPING_ADDRESS',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: currentShipmentAddress,
          prevVal: {},
        });
        return revalidateOrderDetails();
      })
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Updated order #${orderNumber}'s address`,
          persist: false,
        });
      })
      .catch(() => {
        setShipmentAddress(currentShipment);
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: `Failed up update order #${orderNumber}'s address`,
          persist: false,
          variant: SNACKVARIANTS.ERROR,
        });
      })
      .finally(() => {
        setRequestInFlight(false);
        openDialog(false);
      });
  }, [
    currentShipment,
    enqueueSnackbar,
    orderNumber,
    updateShippingAddress,
    currentShipmentAddress,
  ]);

  const handleClose = useCallback(() => {
    openDialog(false);
  }, [openDialog]);

  return (
    isOpen && (
      <BaseDialog
        data-testid="shippingAddressUpdateModal"
        contentClassName={classes.baseDialog}
        open={isOpen}
        dialogTitle={<span className={classes.header}>{'Update Shipping Address'}</span>}
        onClose={handleClose}
        hideButtonPanel={false}
        okLabel={getLang('addUpdateShippingLabel', { fallback: 'Save' })}
        closeLabel="Cancel"
        onOk={handleSubmit}
        disableOkBtn={requestInFlight}
        requestInFlight={requestInFlight}
        pageName={pageName}
      >
        <FormControl>
          <TextField
            select
            fullWidth
            variant="outlined"
            className={classes.dropDown}
            value={currentShipmentAddress}
            name="Save addresses"
            data-testid={`switch-address-select-${orderNumber}`}
            SelectProps={{
              MenuProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              },
              renderValue: (shipment) =>
                [
                  shipment?.addressLine1,
                  shipment?.addressLine2,
                  shipment?.city + ' ' + shipment?.state,
                ]
                  .filter((v) => v)
                  .join(', '),
            }}
          >
            {customer?.addresses &&
              customer.addresses.map((addr) => (
                <MenuItem key={addr.id} value={addr} onClick={() => setShipmentAddress(addr)}>
                  {[addr?.addressLine1, addr?.addressLine2, addr?.city + ' ' + addr?.state]
                    .filter((v) => v)
                    .join(', ')}
                </MenuItem>
              ))}
          </TextField>
          {customerError && (
            <span className={classes.customerError}>
              Error retrieving customer&apos;s addresses
            </span>
          )}
        </FormControl>
      </BaseDialog>
    )
  );
}

ShowShippingAddressDialog.propTypes = {
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
  currentShipment: PropTypes.object.isRequired,
  shippingAddress: PropTypes.object,
};
