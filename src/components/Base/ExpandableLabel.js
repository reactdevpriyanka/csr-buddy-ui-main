import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToggleButton } from '@mui/material';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    paddingBottom: theme.utils.fromPx(24),
    cursor: 'pointer',
  },
  rightText: {
    float: 'right',
    display: 'inline-flex',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.utils.fromPx(18),
    fontWeight: 500,
    color: theme.palette.blue[800],
  },
  subTitle: {
    fontSize: theme.utils.fromPx(14),
    color: theme.palette.gray.light,
  },
  button: {
    margin: `${theme.utils.fromPx(0)} 0 0 ${theme.utils.fromPx(16)} !important`,
    maxHeight: 21,
    maxWidth: 21,
    color: `${theme.palette.blue[800]} !important`,
    '&:hover': {
      backgroundColor: '#DBEBF9 !important',
    },
  },
}));

const testId = 'gwf-node:expandablelabel';

const ExpandableLabel = ({ label, subLabel, choices, onChoose = () => null }) => {
  const classes = useStyles();
  const hiddenOutcomeId = choices?.find((choice) => choice.value === 'hidden')?.outcomeId;
  const expandedOutcomeId = choices?.find((choice) => choice.value === 'expanded')?.outcomeId;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    onChoose(hiddenOutcomeId);
  }, []);

  const onToggle = () => {
    onChoose(expanded ? hiddenOutcomeId : expandedOutcomeId);
    setExpanded(!expanded);
  };

  return (
    <div onClick={onToggle} onKeyDown={onToggle} className={classes.root} data-testid={testId}>
      <span className={classes.title} data-testid={`${testId}:title`}>
        {label}
      </span>
      <span className={classes.rightText}>
        <span className={classes.subTitle} data-testid={`${testId}:subTitle`}>
          {subLabel}
        </span>
        <ToggleButton
          className={classes.button}
          value="check"
          selected={expanded}
          data-testid={`${testId}:toggle`}
        >
          {expanded ? (
            <RemoveIcon data-testid={`${testId}:expand-button`} />
          ) : (
            <AddIcon data-testid={`${testId}:hide-button`} />
          )}
        </ToggleButton>
      </span>
    </div>
  );
};

ExpandableLabel.propTypes = {
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.string.isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      outcomeId: PropTypes.string,
    }),
  ),
  onChoose: PropTypes.func,
};

export default ExpandableLabel;
