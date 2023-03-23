import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { Button, CircularProgress, MenuItem, Paper } from '@mui/material';
import { convertOrderStatus, searchableOrderStatuses } from '@/constants/OrderStatus';
import useOrderBlockReasons from '@/hooks/useOrderBlockReasons';
import useFulfillmentCenters from '@/hooks/useFulfillmentCenters';
import FormikTextField from './inputs/FormikTextField';
import FormikSelect from './inputs/FormikSelect';
import FormikDate from './inputs/FormikDate';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh !important',
    paddingTop: theme.utils.fromPx(16),
  },
  form: {
    padding: theme.utils.fromPx(16),
    '& > .MuiFormControl-root': {
      marginBottom: theme.utils.fromPx(12),
    },
    '& > .MuiOutlinedInput-root': {
      marginBottom: theme.utils.fromPx(12),
    },
  },
  labelHelper: {
    color: '#666666',
    marginTop: theme.utils.fromPx(0),
    marginBottom: theme.utils.fromPx(6),
  },
  errorText: {
    color: 'red',
  },
}));

const SearchForm = ({
  searchInProgress,
  values,
  errors,
  handleChange,
  handleSubmit,
  isValid,
  dirty,
  resetForm,
}) => {
  const classes = useStyles();

  const { data: orderBlockReasons } = useOrderBlockReasons();

  const { data: ffmCentersList, error: fulfillmentCentersError } = useFulfillmentCenters();

  return (
    <Paper sx={{ borderRadius: 'unset', borderTopRightRadius: '4px' }} className={classes.form}>
      <FormikTextField
        fullWidth
        name="orderId"
        id="orderId"
        label="Order ID"
        value={values.orderId}
        onChange={handleChange}
        error={errors.orderId}
        helperText={
          errors.orderId
            ? errors.orderId
            : 'Searching by order ID will ignore all other search criteria.'
        }
      />
      <FormikSelect
        name="status"
        onChange={handleChange}
        value={values.status}
        labelId="order-status-select"
        label="Order Status"
      >
        {Object.entries(searchableOrderStatuses)?.map(([key, status]) => (
          <MenuItem key={key} value={key}>
            {convertOrderStatus(status)}
          </MenuItem>
        ))}
      </FormikSelect>
      <FormikTextField
        name="name"
        onChange={handleChange}
        value={values.name}
        fullWidth
        label="Customer Name"
      />
      <FormikTextField
        name="address"
        onChange={handleChange}
        value={values.address}
        fullWidth
        label="Address"
      />
      <FormikTextField
        name="city"
        onChange={handleChange}
        value={values.city}
        fullWidth
        label="City"
      />
      <FormikTextField
        name="zip"
        onChange={handleChange}
        value={values.zip}
        fullWidth
        label="ZIP/Postal Code"
      />
      <FormikTextField
        name="phone"
        onChange={handleChange}
        value={values.phone}
        fullWidth
        label="Phone Number"
      />
      <FormikTextField
        name="partNumber"
        onChange={handleChange}
        value={values.partNumber}
        fullWidth
        label="Contains SKU"
      />
      <FormikSelect
        name="blocked"
        onChange={handleChange}
        value={values.blocked}
        label="Blocked Status"
      >
        <MenuItem value="true">{'Blocked'}</MenuItem>
        <MenuItem value="false">{'Not Blocked'}</MenuItem>
      </FormikSelect>
      <FormikSelect
        name="blockReason"
        onChange={handleChange}
        value={values.blockReason}
        disabled={values.blocked.length === 0}
        fullWidth
        select
        id="blockReason"
        label="Blocked Reason"
      >
        {orderBlockReasons?.map((reason) => (
          <MenuItem value={reason.name} key={reason.name}>
            {reason.id} - {reason.displayName}
          </MenuItem>
        ))}
      </FormikSelect>
      <FormikSelect
        name="fulfillmentCenter"
        onChange={handleChange}
        value={values.status}
        fullWidth
        select
        disabled={!ffmCentersList}
        error={ffmCentersList && fulfillmentCentersError}
        errorText={<span className={classes.errorText}>Error getting fulfillment center list</span>}
        labelId="demo-simple-select-label"
        label="Fulfillment Center"
      >
        {ffmCentersList?.map(({ name, value }) => (
          <MenuItem key={value} value={value}>
            {name}
          </MenuItem>
        ))}
      </FormikSelect>

      <FormikTextField
        name="account"
        onChange={handleChange}
        value={values.account}
        fullWidth
        label="Payment Account # (last 4)"
      />
      <FormikTextField
        name="paymentId"
        onChange={handleChange}
        value={values.paymentId}
        fullWidth
        label="Payment ID"
      />
      <FormikTextField
        name="paypalEmail"
        onChange={handleChange}
        value={values.paypalEmail}
        fullWidth
        label="PayPal Email"
      />
      <FormikTextField
        name="ipAddress"
        onChange={handleChange}
        value={values.ipAddress}
        fullWidth
        label="IP Address"
      />
      <p className={classes.labelHelper}>Created Range</p>
      <FormikDate
        name="timePlacedFrom"
        value={values.timePlacedFrom}
        onChange={handleChange}
        fullWidth
        label="Start"
        input
        autoOk={true}
        disableFuture
        error={errors.timePlacedFrom}
      />
      <FormikDate
        value={values.timePlacedTo}
        onChange={handleChange}
        name="timePlacedTo"
        label="End"
        format="yyyy-MM-dd"
        disableFuture
        formatTime="T23:59:59"
      />
      <p className={classes.labelHelper}>Modified Range</p>
      <FormikDate
        value={values.timeUpdatedFrom}
        onChange={handleChange}
        name="timeUpdatedFrom"
        format="yyyy-MM-dd"
        label="Start"
        disableFuture
        error={errors.timeUpdatedFrom}
      />
      <FormikDate
        value={values.timeUpdatedTo}
        onChange={handleChange}
        name="timeUpdatedTo"
        format="yyyy-MM-dd"
        label="End"
        disableFuture
        formatTime="T23:59:59"
      />
      <Button sx={{ marginTop: '0.5rem', color: 'black' }} variant="text" onClick={resetForm}>
        Clear Form
      </Button>

      <Button
        type="submit"
        sx={{ marginTop: '0.5rem', float: 'right', backgroundColor: '#1C49C2', minWidth: '88px' }}
        variant="contained"
        onClick={handleSubmit}
        disabled={!isValid || searchInProgress || !dirty}
      >
        {searchInProgress ? (
          <CircularProgress size={24} sx={{ float: 'right', color: '#1C49C2' }} color="primary" />
        ) : (
          <span>{'Search'}</span>
        )}
      </Button>
    </Paper>
  );
};

SearchForm.propTypes = {
  values: PropTypes.object,
  searchInProgress: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  resetForm: PropTypes.func,
  errors: PropTypes.object,
  isValid: PropTypes.bool,
  dirty: PropTypes.bool,
};

export default SearchForm;
