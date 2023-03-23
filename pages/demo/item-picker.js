import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ItemPicker from '@components/Base/ItemPicker';
import { singleShipment } from '__mock__/item-picker';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: theme.utils.fromPx(40),
  },
  container: {
    width: theme.utils.fromPx(350),
  },
}));

export default function ItemPickerDemo() {
  const classes = useStyles();

  const { shipments, lineItems } = singleShipment;

  const [selection, setSelection] = useState(null);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <ItemPicker
          shipments={shipments}
          lineItems={lineItems}
          selection={selection}
          onSelect={(option) => setSelection(option)}
        />
      </div>
    </div>
  );
}
