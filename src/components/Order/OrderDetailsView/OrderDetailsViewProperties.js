import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '15px',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'bold',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#666666',
  },
  attributesPanel: {
    display: 'grid',
    gridAutoFlow: 'column',
    marginTop: '10px',
  },
  panel: {
    display: 'grid',
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',
  },
}));

const OrderDetailsViewProperties = ({
  submitter = '',
  channel = '',
  remoteIp = '',
  comment = '',
  submitterDetail = {},
}) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsViewPropertiesContainer" className={classes.root}>
      <span className={classes.title}>
        {getLang('orderProperties', { fallback: 'Order Properties' })}
      </span>

      <div className={classes.attributesPanel}>
        <div className={classes.panel}>
          <span className={classes.label}>
            {getLang('orderSubmitter', { fallback: 'Submitter' })}
          </span>
          <span data-testid="orderSubmitter" className={classes.text}>
            {submitterDetail.fullName}
          </span>
        </div>

        <div className={classes.panel}>
          <span className={classes.label}>{getLang('orderChannel', { fallback: 'Channel' })}</span>
          <span data-testid="orderChannel" className={classes.text}>
            {channel}
          </span>
        </div>

        <div className={classes.panel}>
          <span className={classes.label}>
            {getLang('orderRemoteIP', { fallback: 'Remote IP' })}
          </span>
          <span data-testid="orderRemoteIp" className={classes.text}>
            {remoteIp}
          </span>
        </div>

        <div className={classes.panel}>
          <span className={classes.label}>{getLang('orderComment', { fallback: 'Comment' })}</span>
          <span data-testid="orderComment" className={classes.text}>
            {comment}
          </span>
        </div>
      </div>
    </div>
  );
};

OrderDetailsViewProperties.propTypes = {
  submitter: PropTypes.string,
  channel: PropTypes.string,
  remoteIp: PropTypes.string,
  comment: PropTypes.string,
  submitterDetail: PropTypes.object,
};

export default OrderDetailsViewProperties;
