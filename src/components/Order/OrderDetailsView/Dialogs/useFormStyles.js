import makeStyles from '@material-ui/core/styles/makeStyles';

/*
 * Shared styles for action dialogs that implement ConfirmationDialog, intended
 * for use with OrderDetailsView.
 *
 * See https://www.figma.com/file/y3Xyap6kqFgkHYCtI9EN0m/Dev-Ready?node-id=6332%3A35914
 */

const useFormStyles = makeStyles((theme) => ({
  textField: {
    '& fieldset': {
      borderColor: theme.palette.gray[500],
    },
  },
  checkboxLabel: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderColor: theme.palette.gray[500],
    '&:last-child': {
      marginBottom: '-20px',
    },
  },
}));

export default useFormStyles;
