import { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Progress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '@utils/string';
import useCustomer from '@/hooks/useCustomer';
import usePanels from '@/hooks/usePanels';
import LabelValueField from '@components/LabelValueField';
import Typography from '@material-ui/core/Typography';
import Link from '@mui/material/Link';
import { FeatureFlag } from '@/features';
import { useRouter } from 'next/router';
import ResetPasswordModal from '@components/ResetPasswordModal';
import useScrollLock from '@/hooks/useScrollLock';
import useAthena from '@/hooks/useAthena';
import CustomerAddressBook from '../CustomerOverview/CustomerAddressBook';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(2),
    padding: `0 0 ${theme.spacing(1.1)}`,
    borderBottom: '1px solid #f5f5f5',
  },
  heading: {
    ...theme.fonts.h2,
    marginTop: theme.spacing(0.25),
    marginBottom: theme.spacing(1.2),
    marginRight: theme.spacing(0.5),
    color: theme.palette.blue.dark,
    whiteSpace: 'nowrap',
  },
  headerSpan: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    color: '#1C49C2',
    fontWeight: '700',
  },
  link: {
    alignItems: 'flex-end',
    fontWeight: '700',
    fontSize: '14px',
    paddingTop: theme.spacing(0.4),
    cursor: 'pointer',
    textTransform: 'uppercase',
    color: '#1C49C2',
  },
  resetPasswordLink: {
    padding: `0`,
    display: 'block',
    color: theme.palette.blue.chewyBrand,
    border: '1px solid transparent',
    transition: 'all 0.2s',
    textTransform: 'none',
    '&:active': {
      border: `1px solid ${theme.palette.blue.chewyBrand}`,
      padding: `0 ${theme.utils.fromPx(6)}`,
    },
    '&:not(:first-child)': {
      marginTop: theme.utils.fromPx(4),
    },
  },
  giftCardLink: {
    padding: `0`,
    display: 'block',
    color: theme.palette.blue.chewyBrand,
    border: '1px solid transparent',
    transition: 'all 0.2s',
    textTransform: 'none',
    '&:focus': {
      border: `1px solid ${theme.palette.blue.chewyBrand}`,
      padding: `0 ${theme.utils.fromPx(6)}`,
    },
    '&:not(:first-child)': {
      marginTop: theme.utils.fromPx(4),
    },
  },
}));

const CustomerInformation = () => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena();
  const { unlockScroll } = useScrollLock();

  const [openCustomerAddressBook, setOpenCustomerAddressBook] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);

  const handleResetPasswordClick = useCallback(() => {
    setOpenResetPasswordDialog(true);
  }, [setOpenResetPasswordDialog]);

  const navigateToGiftCardsAndPromotions = () => {
    const { id: customerId } = router.query;
    router.push(`/customers/${customerId}/giftcards-promotions`);
  };

  useEffect(() => {
    if (!openCustomerAddressBook) {
      unlockScroll();
    }
  }, [openCustomerAddressBook]);

  useEffect(() => {
    if (!openResetPasswordDialog) {
      unlockScroll();
    }
  }, [openResetPasswordDialog]);

  const { data, error } = useCustomer();
  const { navigateToPanel } = usePanels();

  if (error) {
    return null;
  }

  if (!data) {
    return (
      <div data-testid="loader">
        <Progress />
      </div>
    );
  }

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

  const phoneNumberFormatter = function (phone) {
    const phoneRegex = /(\d{3})(\d{3})(\d{4})/g;

    if (isValidPhoneNumber(phone)) {
      const matches = phoneRegex.exec(phone.replace(/\D/g, ''));
      return '(' + matches[1] + ')' + matches[2] + '-' + matches[3];
    }
    return phone;
  };

  const isValidPhoneNumber = function (value) {
    return value && value.match(/^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/);
  };

  const onEditCustomerInformation = () => {
    navigateToPanel('customerInformationEditor');
  };

  return (
    <>
      <form
        autoComplete="off"
        data-testid="customer-sidebar:form"
        className={classes.formContainer}
      >
        <span className={classes.headerSpan}>
          <Typography className={classes.heading} variant="h2">
            {getLang('customerDetailsText', { fallback: 'Customer Details' })}
          </Typography>
          <FeatureFlag flag="feature.explorer.editCustomerDetailsEnabled">
            <Link
              variant="text"
              color="#1C49C2"
              aria-label="edit customer information"
              component="span"
              data-testid="edit-customer-info"
              underline="hover"
              className={classes.link}
              onClick={onEditCustomerInformation}
            >
              Edit
            </Link>
          </FeatureFlag>
        </span>
        <LabelValueField
          id="cid"
          name="cid"
          label="CID:"
          data-testid="customer:cid"
          value={customer.id}
        />
        <LabelValueField
          id="status"
          name="status"
          label="Status:"
          data-testid="customer:status"
          value={customer.status}
          valueColor={customer.status === 'ACTIVE' ? '#0A8E4E' : '#851940'}
        />
        <LabelValueField
          id="email"
          name="email"
          label="Email:"
          data-testid="customer:email"
          value={customer.email}
        />
        <LabelValueField
          id="phoneNumber"
          name="phoneNumber"
          label="Phone:"
          data-testid="customer:phoneNumber"
          value={primaryAddress?.phone}
          valueFormatter={phoneNumberFormatter}
        />
        <LabelValueField
          id="location"
          name="location"
          label="Location:"
          data-testid="customer:location"
          value={
            primaryAddress?.city && primaryAddress?.state
              ? `${capitalize(primaryAddress?.city)}, ${primaryAddress?.state}`
              : ''
          }
        />
        <FeatureFlag flag="feature.explorer.resetPasswordEnabled">
          <Button
            variant="text"
            onClick={handleResetPasswordClick}
            data-testid="reset-password-link"
            className={classes.resetPasswordLink}
          >
            {'Reset Password'}
          </Button>
          <ResetPasswordModal
            isOpen={openResetPasswordDialog}
            setOpenDialog={setOpenResetPasswordDialog}
          />
        </FeatureFlag>
        <FeatureFlag flag="feature.explorer.customerAddressBookEnabled">
          <Button
            variant="text"
            onClick={() => setOpenCustomerAddressBook(true)}
            data-testid="customer-addressbook-icon"
            className={classes.resetPasswordLink}
          >
            {'Address Book'}
          </Button>
        </FeatureFlag>
        <FeatureFlag flag="feature.explorer.giftCardsAndPromotionsPageEnabled">
          <Button
            variant="text"
            onClick={navigateToGiftCardsAndPromotions}
            data-testid="gift-cards-and-promotions-link"
            className={classes.giftCardLink}
          >
            {'Gift Cards & Promotions'}
          </Button>
        </FeatureFlag>
      </form>
      {openCustomerAddressBook && (
        <CustomerAddressBook
          isOpen={openCustomerAddressBook}
          openDialog={setOpenCustomerAddressBook}
          customer={customer}
        />
      )}
    </>
  );
};

CustomerInformation.propTypes = {};

export default CustomerInformation;
