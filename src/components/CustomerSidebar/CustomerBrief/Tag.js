import { useMemo } from 'react';
import PropTypes from 'prop-types';
import SimpleTag from './SimpleTag';
import WeightTag from './WeightTag';

const components = {
  WEIGHT_LIMIT: WeightTag,
};

const Tag = ({
  name,
  displayName,
  description = '',
  defaultChecked = false,
  defaultValue = '',
}) => {
  const TagComponent = useMemo(() => components[name] || SimpleTag, [name]);

  return (
    <TagComponent
      name={name}
      displayName={displayName}
      description={description}
      defaultChecked={defaultChecked}
      defaultValue={defaultValue}
    />
  );
};

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  description: PropTypes.string,
  defaultChecked: PropTypes.bool,
  defaultValue: PropTypes.any,
};

export default Tag;
