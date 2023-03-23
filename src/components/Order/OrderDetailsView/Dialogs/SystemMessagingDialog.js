import BaseDialog from '@/components/Base/BaseDialog';
import { getDayDateYearTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  table: {
    ...theme.utils.simpleTable,
  },
  dialogSubstitle: {
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    fontWeight: 400,
    letterSpacing: '-0.03em',
    color: '#4D4D4D',
  },
  leftCellNoData: { borderRight: 'none !important' },
  rightCellNoData: { borderLeft: 'none !important' },
}));

const SystemMessagingDialog = ({ open, onClose, orderComments, orderNumber }) => {
  const classes = useStyles();

  const pageName = 'YYY Dialog - VT';

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      hideButtonPanel={true}
      fullWidth={true}
      fullHeight={true}
      pageName={pageName}
      maxWidth="lg"
      dialogTitle={
        <>
          <div>System Messages</div>
          {orderNumber && <div className={classes.dialogSubstitle}>Order #{orderNumber}</div>}
        </>
      }
    >
      <table className={classes.table} data-testid="system-messaging-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>System Message</th>
          </tr>
        </thead>
        <tbody>
          {orderComments?.map(({ id, text, timestamp }) => (
            <tr key={id}>
              <td>{getDayDateYearTimeTimezone(timestamp)}</td>
              <td>{text}</td>
            </tr>
          ))}
          {!orderComments && (
            <tr>
              <td className={classes.leftCellNoData}>No Data</td>
              <td className={classes.rightCellNoData} />
            </tr>
          )}
        </tbody>
      </table>
    </BaseDialog>
  );
};

SystemMessagingDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  orderComments: PropTypes.array,
  orderNumber: PropTypes.string,
};

export default SystemMessagingDialog;
