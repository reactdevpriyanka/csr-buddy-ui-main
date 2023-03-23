import { NotFoundLayout } from '@components/Layout';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function NotFoundPage() {
  const classes = useStyles();

  return <div className={classes.root}>Not found</div>;
}

NotFoundPage.getLayout = () => NotFoundLayout;
