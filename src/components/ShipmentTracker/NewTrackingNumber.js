import { makeStyles } from '@material-ui/core/styles';
import edd from './shapes/edd';

const useStyles = makeStyles((theme) => ({
  root: {},
  shipper: {
    gridArea: 'shipper',
    alignContent: 'end',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
  },
  space: {
    fontWeight: '700',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    color: '#1C49C2',
  },
  marginTrk: {
    marginTop: theme.utils.fromPx(25),
  },
  hr: {
    flexGrow: '0',
    border: '1px solid #CCCCCC',
  },
}));

const NewTrackingNumber = ({ trackingNumber = '', fedExLink = '', shippingModeCode = '' }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.marginTrk}>
        <div className={classes.shipper}>
          <hr className={classes.hr} />
          {shippingModeCode}
          <span>{`  (TRK# `}</span>
          {fedExLink && (
            <a
              href={fedExLink}
              className={classes.space}
              data-testid={`trackingNumber:${trackingNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              {`${trackingNumber}`}
            </a>
          )}
          <span>{`)`}</span>
        </div>
      </div>
    </div>
  );
};

NewTrackingNumber.propTypes = edd;

export default NewTrackingNumber;
