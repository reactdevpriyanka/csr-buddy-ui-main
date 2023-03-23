import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState, useCallback } from 'react';
import useReturnReasons from '@/hooks/useReturnReasons';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { getReasonOptions } from '@/utils/returnReasons';
import cn from 'classnames';
import { capitalize } from '@/utils/string';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minWidth: theme.utils.fromPx(240),
    display: 'flex',
    flexDirection: 'column',
    '&.horizontal': {
      width: theme.utils.fromPx(560),
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      columnGap: theme.utils.fromPx(10),
      rowGap: theme.utils.fromPx(10),
    },
  },
  inputLabel: {
    fontSize: `${theme.fonts.size.sm} !important`,
  },
  select: {
    marginBottom: `${theme.utils.fromPx(10)} !important`,
  },
}));

const formatOption = (str) => capitalize(str?.replace(/_/g, ' '));

const ReturnReason = ({
  itemId,
  allItemsSelected,
  orientation,
  disabled,
  onReturnReasonUpdate = () => {},
  onCommentUpdate = () => {},
  error,
  limitToUnauthorized,
  initialState,
  initialComment,
  isInSelectAllRow = false,
  clearReturnReason,
}) => {
  const classes = useStyles();
  const [returnReasonState, setReturnReasonState] = useState(initialState || {});

  /* For gift card returns we only want to show the
  Unauthorized Purchase option */
  const returnReasonOpts = {};
  if (limitToUnauthorized) {
    returnReasonOpts.pickOnly = 'UNAUTHORIZED_PURCHASE';
  }

  const ALL_REASONS = useReturnReasons(returnReasonOpts);
  const primaryOptions = getReasonOptions(ALL_REASONS);
  const secondaryOptions = getReasonOptions(ALL_REASONS, returnReasonState, 'secondary');
  const tertiaryOptions = getReasonOptions(ALL_REASONS, returnReasonState, 'tertiary');

  const returnReasonComplete =
    returnReasonState.tertiary ||
    (returnReasonState.secondary && tertiaryOptions.length === 0) ||
    (returnReasonState.primary && secondaryOptions.length === 0);

  const updateReturnReason = (e, level) => {
    const val = e.target.value === 'None' ? null : e.target.value;
    if (level === 'primary') {
      setReturnReasonState({ primary: val });
    } else if (level === 'secondary') {
      setReturnReasonState(({ primary }) => ({ primary, secondary: val }));
    } else {
      setReturnReasonState(({ primary, secondary }) => ({ primary, secondary, tertiary: val }));
    }
  };

  const debounceUpdateComment = useCallback(debounce(onCommentUpdate, 500), [returnReasonState]);

  const resetFields = () => {
    onReturnReasonUpdate({ returnReason: null, returnReasonComplete: false });
    onCommentUpdate('');
    setReturnReasonState({});
  };

  /* If returnQuantity is reduced to zero, clear the return reason state */
  useEffect(() => {
    if (clearReturnReason) {
      resetFields();
    }
  }, [clearReturnReason]);

  /* We want to reset when the Select All button is clicked */
  useEffect(() => {
    /* Select All row - clear when Select All is false */
    if (isInSelectAllRow && !allItemsSelected) {
      resetFields();
    }

    /* Regular item rows - clear when Select All is true */
    if (!isInSelectAllRow && allItemsSelected) {
      resetFields();
    }
  }, [allItemsSelected]);

  useEffect(() => {
    if (!ALL_REASONS) return;
    if (Object.keys(returnReasonState).length > 0) {
      onReturnReasonUpdate({ returnReason: returnReasonState, returnReasonComplete });
    }
  }, [returnReasonState]);

  const showSecondaryReason = secondaryOptions?.length > 0;
  const showTertiaryReason = tertiaryOptions?.length > 0;

  return (
    <div
      data-testid="return-reason"
      className={cn(classes.root, { horizontal: orientation === 'horizontal' })}
    >
      <FormControl
        className={classes.select}
        variant="outlined"
        fullWidth
        disabled={disabled}
        error={error && !showSecondaryReason}
      >
        <InputLabel id="multi-item-select-primary-label">Return Reason</InputLabel>
        <Select
          label={`return-reasons:primary:${!isInSelectAllRow ? itemId : 'select-all'}`}
          data-testid={`return-reasons:primary:${!isInSelectAllRow ? itemId : 'select-all'}`}
          aria-labelledby={`return-reasons:primary:${!isInSelectAllRow ? itemId : 'select-all'}`}
          id="multi-item-select-primary"
          labelId="multi-item-select-primary-label"
          value={returnReasonState.primary || ''}
          onChange={(e) => updateReturnReason(e, 'primary')}
        >
          <MenuItem value="None" data-dd-action-name="None">
            None
          </MenuItem>
          {primaryOptions.map((option) => (
            <MenuItem
              data-testid={`return-reason:${option}`}
              value={option}
              key={`${option}`}
              data-dd-action-name={formatOption(option)}
            >
              {formatOption(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showSecondaryReason && (
        <FormControl
          className={classes.select}
          variant="outlined"
          fullWidth
          disabled={disabled}
          error={error && !showTertiaryReason}
        >
          <InputLabel id="multi-item-select-secondary-label">Return Reason</InputLabel>
          <Select
            id={`return-reasons:secondary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            label={`return-reasons:secondary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            data-testid={`return-reasons:secondary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            aria-labelledby={`return-reasons:secondary:${
              !isInSelectAllRow ? itemId : 'select-all'
            }`}
            value={returnReasonState.secondary || ''}
            onChange={(e) => updateReturnReason(e, 'secondary')}
            data-dd-action-name={returnReasonState.secondary || 'Return Reason'}
          >
            <MenuItem value="None" data-dd-action-name="None">
              None
            </MenuItem>
            {secondaryOptions.map((option) => (
              <MenuItem
                data-testid={`return-reason:${option}`}
                value={option}
                key={`${option}`}
                data-dd-action-name={formatOption(option)}
              >
                {formatOption(option)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {showTertiaryReason && (
        <FormControl
          className={classes.select}
          variant="outlined"
          fullWidth
          disabled={disabled}
          error={error}
        >
          <InputLabel id="multi-item-select-tertiary-label">Return Reason</InputLabel>
          <Select
            label={`return-reasons:tertiary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            data-testid={`return-reasons:tertiary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            aria-labelledby={`return-reasons:tertiary:${!isInSelectAllRow ? itemId : 'select-all'}`}
            id="multi-item-select-tertiary-label"
            labelId="multi-item-select-tertiary-label"
            value={returnReasonState.tertiary || ''}
            onChange={(e) => updateReturnReason(e, 'tertiary')}
          >
            <MenuItem value="None" data-dd-action-name="None">
              None
            </MenuItem>
            {tertiaryOptions.map((option) => (
              <MenuItem
                data-testid={`return-reason:${option}`}
                value={option}
                key={`${option}`}
                data-dd-action-name={formatOption(option)}
              >
                {formatOption(option)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {returnReasonComplete && (
        <TextField
          data-testid={`return-reason:additional-comments${
            !isInSelectAllRow ? itemId : 'select-all'
          }`}
          defaultValue={initialComment}
          disabled={disabled}
          label="Additional Comments (optional)"
          multiline
          rows={4}
          variant="outlined"
          inputProps={{ maxLength: '160' }}
          onChange={(e) => debounceUpdateComment(e.target.value)}
          InputLabelProps={{
            classes: {
              root: classes.inputLabel,
            },
          }}
        />
      )}
    </div>
  );
};

ReturnReason.propTypes = {
  itemId: PropTypes.string,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  onReturnReasonUpdate: PropTypes.func,
  onCommentUpdate: PropTypes.func,
  error: PropTypes.bool,
  allItemsSelected: PropTypes.bool,
  limitToUnauthorized: PropTypes.bool,
  initialState: PropTypes.object,
  initialComment: PropTypes.string,
  isInSelectAllRow: PropTypes.bool,
  clearReturnReason: PropTypes.bool,
};

export default ReturnReason;
