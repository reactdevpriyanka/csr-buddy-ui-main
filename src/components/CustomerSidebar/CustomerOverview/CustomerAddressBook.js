import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core';
import { BaseDialog } from '@components/Base';
import useAthena from '@/hooks/useAthena';
import { formatDateWithTime } from '@/utils';
import { useMemo, useCallback } from 'react';
import TooltipPrimary from '@/components/TooltipPrimary';
import Button from '@material-ui/core/Button';
import useEnactment from '@/hooks/useEnactment';
import { FeatureFlag } from '@/features';

const useStyles = makeStyles((theme) => ({
  root: {},
  baseDialog: {
    '& .MuiPaper-root': {
      maxWidth: '1550px',
      width: '1550px',
    },
  },
  dialogTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  addressTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    letterSpacing: '1%',
    color: '#000000',
  },
  dialogSubTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    letterSpacing: '-0.03',
    color: '#4D4D4D',
  },
  addressRow: {
    display: 'grid',
    gridTemplateColumns: '350px 150px 450px 100px 100px 300px',
    gridColumnGap: '5px',
    alignItems: 'center',
    padding: '8px 16px',
    border: '1px solid #666666',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  addressRowPrimary: {
    display: 'grid',
    gridTemplateColumns: '350px 150px 450px 100px 100px 300px',
    gridColumnGap: '5px',
    alignItems: 'center',
    padding: '8px 16px',
    border: '2px solid #1C49C2',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  nameCreated: {
    display: 'flex',
    flexDirection: 'column',
  },
  customerName: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '0.01em',
    color: '#031657',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    cursor: 'pointer',

    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
  created: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#121212',
    whiteSpace: 'nowrap',
  },
  email: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#1C49C2',
    alignSelf: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    cursor: 'pointer',

    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
  customerAddress: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#121212',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    cursor: 'pointer',

    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
  defaultFont: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#121212',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
  },
  legendText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#1C49C2',
  },
  toolTip: {
    marginTop: '5px',
    textTransform: 'none',
  },
  addressSpan: {
    marginLeft: `${theme.utils.fromPx(20)}`,
  },
  addressButton: {
    fontSize: 17,
    fontFamily: 'Roboto',
    marginTop: `${theme.utils.fromPx(8)}`,
    marginBottom: `${theme.utils.fromPx(10)}`,
    padding: '8px 16px',
    //border: '2px solid #1C49C2',
    borderRadius: '6px',
    marginLeft: `${theme.utils.fromPx(10)}`,
    lineHeight: `${theme.utils.fromPx(18)} !important`,
    color: '#1C49C2 !important',
    letterSpacing: '-0.03em !important',
    transition: 'all 0.2s',
    textTransform: 'none',
    '&:focus': {
      border: `2px solid #1C49C2`,
      padding: `5 ${theme.utils.fromPx(6)}`,
    },
  },
}));

const CustomerAddressBook = ({ customer, isOpen = false, openDialog }) => {
  const classes = useStyles();
  const { getLang } = useAthena();

  const pageName = 'Customer Address Book Dialog - VT';

  const handleClose = () => {
    openDialog(false);
  };

  const { openEnactmentPage } = useEnactment();

  const openAddressBookPage = useCallback(() => {
    openEnactmentPage(`/app/account/addressbook`);
  }, [openEnactmentPage]);

  const addresses = useMemo(() => {
    return [...(customer?.addresses || []), ...(customer?.customerAddresses || [])];
  }, customer);

  return isOpen ? (
    <BaseDialog
      data-testid="customer-addressbook-dialog"
      contentClassName={classes.baseDialog}
      pageName={pageName}
      dialogTitle={
        <div className={classes.dialogTitleContainer}>
          <span>
            <span data-testid="customer-addressbook-title" className={classes.dialogTitle}>
              {getLang('addressBookTitleText', { fallback: 'Address Book' })}
            </span>
            <FeatureFlag flag="feature.innovationday.storefront.deeplinking">
              <span data-testid="customer-addressbook-modify" className={classes.addressSpan}>
                <Button
                  variant="text"
                  className={classes.addressButton}
                  onClick={openAddressBookPage}
                >
                  {'Modify Address'}
                </Button>
              </span>
            </FeatureFlag>
          </span>

          <span data-testid="customer-addressbook-user" className={classes.dialogSubTitle}>
            {customer.customerFullName}
          </span>
        </div>
      }
      open={isOpen}
      onClose={handleClose}
      hideButtonPanel={true}
    >
      <div>
        {addresses.map((address) => {
          const fullAddress = `${address.addressLine1 || ''} ${address.city || ''}, ${
            address.state || ''
          } ${address.postcode || ''}`;

          return (
            <fieldset
              data-testid={`address-${address.id}`}
              key={address.id}
              className={address.primaryAddress ? classes.addressRowPrimary : classes.addressRow}
            >
              {address.primaryAddress && (
                <legend data-testid={`address-legend-${address.id}`} className={classes.legendText}>
                  {getLang('primaryShippingAddressText', { fallback: 'Primary Shipping Address' })}
                </legend>
              )}
              <div className={classes.nameCreated}>
                <TooltipPrimary className={classes.toolTip} title={address.fullName}>
                  <span
                    data-testid={`address-fullName-${address.id}`}
                    className={classes.customerName}
                  >
                    {address.fullName}
                  </span>
                </TooltipPrimary>
                <span
                  data-testid={`address-timeCreated-${address.id}`}
                  className={classes.created}
                >{`Created: ${formatDateWithTime(address.timeCreated)}`}</span>
              </div>
              <span data-testid={`address-verified-${address.id}`} className={classes.defaultFont}>
                {_.capitalize(address?.verificationStatus)}
              </span>
              <TooltipPrimary className={classes.toolTip} title={fullAddress}>
                <span
                  data-testid={`address-full-address-${address.id}`}
                  className={classes.customerAddress}
                >
                  {fullAddress}
                </span>
              </TooltipPrimary>
              <span data-testid={`address-country-${address.id}`} className={classes.defaultFont}>
                {address.country}
              </span>
              <span data-testid={`address-phone-${address.id}`} className={classes.defaultFont}>
                {address.phone}
              </span>
              <TooltipPrimary className={classes.toolTip} title={address.email1}>
                <span data-testid={`address-email1-${address.id}`} className={classes.email}>
                  {address.email1}
                </span>
              </TooltipPrimary>
            </fieldset>
          );
        })}
      </div>
    </BaseDialog>
  ) : null;
};

CustomerAddressBook.propTypes = {
  customer: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
};

export default CustomerAddressBook;
