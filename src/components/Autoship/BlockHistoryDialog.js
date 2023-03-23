import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { snakeCaseToTitleCase } from '@/utils/string';
import cn from 'classnames';
import { BaseDialog } from '@components/Base';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { getDayDateYearTimeTimezone } from '@/utils';
import FeatureFlag from '@/features/FeatureFlag';
import Link from '@mui/material/Link';
import ResolveAutoshipBlockDialog from './ResolveAutoshipBlockDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-root': {
      height: '0px !important',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: `${theme.utils.fromPx(713)}`,
      height: `${theme.utils.fromPx(270)}`,
    },
    '& .MuiDialog-paper': {
      height: '288px',
      width: '831px',
    },
    '& .MuiLink-root': {
      marginRight: theme.utils.fromPx(24),
      color: '#031657',
    },
    '& .MuiAccordion-root': {
      margin: 'unset',
    },
    '& .MuiAccordion-root.Mui-expanded': {
      marginTop: '0px !important',
      marginBottom: '0px !important',
    },
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
  },
  headerPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '48px',
    marginTop: '8px',
    marginBottom: '8px',
    width: theme.spacing(13),
    '&:last-child': {
      gridTemplateColumns: 'max-content',
    },
  },

  title: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontStyle: 'bold',
    fontSize: '20px',
    lineHeight: '25px',
    color: '#031657',
  },

  blockRow: {
    display: 'grid',
    gridTemplateColumns: '45% 35% 20%',
    backgroundColor: '#EEEEEE',
  },
  blockHeading: {
    marginTop: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(8),
    marginLeft: theme.utils.fromPx(48),
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
  },
  blockHeading2: {
    marginTop: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(8),
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
  },
  blockHeading3: {
    marginTop: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(8),
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    marginRight: theme.utils.fromPx(56),
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
    textAlign: 'right',
  },
  textRight: {
    textAlign: 'right',
    marginRight: theme.utils.fromPx(18),
    marginTop: theme.utils.fromPx(2),
    color: '#2661CE',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(14),
  },
  accordionSummary: {
    flexDirection: 'row-reverse', // Moves the expand icon to the left side
  },
  accordianDetails: {
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(20),
    fontSize: theme.utils.fromPx(14),
  },
  accordianDetailsHeading: {
    color: '#666666',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
    marginLeft: theme.utils.fromPx(28),
  },
  accordionComponent: {
    '& .MuiAccordion-root': {
      border: 'none',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginRight: theme.utils.fromPx(4),
    },
    '& .MuiAccordionSummary-root': {
      display: 'flex',
    },
    '& .MuiAccordion-region': {
      backgroundColor: '#F5F5F5',
    },
    '& .MuiAccordionSummary-content': {
      display: 'grid',
      gridTemplateColumns: '42% 40% 21%',
    },
  },
  disabledLink: {
    textAlign: 'right',
    marginRight: theme.utils.fromPx(45),
    marginTop: theme.utils.fromPx(2),
    color: '#666666',
    fontFamily: 'Roboto',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(14),
  },
  blockedTime: {
    marginTop: theme.utils.fromPx(2),
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(20),
    fontSize: theme.utils.fromPx(14),
  },
}));

const BlockHistoryDialog = ({ blockOrderHistoryDialogOpen, blocks = [], id, setParentClose }) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(blockOrderHistoryDialogOpen);
  const [resolveBlockOrderDialogOpen, setResolveBlockOrderDialogOpen] = useState(false);
  const [blockOrderReason, setBlockOrderReason] = useState('');
  const [blockOrderId, setBlockOrderId] = useState('');
  const [blockComment, setBlockComment] = useState('');

  const pageName = 'Block History Dialog - VT';

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setParentClose();
  }, [setDialogOpen, setParentClose]);

  return (
    <BaseDialog
      data-testid={`autoship:block-history-dialog-${id}`}
      open={dialogOpen}
      onClose={handleDialogClose}
      hideButtonPanel={true}
      pageName={pageName}
      dialogTitle={<Typography variant="h5">{`Block History`}</Typography>}
      contentClassName={cn(classes.root)}
    >
      <div data-testid="autoshipBlockDetailsContainer" className={classes.root}>
        {(blocks || []).length > 0 && (
          <div className={classes.blockRow}>
            <div className={classes.blockHeading}>{'Reason'}</div>
            <div className={classes.blockHeading2}> {'Date Blocked'}</div>
            <div className={classes.blockHeading3}> {'Action'}</div>
          </div>
        )}
        {(blocks || []).length > 0 &&
          blocks.map((block) => {
            const rootBlockTestId = `block:${block?.id}`;
            return (
              <Accordion
                key={block.id}
                className={classes.accordionComponent}
                data-testid={`order:block:${block?.id}:accordion`}
                /* defaultExpanded */
              >
                <AccordionSummary
                  sx={{
                    pointerEvents: 'none',
                  }}
                  data-testid={`order:return:${block?.id}:accordion:summary`}
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon sx={{ color: 'black', pointerEvents: 'auto' }} />}
                >
                  <div
                    className={classes.blockedTime}
                    data-testid={`${rootBlockTestId}:title`}
                  >{`${snakeCaseToTitleCase(block?.reason)}`}</div>
                  <div
                    className={classes.blockedTime}
                    data-testid={`${rootBlockTestId}:timecreated:label`}
                  >
                    {getDayDateYearTimeTimezone(block?.timeBlocked)}
                  </div>
                  <FeatureFlag flag="feature.explorer.autoshipResolveBtnDisabled">
                    {block?.resolved === false && (
                      <span className={classes.disabledLink}>{`Resolve`}</span>
                    )}
                  </FeatureFlag>
                  <FeatureFlag flag="feature.explorer.autoshipResolveBtnEnabled">
                    {block?.resolved === false && block?.resolvable === true ? ( // will enable this once after reviewing the functionality
                      <Link
                        data-testid={`order:block:${block?.id}:link`}
                        className={classes.textRight}
                        disableRipple
                        aria-label="ResoleLink"
                        underline="hover"
                        onClick={() => {
                          setBlockOrderReason(block?.reason);
                          setBlockOrderId(block?.id);
                          setBlockComment(block?.comments);
                          setResolveBlockOrderDialogOpen(true);
                        }}
                      >
                        {`Resolve`}
                      </Link>
                    ) : block?.resolved === true ? (
                      <span className={classes.textRight}>Resolved </span>
                    ) : (
                      <span className={classes.disabledLink}>{`Resolve`}</span>
                    )}
                  </FeatureFlag>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.accordianDetailsHeading}> {`Comments`}</div>
                  <span
                    className={classes.accordianDetails}
                    data-testid={`${rootBlockTestId}:comment`}
                  >
                    {block?.comments}
                  </span>
                </AccordionDetails>
              </Accordion>
            );
          })}
        {resolveBlockOrderDialogOpen && (
          <ResolveAutoshipBlockDialog
            resolveBlockOrderDialogOpen={resolveBlockOrderDialogOpen}
            id={id}
            blockReason={blockOrderReason}
            blockId={blockOrderId}
            blockComment={blockComment}
            setParentClose={() => setResolveBlockOrderDialogOpen(false)}
          />
        )}
      </div>
    </BaseDialog>
  );
};

BlockHistoryDialog.propTypes = {
  blockOrderHistoryDialogOpen: PropTypes.bool.isRequired,
  setParentClose: PropTypes.func.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
};

export default BlockHistoryDialog;
