import SingleTabLayout from '@/components/Layout/SingleTabLayout';
import { makeStyles } from '@material-ui/core';
import { useFeature } from '@/features';
import useAthena from '@/hooks/useAthena';
const useStyles = makeStyles((theme) => ({
  root: {},
  iframeContainer: {
    position: 'fixed',
    width: '100%',
    height: '100%',
  },
  iframe: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 'none',
  },
  standAloneDisabledMsg: {
    fontSize: theme.typography.pxToRem(48),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    color: theme.palette.blue[800],
  },
  standAloneDisabledMsgcontainer: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

export default function StandalonePage() {
  const classes = useStyles();
  const allowAccessCsrbStandalone = useFeature('feature.explorer.accessCsrbStandaloneEnabled');
  const { getLang } = useAthena();
  const standaloneCsrbURL = getLang('standaloneCsrbURL', {
    fallback: 'https://cs-platform.csbb.prd.chewy.com',
  });

  return (
    <div id="standalone_csrb1.0">
      {!allowAccessCsrbStandalone ? (
        <div className={classes.standAloneDisabledMsgcontainer}>
          <span className={classes.standAloneDisabledMsg}>Standalone Mode Is Not Enabled</span>
        </div>
      ) : (
        <div className={classes.iframeContainer}>
          <h3>Standalone CSRB1.0</h3>
          <iframe
            className={classes.iframe}
            id="standalone_csrb1.0-iframe"
            title="Standalone CSRB1.0"
            width="100%"
            height="100%"
            src={standaloneCsrbURL}
          />
        </div>
      )}
    </div>
  );
}

StandalonePage.getLayout = () => SingleTabLayout;
