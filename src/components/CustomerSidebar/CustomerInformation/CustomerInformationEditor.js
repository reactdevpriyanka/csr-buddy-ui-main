import { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Typography } from '@material-ui/core';
import Button from '@/components/Button';
import useCustomer from '@/hooks/useCustomer';
import Progress from '@material-ui/core/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import { capitalize } from '@utils/string';
import ErrorOverview from '@components/CustomerSidebar/CustomerOverview/ErrorOverview';
import usePanels from '@/hooks/usePanels';
import { FeatureFlag } from '@/features';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useAthena from '@/hooks/useAthena';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.customerSidebarSubpanel,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formContainer: {
    marginTop: theme.utils.fromPx(24),
    borderBottom: theme.borders.lightSm,
  },
  footerContainer: {
    width: '100%',
    height: theme.utils.fromPx(60),
    background: theme.palette.gray[50],
    borderTop: `1px solid ${theme.palette.gray[150]}`,
    marginTop: theme.utils.fromPx(24),
  },
  footerInnerContent: {
    marginLeft: theme.utils.fromPx(20),
    marginRight: theme.utils.fromPx(20),
    paddingTop: theme.utils.fromPx(12),
    paddingBottom: theme.utils.fromPx(12),
  },
  contentContainer: {
    width: '90%',
    marginLeft: theme.utils.fromPx(24),
    paddingRight: theme.utils.fromPx(20),
  },
  formControl: {
    marginTop: theme.spacing(1),
    width: '95%',
  },
  header: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: theme.utils.fromPx(24),
    letterSpacing: theme.utils.fromPx(0.25),
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.25),
  },
  disabledTextFieldBackground: {
    '& .MuiOutlinedInput-root': {
      background: '#DDDDDD',
    },
  },
  disabledTextFieldLabel: {
    background: theme.palette.white,
    marginLeft: theme.spacing(-0.3),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

const isValidForUpdate = (newCustomer) =>
  newCustomer.email.value && newCustomer.fullName.value && newCustomer.status.value;

const CustomerInformationEditor = () => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const { navigateToPanel } = usePanels();
  const { captureInteraction } = useAgentInteractions();
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, updateCustomer, mutate } = useCustomer();

  const customer = {
    id: '',
    addresses: [],
    customerAddresses: [],
    email: '',
    ...data,
  };

  const primaryAddress =
    customer.addresses.length > 0
      ? customer.addresses.find((address) => address.primaryAddress) || customer.addresses[0]
      : null;

  const [newCustomer, setNewCustomer] = useState({
    email: {
      value: customer.email,
      defaultText: '',
      errorText: 'Invalid email',
      regexValidate: /^.+@.+\..+$/,
    },
    fullName: {
      value: customer.customerFullName,
      defaultText: '',
      errorText: 'Invalid name',
      regexValidate: /^.+$/,
    },
    phone: {
      value: primaryAddress?.phone,
      defaultText: '',
      errorText: 'Invalid phone',
      regexValidate: /(\d{3})(\d{3})(\d{4})/g,
    },
    status: {
      value: customer.status,
      defaultText:
        "Inactive does not erase or cancel the account; Inactive prevents the customer/ CSR from accessing the customer's Chewy account. Ask customer if they want to cancel active Autoship orders and cancel them for the customer.",
    },
  });

  const oldCustomer = {
    email: customer.email,
    fullName: customer.customerFullName,
    phone: primaryAddress?.phone,
    status: customer.status,
  };

  /**
   * TODO: make this doable in more than one place
   */
  const [statusFieldTouched, setStatusFieldTouched] = useState(false);
  const [enableActions, setEnableActions] = useState(false);

  const onBack = useCallback(() => {
    navigateToPanel('default');
  }, [navigateToPanel]);

  const onSave = useCallback(() => {
    const customerData = {
      email: newCustomer.email.value,
      fullName: newCustomer.fullName.value,
      status: newCustomer.status.value,
      phone: newCustomer.phone.value,
    };

    if (customer.id && isValidForUpdate(newCustomer)) {
      setEnableActions(false);
      updateCustomer(
        customer.id,
        {
          email: newCustomer.email.value,
          fullName: newCustomer.fullName.value,
          status: newCustomer.status.value,
          phone: newCustomer.phone.value,
        },
        () => {
          postInteraction(customerData);
          mutate()
            .then(onBack)
            .then(() => {
              enqueueSnackbar({
                messageHeader: 'Success',
                variant: SNACKVARIANTS.SUCCESS,
                messageSubheader: `Successfully updated Customer Details`,
              });
            });
        },
      ).catch((error) => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to update Customer Details`,
        });
      });
    }
  }, [customer, newCustomer]);

  const postInteraction = useCallback(
    (customerData) => {
      captureInteraction({
        type: 'CUSTOMER_PROFILE_UPDATED',
        subjectId: customer.id,
        action: 'UPDATE',
        currentVal: customerData,
        prevVal: oldCustomer || {},
      });
    },
    [captureInteraction, oldCustomer, customer],
  );

  if (error) {
    return <ErrorOverview />;
  }

  if (!data) {
    return (
      <div data-testid="loader">
        <Progress />
      </div>
    );
  }

  const handleChangeCustomer = (field) => (event) => {
    if (field) {
      const value = event.target.value;
      const fieldObj = newCustomer[field];
      const isValidValue = !(fieldObj.regexValidate && !fieldObj.regexValidate.test(value));
      setNewCustomer({
        ...newCustomer,
        [field]: {
          ...fieldObj,
          value: value,
          helperText: isValidValue ? fieldObj.defaultText : fieldObj.errorText,
        },
      });
      if (isValidValue) {
        setEnableActions(true);
      } else {
        setEnableActions(false);
      }
      if (field === 'status') {
        setStatusFieldTouched(true);
      }
    }
  };

  return (
    <div className={classes.root}>
      <form
        autoComplete="off"
        data-testid="tag-editor"
        className={classes.formContainer}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={classes.contentContainer}>
          <Typography
            variant="h2"
            className={classes.header}
            data-testid="edit-header-customerDetails"
          >
            {getLang('editCustomerDetailsText', { fallback: 'Edit Customer Details' })}
          </Typography>

          <div>
            <FormControl className={classes.formControl}>
              <TextField
                error={!!newCustomer.email.helperText}
                label="Email"
                value={newCustomer.email.value}
                name="email"
                type="text"
                onChange={handleChangeCustomer('email')}
                data-testid="edit-email"
                variant="outlined"
                helperText={newCustomer.email.helperText || newCustomer.email.defaultText}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                error={!!newCustomer.fullName.helperText}
                label="Full Name"
                value={newCustomer.fullName.value}
                name="fullName"
                type="text"
                data-testid="edit-fullName"
                onChange={handleChangeCustomer('fullName')}
                variant="outlined"
                helperText={newCustomer.fullName.helperText || newCustomer.fullName.defaultText}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                label="Account Status"
                value={newCustomer.status.value || 'INACTIVE'}
                select
                name="status"
                data-testid="edit-status"
                variant="outlined"
                onChange={handleChangeCustomer('status')}
                helperText={
                  /* @see {https://chewyinc.atlassian.net/browse/CSRBT-825} */
                  statusFieldTouched &&
                  newCustomer?.status?.value === 'INACTIVE' &&
                  (newCustomer.status.helperText || newCustomer.status.defaultText)
                }
              >
                {['ACTIVE', 'INACTIVE'].map((status) => (
                  <MenuItem key={status} value={status} data-testid={`edit-status:${status}`}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl className={classes.formControl}>
              <FeatureFlag flag="feature.explorer.phoneNumberEditEnabled">
                {primaryAddress?.phone.length > 0 ? (
                  <TextField
                    error={!!newCustomer.phone.helperText}
                    label="Phone"
                    value={newCustomer.phone.value}
                    name="phone"
                    data-testid="edit-phone"
                    variant="outlined"
                    type="number"
                    onChange={handleChangeCustomer('phone')}
                    helperText={newCustomer.phone.helperText || newCustomer.phone.defaultText}
                  />
                ) : (
                  <TextField
                    label="Phone"
                    value={primaryAddress?.phone}
                    name="disablephone"
                    data-testid="disable-phone"
                    variant="outlined"
                    className={classes.disabledTextFieldBackground}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ className: classes.disabledTextFieldLabel }}
                  />
                )}
              </FeatureFlag>
              <FeatureFlag flag="feature.explorer.phoneNumberNonEditEnabled">
                {primaryAddress?.phone.length > 0 ? (
                  <TextField
                    label="Phone"
                    value={primaryAddress?.phone}
                    name="noneditablephone"
                    data-testid="noneditable-phone"
                    variant="outlined"
                    className={classes.disabledTextFieldBackground}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ className: classes.disabledTextFieldLabel }}
                  />
                ) : (
                  <TextField
                    label="Phone"
                    value={primaryAddress?.phone}
                    name="disablephone"
                    data-testid="disable-phone"
                    variant="outlined"
                    className={classes.disabledTextFieldBackground}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ className: classes.disabledTextFieldLabel }}
                  />
                )}
              </FeatureFlag>
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                label="Location"
                value={
                  primaryAddress?.city && primaryAddress?.state
                    ? `${capitalize(primaryAddress?.city)}, ${primaryAddress?.state}`
                    : ''
                }
                name="location"
                data-testid="edit-location"
                variant="outlined"
                className={classes.disabledTextFieldBackground}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ className: classes.disabledTextFieldLabel }}
              />
            </FormControl>
          </div>
        </div>
      </form>
      <div className={classes.footerContainer}>
        <div className={classes.footerInnerContent} align="right">
          <Button onClick={onBack} solidWhite data-testid="cancel-edit" aria-label="Tap to go back">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            solid
            data-testid="save-edit"
            disabled={!enableActions}
            aria-label="Tap to go save details"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

CustomerInformationEditor.propTypes = {};

export default CustomerInformationEditor;
