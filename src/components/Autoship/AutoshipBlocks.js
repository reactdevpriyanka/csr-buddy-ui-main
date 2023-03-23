import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions } from '@material-ui/core';
import WarningOutlineIcon from '@mui/icons-material/WarningAmberOutlined';
import { getDayDateYearTimeTimezone } from '@/utils';
import { snakeCaseToTitleCase } from '@/utils/string';
import { useState } from 'react';
import FeatureFlag from '@/features/FeatureFlag';
import BlockHistoryDialog from './BlockHistoryDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '30px',
    marginBottom: '30px',
    width: '100%',
    '& .MuiLink-root': {
      fontFamily: 'Roboto',
      fontWeight: '700',
      fontSize: '14px',
      lineHeight: '18px',
      color: '#121212',
      cursor: 'pointer',
    },
  },
  cardWarning: {
    color: '#000000',
    background: '#FFC80C',
    padding: '16px',
    borderRadius: '4px',
  },
  messageHeader: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(16),
    lineHeight: 1.5,
    color: '#000000',
  },
  typography: {
    display: 'inline',
  },
  actionRoot: {
    padding: '0px 8px',
    justifyContent: 'space-between',
  },
  messageContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  link: {
    marginLeft: 'auto',
  },
  buttonLink: {
    textTransform: 'none',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  buttonLinkWarning: {
    color: theme.palette.black,
  },
  messageTxt: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(16),
    lineHeight: 1.5,
    listStyleType: 'disc',
    color: '#000000',
  },
  linkLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#000000',
  },
  subtitleList: {
    margin: '8px 0px 0px 16px',
  },
  content: {
    backgroundColor: '#00000033',
  },
  chewyCard: {
    outline: '#1C49C2 1px solid',
    marginTop: `22px`,
    position: 'relative',
    border: '2px solid #1C49C2',
    transition: 'all 0.2s',
    backgroundColor: '#DDF0FF80',
    boxShadow: '0px 0px 4px 2px rgb(28, 73, 194, 0.6)',
  },
  blockLink: {
    pointerEvents: 'all',
  },
}));

const AutoshipBlocks = ({ blocks = [], id }) => {
  const classes = useStyles();

  const [blockOrderHistoryDialogOpen, setBlockOrderHistoryDialogOpen] = useState(false);

  return (
    <div data-testid="autoshipBlocksContainer" className={classes.root}>
      <Card data-testid="autoshipBlocksCard" className={classes.cardWarning}>
        <div />
        <CardActions classes={{ root: classes.actionRoot }}>
          <WarningOutlineIcon fontSize="small" />
          <div className={classes.messageContent}>
            <span className={classes.messageHeader}>BLOCKS</span>{' '}
            <FeatureFlag flag="feature.explorer.autoshipOrderBlockViewEnabled">
              <div>
                <Link
                  className={classes.blockLink}
                  data-testid="order:viewblock:link"
                  disableRipple
                  aria-label="ViewBlockLink"
                  underline="hover"
                  onClick={() => {
                    setBlockOrderHistoryDialogOpen(true);
                  }}
                >
                  {`View Blocks`}
                </Link>
              </div>
            </FeatureFlag>
          </div>
        </CardActions>
        {Array.isArray(blocks) && (
          <CardActions classes={{ root: classes.actionRoot }}>
            <ul className={classes.subtitleList}>
              {blocks.map(
                (block) =>
                  block?.resolved === false && (
                    <li key={block.id} className={classes.messageTxt}>
                      {[
                        `${snakeCaseToTitleCase(block?.reason)}`,
                        `${getDayDateYearTimeTimezone(block.timeBlocked)}`,
                      ]
                        .filter((v) => v)
                        .join(' - ')}
                    </li>
                  ),
              )}
            </ul>
          </CardActions>
        )}
      </Card>
      {blockOrderHistoryDialogOpen && (
        <BlockHistoryDialog
          blockOrderHistoryDialogOpen={blockOrderHistoryDialogOpen}
          blocks={blocks}
          id={id}
          setParentClose={() => setBlockOrderHistoryDialogOpen(false)}
        />
      )}
    </div>
  );
};

AutoshipBlocks.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      comments: PropTypes.string,
      id: PropTypes.string,
      reason: PropTypes.string,
      resolved: PropTypes.bool,
      timeBlocked: PropTypes.string,
    }),
  ),
  id: PropTypes.string.isRequired,
};

export default AutoshipBlocks;
