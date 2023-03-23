import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.utils.fromPx(-20), // ignore row gap for detail rows
    gridColumn: `1 / -1`,
    backgroundColor: theme.palette.gray[50],
    borderBottom: `1px solid ${theme.palette.gray[150]}`,
    borderTop: `1px solid ${theme.palette.gray[150]}`,
    height: theme.utils.fromPx(60),
    padding: `0 ${theme.utils.fromPx(77)}`,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.utils.fromPx(40),
  },
  detailLabel: {
    ...theme.utils.subLabel,
    fontStyle: 'normal',
  },
}));

const ConcessionDetailRow = ({ details }) => {
  const classes = useStyles();
  if (!details || details.length === 0) return null;
  return (
    <div className={classes.root}>
      {details.map((detail) => (
        <div className={classes.detail} key={detail.label}>
          <div className={classes.detailLabel}>{detail.label}</div>
          <div>{detail.value}</div>
        </div>
      ))}
    </div>
  );
};

ConcessionDetailRow.propTypes = {
  details: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

export default ConcessionDetailRow;
