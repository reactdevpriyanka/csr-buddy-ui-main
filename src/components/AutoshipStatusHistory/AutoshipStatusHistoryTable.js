import PropTypes from 'prop-types';
import { getDayDateTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core';
import { capitalize } from '@/utils/string';

const useStyles = makeStyles((theme) => ({
  eventTable: {
    ...theme.utils.simpleTable,
  },
}));

const AutoshipStatusHistoryTable = ({ statuses = [] }) => {
  const classes = useStyles();

  return (
    <table className={classes.eventTable} data-testid="autoship-status-history-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Timestamp</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        {statuses.map(({ status, time_updated, comment }) => (
          <tr key={time_updated}>
            <td>
              <span>{capitalize(status)}</span>
            </td>
            <td>{getDayDateTimeTimezone(time_updated)}</td>
            <td>{comment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

AutoshipStatusHistoryTable.propTypes = {
  statuses: PropTypes.shape({
    status: PropTypes.string,
    time_updated: PropTypes.string,
    comment: PropTypes.string,
  }),
};

export default AutoshipStatusHistoryTable;
