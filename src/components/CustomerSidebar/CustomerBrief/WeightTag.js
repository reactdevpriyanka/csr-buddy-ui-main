import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import useTags from '@/hooks/useTags';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import Checkbox from './Checkbox';
import Weights from './Weights';

const DISABLE_WEIGHT_VALUE = -1;

const WeightTag = ({
  defaultChecked = false,
  defaultValue = -1,
  description,
  displayName,
  name,
}) => {
  const { updateCustomerTags } = useTags();

  const [checked, setChecked] = useState(defaultChecked);
  const { captureInteraction } = useAgentInteractions();

  const postInteraction = useCallback(
    (savedTag) => {
      const oldTag = {
        name: savedTag.name,
        value: defaultValue || DISABLE_WEIGHT_VALUE,
      };
      captureInteraction({
        type: 'CUSTOMER_TAGS',
        action: 'UPDATE',
        currentVal: savedTag,
        prevVal: oldTag,
      });
    },
    [captureInteraction, defaultValue],
  );

  const toggleChecked = useCallback(
    (event) => {
      setChecked(event.target.checked);
      if (!event.target.checked) {
        const savedTag = { name, value: DISABLE_WEIGHT_VALUE };
        updateCustomerTags(savedTag).then((isUpdateSuccessful) => {
          if (isUpdateSuccessful) {
            postInteraction(savedTag);
          }
        });
      }
    },
    [name, setChecked, updateCustomerTags, postInteraction],
  );

  const onChange = useCallback(
    (event) => {
      const savedTag = { name, value: Number.parseInt(event.target.value, 10) };
      updateCustomerTags(savedTag).then((isUpdateSuccessful) => {
        if (isUpdateSuccessful) {
          postInteraction(savedTag);
        }
      });
    },
    [name, updateCustomerTags, postInteraction],
  );

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked, setChecked]);

  return (
    <div data-testid="weight-tag">
      <Checkbox
        checked={checked}
        name={name}
        description={description}
        displayName={displayName}
        onChange={toggleChecked}
      />

      <Weights disabled={!checked} onChange={onChange} defaultValue={defaultValue} />
    </div>
  );
};

WeightTag.propTypes = {
  defaultChecked: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  description: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default WeightTag;
