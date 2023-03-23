import { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import useEnactment from '@/hooks/useEnactment';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useCustomer from '@/hooks/useCustomer';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex', // center the icon
    flexFlow: 'row nowrap', // center the icon
    alignItems: 'center', // center the icon
    justifyContent: 'center', // center the icon
    height: theme.utils.fromPx(32), // circle
    width: 'fitContent', // circle
    borderRadius: '100%', // make it a circle
    padding: '0 !important', // remove whitespace
    margin: 0, // remove whitespace
    minWidth: 0, // override material button's minWidth property
  },
  button: {
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
  label: {
    fontSize: theme.utils.fromPx(12),
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'bold',
    lineHeight: '0.875rem',
    verticalAlign: 'middle',
    paddingRight: '5px',
    color: '#1C49C2',
  },
  icon: {
    paddingLeft: '0px',
    verticalAlign: 'bottom',
    color: '#1C49C2',
  },
}));

const EnactButton = () => {
  const classes = useStyles();
  const { openEnactmentLogin } = useEnactment();
  const { captureInteraction } = useAgentInteractions();
  const { data } = useCustomer();
  const { getLang } = useAthena();
  const isInactive = data?.status && data.status === 'INACTIVE';

  const onClick = useCallback(async () => {
    openEnactmentLogin();
    captureInteraction({
      type: 'SWITCH_TO_USER',
      action: 'UPDATE',
      currentVal: null,
      prevVal: null,
    });
  }, [openEnactmentLogin]);

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      variant="text"
      aria-label="Login as customer"
      disabled={isInactive}
    >
      {getLang('switchToCustomerText', { fallback: 'Switch to Customer' })}
    </Button>
  );
};

EnactButton.propTypes = {};

export default EnactButton;
