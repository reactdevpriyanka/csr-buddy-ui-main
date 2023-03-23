import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.utils.fromPx(-20), // ignore row gap
    gridColumn: `1 / -1`,
    backgroundColor: theme.palette.gray[50],
    borderBottom: `1px solid ${theme.palette.gray[150]}`,
    borderTop: `1px solid ${theme.palette.gray[150]}`,
    height: theme.utils.fromPx(160),
    padding: `${theme.utils.fromPx(20)}`,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    rowGap: theme.utils.fromPx(20),
  },
  emailInput: {
    backgroundColor: theme.palette.white,
    width: theme.utils.fromPx(250),
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    ...theme.utils.subLabel,
    fontStyle: 'normal',
  },
  helperText: {
    backgroundColor: theme.palette.gray[50],
    margin: '0 !important',
    paddingTop: theme.utils.fromPx(5),
  },
}));

const MultiItemGiftCardDetails = ({ item, returnType = '', initialEmail = '', onEmailUpdate }) => {
  const classes = useStyles();
  const [emailValid, setEmailValid] = useState(initialEmail?.length > 0);

  const { ScheduledDate, RecipientEmail, Message, SenderName } =
    item?.product?.personalizationAttributeMap || {};

  const showRecipientTextbox = returnType === 'REPLACEMENT';

  const onEmailChange = (event) => {
    const { target: email } = event;

    if (email.validity.valid) {
      setEmailValid(email.value?.length > 0);
      onEmailUpdate(email.value);
    } else {
      setEmailValid(false);
      onEmailUpdate(null);
    }
  };

  const debounceUpdateEmail = useCallback(debounce(onEmailChange, 200), []);

  return (
    <div className={classes.root}>
      {ScheduledDate && (
        <div className={classes.detail}>
          <div className={classes.detailLabel}>Scheduled Date:</div>
          <div>{ScheduledDate}</div>
        </div>
      )}
      {RecipientEmail && (
        <div className={classes.detail}>
          <div className={classes.detailLabel}>Recipient Email:</div>
          <div>{RecipientEmail}</div>
        </div>
      )}
      {Message && (
        <div className={classes.detail}>
          <div className={classes.detailLabel}>Message:</div>
          <div>{Message}</div>
        </div>
      )}
      {SenderName && (
        <div className={classes.detail}>
          <div className={classes.detailLabel}>Sender Name:</div>
          <div>{SenderName}</div>
        </div>
      )}
      <div>
        {showRecipientTextbox && (
          <TextField
            data-testid={`new-recipient-email:${item?.id}`}
            type="email"
            defaultValue={initialEmail}
            className={classes.emailInput}
            error={!emailValid}
            label="New recipient email"
            variant="outlined"
            onChange={debounceUpdateEmail}
            inputProps={{ maxLength: '160' }}
            helperText={!emailValid && 'Please enter a valid email'}
            FormHelperTextProps={{
              classes: {
                root: classes.helperText,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

MultiItemGiftCardDetails.propTypes = {
  item: PropTypes.object,
  returnType: PropTypes.string,
  initialEmail: PropTypes.string,
  onEmailUpdate: PropTypes.func,
};

export default MultiItemGiftCardDetails;
