import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.gray['50'],
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(120)} 1fr ${theme.utils.fromPx(150)}`,
    borderBottom: `1px solid ${theme.palette.gray['150']}`,
    color: theme.palette.primary.main,
    padding: `0 ${theme.utils.fromPx(10)}`,
    ...theme.fonts.body.medium,
    '&>div': {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
  },
  checkboxLabel: {
    ...theme.fonts.body.medium,
  },
}));

const ConcessionHeaderRow = ({ onSelectAllChange, allSelected }) => {
  const classes = useStyles();
  const { getLang } = useAthena();

  return (
    <div className={classes.root}>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={(e) => onSelectAllChange(e.target.checked)}
              checked={allSelected}
            />
          }
          label={<span className={classes.checkboxLabel}>Select all</span>}
        />
      </div>
      <div>{getLang('concessionHeaderProductLabel', { fallback: 'Product' })}</div>
      <div>{getLang('concessionHeaderRemainingAmtLabel', { fallback: 'Remaining amt' })}</div>
    </div>
  );
};

ConcessionHeaderRow.propTypes = {
  onSelectAllChange: PropTypes.func,
  allSelected: PropTypes.bool,
};

export default ConcessionHeaderRow;
