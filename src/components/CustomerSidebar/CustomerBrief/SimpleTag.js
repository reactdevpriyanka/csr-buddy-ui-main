import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import useTags from '@/hooks/useTags';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import Checkbox from './Checkbox';

const SimpleTag = ({ defaultChecked = false, description, displayName, name }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const { updateCustomerTags } = useTags();
  const { captureInteraction } = useAgentInteractions();

  const postInteraction = useCallback(
    (savedTag) => {
      const oldTag = {
        name: savedTag.name,
        value: !!defaultChecked,
      };
      captureInteraction({
        type: 'CUSTOMER_TAGS',
        action: 'UPDATE',
        currentVal: savedTag,
        prevVal: oldTag,
      });
    },
    [captureInteraction, defaultChecked],
  );

  const onChange = useCallback(
    (event) => {
      setChecked(event.target.checked);
      const savedTag = { name, value: event.target.checked };
      updateCustomerTags(savedTag).then((isUpdateSuccessful) => {
        if (isUpdateSuccessful) {
          postInteraction(savedTag);
        }
      });
    },
    [name, setChecked, updateCustomerTags, postInteraction],
  );

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked, setChecked]);

  return (
    <div data-testid="simple-tag">
      <Checkbox
        onChange={onChange}
        name={name}
        displayName={displayName}
        description={description}
        checked={checked}
      />
    </div>
  );
};

SimpleTag.propTypes = {
  defaultChecked: PropTypes.bool,
  description: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default SimpleTag;
