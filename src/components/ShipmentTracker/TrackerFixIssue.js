import PackageFixIssueIcon from '@icons/fix-issue-package.svg';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  figure: {
    textAlign: 'center',
    '& > svg': {
      display: 'inline-block',
    },
  },
  heading: {
    ...theme.fonts.h2,
    fontWeight: '500',
    fontSize: theme.utils.fromPx(24),
  },
  text: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(24),
    '& > strong': {
      fontWeight: '700',
    },
  },
}));

const TrackerFixIssue = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <figure className={classes.figure}>
        <PackageFixIssueIcon />
      </figure>
      <h2 className={classes.heading}>{'Need to fix an issue?'}</h2>
      <p className={classes.text}>
        To fix a shipment or tracking issue use the center pane to make the appropriate selection.
        Click <strong>Continue</strong> for next steps
      </p>
      <p className={classes.text}>
        Tip: To cancel click <strong>Exit</strong> to close.
      </p>
    </div>
  );
};

export default TrackerFixIssue;
