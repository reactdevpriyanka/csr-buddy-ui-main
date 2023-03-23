import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { IconButton } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';
import useFeature from '@/features/useFeature';
import AutoshipColor from '@icons/autoship-color.svg';
import TooltipPrimary from '../TooltipPrimary';

export default function AutoshipContent({ isAutoship, classes, parentOrderId }) {
  const autoshipEnabled = useFeature('feature.explorer.autoshipTabEnabled');
  const { getLang } = useAthena();
  const router = useRouter();

  return isAutoship ? (
    <div className={classes.autoshipSection}>
      {autoshipEnabled ? (
        <TooltipPrimary
          aria-label={parentOrderId}
          arrow
          placement="bottom"
          title={getLang('autoshipParentOrderLink', {
            fallback: 'Click here to see Autoship Parent order',
          })}
        >
          <NextLink href={`/customers/${router.query.id}/autoship#${parentOrderId}`}>
            <IconButton
              classes={{ root: classes.iconButton }}
              data-testid={`card:autoship-indicator-${parentOrderId}-button`}
            >
              <AutoshipColor className={classes.autoshipLabelIcon} />
            </IconButton>
          </NextLink>
        </TooltipPrimary>
      ) : (
        <span data-testid={`card:autoship-indicator-${parentOrderId}`}>
          <AutoshipColor className={classes.autoshipLabelIcon} />
        </span>
      )}
    </div>
  ) : null;
}

AutoshipContent.propTypes = {
  isAutoship: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  parentOrderId: PropTypes.string.isRequired,
};
