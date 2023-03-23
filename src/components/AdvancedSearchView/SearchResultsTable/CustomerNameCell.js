import PropTypes from 'prop-types';
import useCustomer from '@/hooks/useCustomer';
import { Skeleton } from '@mui/material';

const CustomerNameCell = ({ customerId }) => {
  const { data: customer, error } = useCustomer(customerId);

  return (
    <>
      {!customer && !error && <Skeleton animation="wave" />}
      <span>{customer?.customerFullName}</span>
      {error && <span>Error getting customer name</span>}
    </>
  );
};

CustomerNameCell.propTypes = {
  customerId: PropTypes.string,
};

export default CustomerNameCell;
