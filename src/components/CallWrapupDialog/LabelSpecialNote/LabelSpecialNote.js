import InfoIcon from '@material-ui/icons/InfoOutlined';
import TooltipPrimary from '@components/TooltipPrimary';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  text: {
    marginRight: '2px',
  },
  popoverContent: {
    fontSize: '14px',
  },
}));

const LabelSpecialNote = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="labelspecialnote-root">
      <span data-testid="labelspecialnote-text" className={classes.text}>
        Special Note
      </span>
      <TooltipPrimary
        data-testid="labelspecialnote-tooltip"
        className={classes.popoverContent}
        title="Note: Comments are only required for Escalations/Dispositions, OOS items/product complaints, Chewy complaints. For remaining use cases comments are Optional."
      >
        <InfoIcon fontSize="small" data-testid="labelspecialnote-icon" />
      </TooltipPrimary>
    </div>
  );
};

LabelSpecialNote.propTypes = {};

export default LabelSpecialNote;
