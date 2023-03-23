import PropTypes from 'prop-types';
import Sticker from '@/components/Sticker';
import { formatItemType } from '../utils';

export default function BaseItemType({ tag, ...props }) {
  return (
    <Sticker>
      <span data-testid={props['data-testid']}>{formatItemType(tag)}</span>
    </Sticker>
  );
}

BaseItemType.propTypes = {
  tag: PropTypes.string,
  'data-testid': PropTypes.string,
};
