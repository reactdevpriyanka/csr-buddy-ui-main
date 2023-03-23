import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import InfoIcon from '@/components/Icons/info.outline-circle.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: `0 0 ${theme.spacing(0.2)} ${theme.spacing(0.2)}`,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: theme.palette.gray[300],
    padding: `${theme.spacing(0.4)} ${theme.spacing(0.8)}`,
    marginBottom: theme.spacing(0.4),
    width: 'fit-content',
  },
  icon: {
    marginRight: theme.spacing(0.2),
    '& path': {
      fill: theme.palette.primary.main,
    },
  },
}));

export default function EnvironmentIcon() {
  const classes = useStyles();
  const { getLang } = useAthena();

  const content = getLang('lang.environment');

  if (!content) {
    return null;
  }

  return (
    <aside data-testid="env-icon" className={classes.root}>
      <InfoIcon className={classes.icon} />
      <span>{content}</span>
    </aside>
  );
}
