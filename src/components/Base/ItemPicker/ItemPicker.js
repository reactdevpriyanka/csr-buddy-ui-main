/* eslint-disable react/jsx-props-no-spreading */
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import ShipmentList from './ShipmentList';
import ItemList from './ItemList';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.utils.fromPx(350),
    marginBottom: theme.utils.fromPx(20),
    gridRowStart: 1,
    gridColumnStart: 1,
    gridRowEnd: 'span 500',
  },
  itemBox: {
    border: `1px solid #d5d5d5`,
    borderRadius: theme.utils.fromPx(4),
    overflow: 'hidden',
    minHeight: theme.utils.fromPx(100),
    '&.vertical': {
      position: 'sticky',
      top: theme.utils.fromPx(20),
      maxHeight: `calc(100vh - ${theme.utils.fromPx(20)})`,
      overflowY: 'scroll',
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  label: {
    paddingLeft: `${theme.utils.fromPx(16)}`,
  },
}));

const testId = (id) => `item-picker-${id}`;

const ItemPicker = ({ id, label = '', shipments = [], orientation, ...props }) => {
  const classes = useStyles();

  const isVertical = orientation === 'VERTICAL';

  label = props.lineItems?.length > 1 ? 'Select an item to continue' : null;

  const onChoose = useCallback(() => {
    props.onChoose(props.singularOutcome);
    window.dispatchEvent(
      new CustomEvent('gwf:refire', {
        detail: {
          id: props.singularOutcome,
        },
      }),
    );
  }, [props]);

  return (
    <div data-testid={`${testId(id)}-container`} className={cn([classes.root])}>
      <div data-testid={testId(id)} className={cn([classes.itemBox, isVertical && 'vertical'])}>
        {label && <h3 className={cn([classes.label, 'item-picker-label'])}>{label}</h3>}
        {shipments.length > 0 ? (
          <ShipmentList shipments={shipments} {...props} onChoose={onChoose} />
        ) : (
          <ItemList {...props} onChoose={onChoose} />
        )}
      </div>
    </div>
  );
};

ItemPicker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.node,
  shipments: PropTypes.array,
  lineItems: PropTypes.array.isRequired,
  onChoose: PropTypes.func.isRequired,
  value: PropTypes.object,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
  singularOutcome: PropTypes.string,
};

export default ItemPicker;
