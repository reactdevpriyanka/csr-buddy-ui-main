import { Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const ResponsiveDebug = withStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: '1000',
    top: theme.spacing(1),
    left: '50vw',
    textAlign: 'center',
    color: theme.palette.white,
    '& > *': {
      width: '100%',
      height: '100%',
      padding: theme.spacing(0.25),
    },
  },
  sm: {
    display: 'block',
    backgroundColor: theme.palette.red[800],
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  md: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      backgroundColor: theme.palette.blue[600],
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  lg: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
      backgroundColor: theme.palette.green.medium,
    },
  },
}))(({ classes }) => {
  const { width } = useWindowDimensions();

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography className={classes.sm}>
        sm-down
        <br />
        {width}px
      </Typography>
      <Typography className={classes.md}>
        md
        <br />
        {width}px
      </Typography>
      <Typography className={classes.lg}>
        lg-up
        <br />
        {width}px
      </Typography>
    </Paper>
  );
});

export default ResponsiveDebug;
