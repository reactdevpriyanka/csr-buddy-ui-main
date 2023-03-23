import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles((theme) => ({
  unorderedList: {
    marginTop: theme.utils.fromPx(10),
    marginBottom: theme.utils.fromPx(10),
    width: (isSummary) => (isSummary ? theme.utils.fromPx(500) : 'auto'),
    paddingLeft: theme.utils.fromPx(24),
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
    },
  },
  indentedUl: {
    marginLeft: theme.utils.fromPx(-20),
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
    },
  },
  itemAction: {
    color: '#666666',
    fontSize: theme.utils.fromPx(14),
    fontWeight: 700,
    lineHeight: theme.utils.fromPx(18),
  },
  itemActionDescription: {
    paddingLeft: theme.utils.fromPx(5),
    color: '#666666',
    fontWeight: 400,
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    wordBreak: 'break-word',
  },
}));
const InteractionAppeasementDetail = ({ id, data, isSummary }) => {
  const classes = useStyles(isSummary);

  if (!data || data.length === 0) {
    return <div />;
  }

  return (
    <ul className={classes.unorderedList}>
      {data &&
        data.map((value, idx) => {
          return value?.indent ? (
            <ul className={classes.indentedUl}>
              <li key={`${id}-${idx}`}>
                <div className={classes.itemAction}>
                  <span data-testid={`${id}-${idx}-label`}>{value?.label}</span>
                  <span
                    data-testid={`${id}-${idx}-value`}
                    className={classnames(classes.itemActionDescription)}
                  >
                    {value?.value}
                    {value.indent}
                  </span>
                </div>
              </li>
            </ul>
          ) : (
            <li key={`${id}-${idx}`}>
              <div className={classes.itemAction}>
                <span data-testid={`${id}-${idx}-label`}>{value?.label}</span>
                <span
                  data-testid={`${id}-${idx}-value`}
                  className={classnames(classes.itemActionDescription)}
                >
                  {value?.value}
                  {value.indent}
                </span>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

InteractionAppeasementDetail.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      indent: PropTypes.bool,
    }),
  ),
  isSummary: PropTypes.bool,
};

export default InteractionAppeasementDetail;
