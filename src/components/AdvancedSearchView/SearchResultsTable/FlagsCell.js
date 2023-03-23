import TooltipPrimary from '@/components/TooltipPrimary';
import { snakeCaseToTitleCase } from '@/utils/string';
import { BlockRounded, EditRounded, AutorenewRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';

const SUBMITTER = {
  csr: 'CSR',
  customer: 'CUSTOMER',
  system: 'SYSTEM',
};

const BUSINESS_CHANNEL = {
  android: 'ANDROID',
  autoship: 'AUTOSHIP',
  ios: 'IOS',
  unknown: 'UNKNOWN',
  web: 'WEB',
};

const FlagsCell = ({ blocked, blocks, businessChannel, submitter, classes }) => {
  if (blocked === true) {
    const tooltip = (
      <div>
        <div className={classes.flagsBlock}>
          <b>Blocked</b>
        </div>
        {blocks &&
          blocks?.map((block) => (
            <div key={block?.id}>
              <b>{snakeCaseToTitleCase(block?.reason)}</b>
              {block?.comments && <span>: {block?.comments}</span>}
            </div>
          ))}
      </div>
    );
    return (
      <TooltipPrimary title={tooltip}>
        <BlockRounded fontSize="small" color="error" />
      </TooltipPrimary>
    );
  }
  if (businessChannel === BUSINESS_CHANNEL.autoship)
    return (
      <TooltipPrimary title="Recurring">
        <AutorenewRounded fontSize="small" />
      </TooltipPrimary>
    );
  if (submitter === SUBMITTER.csr)
    return (
      <TooltipPrimary title="CSR Edit">
        <EditRounded fontSize="small" />
      </TooltipPrimary>
    );
  return null;
};

FlagsCell.propTypes = {
  blocked: PropTypes.bool,
  blocks: PropTypes.arrayOf(PropTypes.object),
  businessChannel: PropTypes.string,
  submitter: PropTypes.string,
  classes: PropTypes.object,
};

export default FlagsCell;
