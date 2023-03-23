import useAthena from '@/hooks/useAthena';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.utils.fromPx(20)} 0px`,
    borderBottom: `1px solid #ddd`,
    marginBottom: theme.utils.fromPx(14),
  },
  heading: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
    fontWeight: '500',
  },
}));

const Header = () => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena();
  const { activityId } = router.query;

  const content = getLang('returnText', { fallback: 'Return: ' }) + getLang('orderId', { fallback: 'Order #' })+activityId;

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.heading}>
        {content}
      </Typography>
    </div>
  );
};

Header.propTypes = {};

export default Header;
