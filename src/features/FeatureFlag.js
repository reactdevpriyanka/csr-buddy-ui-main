import useAthena from '@/hooks/useAthena';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import useFeature from './useFeature';

const useStyles = makeStyles((theme) => ({
  defaultMsgLayout: {
    width: '100%',
    textAlign: 'center',
    marginTop: '10px',
  },
  defaultMsg: {
    ...theme.fonts.h1,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    paddingLeft: `${theme.utils.fromPx(28)}`,
  },
}));
export default function FeatureFlag({
  flag,
  children,
  fallback = null,
  showDefaultBackup = false,
}) {
  const flagValue = useFeature(flag);
  const { getLang } = useAthena();
  const classes = useStyles();

  if (flagValue) {
    return children;
  }

  if (showDefaultBackup) {
    return (
      <div className={classes.defaultMsgLayout}>
        <span className={classes.defaultMsg}>
          {getLang('featureFlagAccessDenialMsg', {
            fallback: "Sorry, you don't have access this feature",
          })}
        </span>
      </div>
    );
  }
  return fallback;
}

FeatureFlag.propTypes = {
  flag: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  showDefaultBackup: PropTypes.bool,
};
