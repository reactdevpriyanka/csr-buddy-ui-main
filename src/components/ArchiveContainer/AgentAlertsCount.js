import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  count: {
    display: 'inline-block',
    lineHeight: '15px',
    fontSize: '13px',
    fontWeight: 700,
    padding: '2px 6px 3px 6px',
    color: '#000000',
    backgroundColor: theme.palette.yellow[400],
    borderRadius: '4px',
  },
  title: {
    paddingLeft: '7.5px',
  },
}));

export default function AgentAlertsCount({ count }) {
  const classes = useStyles();
  const { getLang } = useAthena();
  return (
    <>
      {count > 0 && <div className={classes.count}>{count}</div>}
      <span className={classes.title}>
        {getLang('agentAlertsLabelText', { fallback: 'Agent Alerts' })}
      </span>
    </>
  );
}

AgentAlertsCount.propTypes = {
  count: PropTypes.number,
};
