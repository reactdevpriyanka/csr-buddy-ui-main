import Select, { CardOption } from '@components/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  page: {
    background: '#fefefe',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',
  },
}));

export default function CcPickerDemo() {
  const classes = useStyles();

  const options = [
    { id: 1, label: 'Card ending in 1234', type: 'AMEX' },
    { id: 2, label: 'Card ending in 5678', type: 'DISCOVER' },
    { id: 3, label: 'Card ending in 9101', type: 'MASTERCARD' },
    { id: 4, label: 'Card ending in 1011', type: 'VISA' },
  ];

  return (
    <div className={classes.page}>
      <div className={classes.container}>
        <Select optionComponent={CardOption} options={options} />
      </div>
    </div>
  );
}
