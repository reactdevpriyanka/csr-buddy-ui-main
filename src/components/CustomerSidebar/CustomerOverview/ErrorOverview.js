import { useCallback } from 'react';
import { Button } from '@material-ui/core';
import WarningIcon from '@mui/icons-material/Warning';
import useCustomer from '@/hooks/useCustomer';

const ErrorOverview = () => {
  const { mutate } = useCustomer();

  const onClick = useCallback(() => mutate(), [mutate]);

  return (
    <div>
      <WarningIcon />
      <p>{'An error has occurred while loading data for this customer'}</p>
      <Button onClick={onClick}>{'Try Again'}</Button>
    </div>
  );
};

export default ErrorOverview;
