/* eslint-disable jsx-a11y/anchor-is-valid */
import useAthena from '@/hooks/useAthena';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '10px',
    backgroundColor: '#FFFFFF',
  },
  returnDetailsTitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '0.75rem',
    paddingLeft: '16px',
  },
  returnDetailsValueTitle: {
    fontFamily: 'Roboto',
    color: '#121212',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    paddingLeft: '16px',
  },
}));

const ReturnSubmitterDetails = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  return (
    <div data-testid="returnSubmitterContainer" className={classes.root}>
      <div className={classes.returnDetailsTitle}>
        {' '}
        {getLang('returnSubmitterName', { fallback: 'Submitter Name' })}
      </div>
      <span className={classes.returnDetailsValueTitle}>{returnData?.submitterName}</span>
      <div className={classes.returnDetailsTitle}>
        {' '}
        {getLang('returnSubmitterLogonID', { fallback: 'Submitter Logon ID' })}
      </div>
      <span className={classes.returnDetailsValueTitle}>{returnData?.submitterLogonId}</span>
    </div>
  );
};

ReturnSubmitterDetails.propTypes = {
  returnData: PropTypes.object,
};

export default ReturnSubmitterDetails;
