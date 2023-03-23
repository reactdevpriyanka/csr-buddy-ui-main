import { useEffect } from 'react';
import { FormControlLabel, Checkbox as MUICheckbox } from '@mui/material';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';
import { addSessionStorageItem, getSessionStorage } from '@/utils/sessionStorage';
import cn from 'classnames';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  checkBox: {
    ...theme.utils.checkBox,
  },
  checkBoxOpen: {
    padding: `${theme.utils.fromPx(4)} 0`,
  },
  disabled: {
    ...theme.utils.disabled,
  },
  toggleLabel: {
    opacity: `1 !important`,
    color: `black !important`,
  },
}));

const NodeToggleCheck = ({ toggleLabel, checked, name, onChange, id, disabled = false }) => {
  const classes = useStyles();
  const router = useRouter();
  const { activityId } = router.query;

  const toggleStorageKey = `ToggleableNodes-${activityId}`;

  useEffect(() => {
    const sessionStorage = getSessionStorage('gwf:history') || {};
    const toggleableNodesStorage = sessionStorage[toggleStorageKey];
    if (toggleableNodesStorage?.[id]) {
      onChange(true);
    }
  }, []);

  const updateToggled = (checked) => {
    onChange(checked);
    const sessionStorage = getSessionStorage('gwf:history') || {};
    const toggleableNodesStorage = sessionStorage[toggleStorageKey];
    addSessionStorageItem('gwf:history', {
      [toggleStorageKey]: { ...toggleableNodesStorage, [id]: checked },
    });
  };

  return (
    <div>
      <FormControlLabel
        label={<span className={classes.toggleLabel}>{toggleLabel}</span>}
        className={cn(classes.checkBox, checked ? classes.checkBoxOpen : null)}
        control={
          <MUICheckbox
            onChange={() => updateToggled(!checked)}
            checked={checked}
            value={checked}
            name={name}
            disabled={disabled}
            className={disabled ? classes.disabled : ''}
          />
        }
      />
    </div>
  );
};

NodeToggleCheck.propTypes = {
  toggleLabel: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default NodeToggleCheck;
