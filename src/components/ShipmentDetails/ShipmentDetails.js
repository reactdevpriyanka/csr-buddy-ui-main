import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { FormControl, makeStyles, MenuItem, TextField } from '@material-ui/core';
import useCustomer from '@/hooks/useCustomer';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import { useSWRConfig } from 'swr';
import useOrder from '@/hooks/useOrder';
import useAthena from '@/hooks/useAthena';
import { SNACKVARIANTS } from '../SnackMessage/SnackMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    padding: theme.utils.fromPx(16),
    marginTop: `${theme.utils.fromPx(10)}`,
    marginBottom: `${theme.utils.fromPx(16)}`,
    '& > *': {
      display: 'block',
    },
  },
  header: {
    fontSize: `${theme.utils.fromPx(18)}`,
    fontWeight: '500',
    marginTop: '0px',
    color: theme.palette.primary.main,
  },
  subHeader: {
    marginTop: `${theme.utils.fromPx(16)}`,
    fontSize: `${theme.utils.fromPx(16)}`,
    fontWeight: '500',
    ...theme.utils.nospace,
    color: theme.palette.black,
  },
  dropDown: {
    paddingTop: `${theme.utils.fromPx(6)}`,
    '& .MuiSelect-selectMenu': {
      backgroundColor: `white`,
    },
  },
  editSaveBtn: {
    float: 'right',
    fontSize: `${theme.utils.fromPx(12)}`,
    fontWeight: '400',
    color: '#1C49C2',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  customerError: {
    color: 'red',
  },
}));

const ShipmentDetails = ({ currentShipment, editable, orderNumber, setShipmentAddress }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const { updateShippingAddress } = useOrder();

  const { data: customer, error: customerError } = useCustomer();

  const [isEditable, setIsEditable] = useState(editable);

  const { captureInteraction } = useAgentInteractions();

  const { mutate } = useSWRConfig();

  const { getLang } = useAthena();

  const handleShipmentChange = useCallback(
    (addr) => {
      updateShippingAddress(orderNumber, addr.kyriosId)
        .then(() => {
          captureInteraction({
            type: 'UPDATED_SHIPPING_ADDRESS',
            subjectId: orderNumber,
            action: 'UPDATE',
            currentVal: addr,
            prevVal: {},
          });
          enqueueSnackbar({
            messageHeader: 'Success',
            variant: SNACKVARIANTS.SUCCESS,
            messageSubheader: `Updated order #${orderNumber}'s address`,
            persist: false,
          });
        })
        .then(() => {
          mutate(`/api/v3/order-activities/${orderNumber}`);
        })
        .catch((error) => {
          setShipmentAddress(currentShipment);
          mutate(`/api/v3/order-activities/${orderNumber}`);
          enqueueSnackbar({
            messageHeader: 'Error',
            messageSubheader: `Failed up update order #${orderNumber}'s address`,
            persist: false,
            variant: SNACKVARIANTS.ERROR,
          });
        });
    },
    [currentShipment, enqueueSnackbar, orderNumber, updateShippingAddress],
  );

  const handleEditSaveClick = () => {
    setIsEditable(!isEditable);

    if (isEditable) {
      // meaning the user clicked 'save'
      handleShipmentChange(currentShipment);
    }
  };

  return (
    <div className={classes.root} data-testid={`shipment-details-${orderNumber}`}>
      <h2 className={classes.header}>
        {getLang('paymentandshipingText', { fallback: 'Payment & Shipping Details' })}
      </h2>
      <span className={classes.subHeader}>
        {getLang('paymentMethodLabelText', { fallback: 'Payment Method' })}
      </span>
      <span>N/A</span>
      <div className={classes.subHeader}>
        <span>{getLang('shippingAddressLabelText', { fallback: 'Shipping Address' })}</span>
        <div
          className={classes.editSaveBtn}
          onClick={handleEditSaveClick}
          onKeyDown={handleEditSaveClick}
          data-testid={`save-edit-btn-${orderNumber}`}
        >
          {isEditable ? 'Save' : 'Edit'}
        </div>
      </div>
      {isEditable ? (
        <FormControl>
          <TextField
            select
            fullWidth
            variant="outlined"
            className={classes.dropDown}
            value={currentShipment}
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
      ) : (
        <>
          <span data-testid={`shipment-first-name-${orderNumber}`}>{currentShipment.fullName}</span>
          <span data-testid={`shipment-full-address-${orderNumber}`}>
            {currentShipment.addressLine1}, {currentShipment.state}{' '}
            {currentShipment.postcode.split('-')[0]}
          </span>
        </>
      )}
    </div>
  );
};

ShipmentDetails.propTypes = {
  currentShipment: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  orderNumber: PropTypes.string.isRequired,
  setShipmentAddress: PropTypes.func,
};

export default ShipmentDetails;
