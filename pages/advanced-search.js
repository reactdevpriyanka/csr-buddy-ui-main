import AdvancedSearchView from '@/components/AdvancedSearchView/AdvancedSearchView';
import SingleTabLayout from '@/components/Layout/SingleTabLayout';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh !important',
    paddingTop: theme.utils.fromPx(16),
  },
}));

export default function AdvancedSearch() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" sx={{ paddingLeft: '8px', paddingBottom: '4px' }}>
        Advanced Search{' '}
      </Typography>
      <AdvancedSearchView />
    </div>
  );
}

AdvancedSearch.getLayout = () => SingleTabLayout;
