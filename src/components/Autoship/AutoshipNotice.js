import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@components/Button';
import { ActivityHeader, Card, SplitContent } from '@components/Card';
import { formatDate } from '@utils/dates';

const useStyles = makeStyles((theme) => ({
  root: {},
  ul: {
    padding: '0',
    listStyle: 'none',
    '& > li:before': {
      background: '#111',
      borderRadius: '100%',
      content: '""',
      display: 'inline-block',
      marginRight: theme.utils.fromPx(4),
      width: theme.utils.fromPx(4),
      height: theme.utils.fromPx(4),
      verticalAlign: 'middle',
    },
  },
}));

const AutoshipNotice = ({ id, items, name, action, updatedAt }) => {
  const classes = useStyles();

  const header = (
    <ActivityHeader
      title={`"${name}" Autoship Updated`}
      subtitle={`Updated on ${formatDate(updatedAt)}`}
      action={<a href={action}>{'Autoship Details'}</a>}
    />
  );

  return (
    <Card header={header}>
      <SplitContent
        content={
          <div>
            <ul className={classes.ul}>
              {items.map(({ id, strong, weak }) => (
                <li key={id}>
                  <strong>{strong}</strong>&nbsp;
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        }
        actions={<Button full>{'Autoship Details'}</Button>}
      />
    </Card>
  );
};

AutoshipNotice.propTypes = {
  id: PropTypes.number,
  items: PropTypes.array,
  name: PropTypes.string,
  updatedAt: PropTypes.string,
  action: PropTypes.string,
};

export default AutoshipNotice;
