import AutoshipColor from '@icons/autoship-color.svg';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  autoshipContainerIcon: {
    alignSelf: 'center',
  },
  autoshipContainer: {
    display: 'inline-flex',
    paddingLeft: '5px',
    // backgroundColor: '#f5f5f5',
    borderLeftColor: '#EF6C00',
    borderLeftStyle: 'solid',
    borderLeftWidth: '5px',
  },
  autoshipLabelIconLg: {
    width: '40px',
    height: '40px',
  },
}));

const AutoShipCardHeader = () => {
  const classes = useStyles();
  return (
    <div className={classes.autoshipContainer}>
      <span className={classes.autoshipContainerIcon} data-testid="card:activity-header2">
        <AutoshipColor className={classes.autoshipLabelIconLg} />
      </span>
    </div>
  );
};

export default AutoShipCardHeader;
