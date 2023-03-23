import PropTypes from 'prop-types';
import { snakeCaseToTitleCase } from '@/utils/string';
import { getDayDateTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core';
import { convertOrderStatus } from '@/constants/OrderStatus';

const useStyles = makeStyles((theme) => ({
  eventTable: {
    ...theme.utils.simpleTable,
  },
}));

const EventHistoryTable = ({ events = [] }) => {
  const classes = useStyles();

  const formatStatus = (status) => {
    if (!status) return;

    const convertedStatus = convertOrderStatus(status);

    if (convertedStatus.includes('-')) {
      const [statusLetter, statusText] = convertedStatus.split('-');

      return (
        <span>
          <b>{statusLetter}</b>
          <span> - {statusText}</span>
        </span>
      );
    } else return status;
  };

  return (
    <table className={classes.eventTable} data-testid="events-history-table">
      <thead>
        <tr>
          <th>Status History</th>
          <th>Event</th>
          <th>Date / Time</th>
        </tr>
      </thead>
      <tbody>
        {events.map(({ status, event, timeEmitted }) => (
          <tr key={timeEmitted}>
            <td>{formatStatus(status)}</td>
            <td>{snakeCaseToTitleCase(event)}</td>
            <td>{getDayDateTimeTimezone(timeEmitted)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

EventHistoryTable.propTypes = {
  events: PropTypes.shape({
    status: PropTypes.string,
    event: PropTypes.string,
    timeEmitted: PropTypes.string,
  }),
};

export default EventHistoryTable;
