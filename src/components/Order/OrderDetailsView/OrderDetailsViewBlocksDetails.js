import PropTypes from 'prop-types';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getDayDateYearTimeTimezone } from '@/utils';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { snakeCaseToTitleCase } from '@/utils/string';
import useFeature from '@/features/useFeature';
import useAthena from '@/hooks/useAthena';
import ResolveBlockDialog from './Dialogs/ResolveBlockDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '25px',
    '& ul': {
      listStyle: 'disc',
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
    gridTemplateColumns: '60% 30% 10%',
    backgroundColor: '#EEEEEE',
    height: '50px !important',
    marginTop: '15px',
  },
  noBlockRow: {
    height: '70px !important',
    marginTop: '15px',
    backgroundColor: '#FFFFFF',
  },
  noBlockHeading: {
    marginLeft: theme.utils.fromPx(24),
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(22),
    fontSize: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(24),
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
    marginLeft: theme.utils.fromPx(6),
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
    marginRight: theme.utils.fromPx(30),
  },
  accordionSummary: {
    flexDirection: 'row-reverse', // Moves the expand icon to the left side
  },
  accordianDetails: {
    marginLeft: theme.utils.fromPx(24),
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(20),
    fontSize: theme.utils.fromPx(14),
  },
  accordianDetailsHeading: {
    marginLeft: theme.utils.fromPx(24),
    color: '#666666',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
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
      gridTemplateColumns: '60% 30% 10%',
    },
  },
  disabledLink: {
    textAlign: 'right',
    marginRight: theme.utils.fromPx(22),
    color: '#666666',
    pointerEvents: 'none',
  },
}));

const OrderDetailsViewBlocksDetails = ({ orderNumber, blocks }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  const [resolveBlockOrderDialogOpen, setResolveBlockOrderDialogOpen] = useState(false);
  const [blockOrderReason, setBlockOrderReason] = useState('');
  const [blockOrderId, setBlockOrderId] = useState('');
  const [blockComment, setBlockComment] = useState('');

  const showOrderResolveBlock = useFeature('feature.explorer.orderResolveBlockEnabled');

  return (
    <div data-testid="orderDetailsViewBlockDetailsContainer" className={classes.root}>
      <div className={classes.title}>
        {getLang('orderBlockHistory', { fallback: 'Block History' })}
      </div>
      {blocks?.length > 0 && (
        <div className={classes.blockRow}>
          <div className={classes.blockHeading}>
            {getLang('orderBlockReason', { fallback: 'Reason' })}
          </div>
          <div className={classes.blockHeading2}>
            {getLang('orderBlockDate', { fallback: 'Date Blocked' })}
          </div>
          <div className={classes.blockHeading3}>
            {getLang('orderBlockAction', { fallback: 'Action' })}
          </div>
        </div>
      )}
      {blocks?.length > 0 &&
        blocks?.map((block) => {
          const rootBlockTestId = `block:${block?.id}`;
          return (
            <Accordion
              key={block.id}
              className={classes.accordionComponent}
              data-testid={`order:block:${block?.id}:accordion`}
              /* defaultExpanded */
            >
              <AccordionSummary
                data-testid={`order:return:${block?.id}:accordion:summary`}
                className={classes.accordionSummary}
                expandIcon={<ExpandMoreIcon sx={{ color: 'black', pointerEvents: 'auto' }} />}
              >
                <div data-testid={`${rootBlockTestId}:title`}>{`${snakeCaseToTitleCase(
                  block?.reason,
                )}`}</div>
                <div data-testid={`${rootBlockTestId}:timecreated:label`}>
                  {getDayDateYearTimeTimezone(block?.timeBlocked)}
                </div>
                {!block?.resolved && block?.resolvable && showOrderResolveBlock ? (
                  <Link
                    data-testid={`order:block:${block?.id}:link`}
                    className={classes.textRight}
                    disableRipple
                    aria-label="ResoleLink"
                    underline="hover"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlockOrderReason(block?.reason);
                      setBlockOrderId(block?.id);
                      setBlockComment(block?.comments);
                      setResolveBlockOrderDialogOpen(true);
                    }}
                  >
                    {getLang('orderBlockResolve', { fallback: 'Resolve' })}
                  </Link>
                ) : block?.resolved === true ? (
                  <span className={classes.disabledLink}>
                    {getLang('orderBlockResolved', { fallback: 'Resolved' })}{' '}
                  </span>
                ) : (
                  <span className={classes.disabledLink}>
                    {getLang('orderBlockResolve', { fallback: 'Resolve' })}
                  </span>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.accordianDetailsHeading}>
                  {getLang('orderBlockComments', { fallback: 'Comments' })}
                </div>
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
      {blocks?.length === 0 && (
        <div className={classes.noBlockRow}>
          <div className={classes.noBlockHeading}>
            {getLang('orderBlockNoBlocks', { fallback: 'No Blocks' })}
          </div>
        </div>
      )}
      {resolveBlockOrderDialogOpen && (
        <ResolveBlockDialog
          resolveBlockOrderDialogOpen={resolveBlockOrderDialogOpen}
          orderNumber={orderNumber}
          blockReason={blockOrderReason}
          blockId={blockOrderId}
          blockComment={blockComment}
          setParentClose={() => setResolveBlockOrderDialogOpen(false)}
        />
      )}
    </div>
  );
};

OrderDetailsViewBlocksDetails.propTypes = {
  orderNumber: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.object),
};

export default OrderDetailsViewBlocksDetails;
