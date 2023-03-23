import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import useAthena from '@/hooks/useAthena';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, Divider } from '@mui/material';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'inherit',
    display: 'grid',
    gridTemplateColumns: '45% 10% 45%',
    marginRight: '15px',
  },
  buttons: {
    fontWeight: 'bolder !important',
    borderWidth: '3px !important',
  },
  leftPanel: {
    height: 'inherit',
  },
  rightPanel: {
    height: 'inherit',
  },
  buttonPanel: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  sideContainer: {
    height: '100%',
  },
  middleContainer: {
    height: '100% !important',
  },
  listContainter: {
    width: '100%',
    height: 'inherit',
    overflow: 'auto !important',
  },
  selectionContainer: {
    height: '370px',
    overflow: 'scroll',
  },
}));

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export function Shuttle({ left, setLeft, right, setRight, ...props }) {
  const baseDataTestId = props['data-testid'];
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const { getLang } = useAthena();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight((prevRight) =>
      [...prevRight, ...leftChecked].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    );

    setLeft((prevLeft) => {
      return not(prevLeft, leftChecked);
    });
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft((prevLeft) =>
      [...prevLeft, ...rightChecked].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    );
    setRight((prevRight) => not(prevRight, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const customList = (testId, title, items) => (
    <Card className={classes.listContainter} data-testid={`${testId}`}>
      <CardHeader
        data-testid={`${testId}-cardheader`}
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            data-testid={`${testId}-cardheader-checkbox`}
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items?.length && items?.length > 0}
            indeterminate={numberOfChecked(items) !== items?.length && numberOfChecked(items) !== 0}
            disabled={items?.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items?.length} ${getLang('findUserApp_selected', {
          fallback: 'selected',
        })}`}
      />
      <Divider />
      <List dense className={classes.selectionContainer} component="div" role="list">
        {items
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((item) => {
            const labelId = `transfer-list-item-${item.displayName}-label`;

            return (
              <ListItem
                data-testid={`${testId}-listItem-${item?.displayValue}`}
                key={item?.displayName}
                role="listitem"
                button
                // onClick={handleToggle(item)}
              >
                <ListItemIcon>
                  <Checkbox
                    data-testid={`${testId}-listItem-checkbox${item?.displayValue}`}
                    onClick={handleToggle(item)}
                    checked={checked.includes(item)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  data-testid={`${testId}-listItem-text-${item?.displayValue}`}
                  id={labelId}
                  primary={item?.displayValue || item.displayName}
                />
              </ListItem>
            );
          })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <div className={classes.root} data-testid={`${baseDataTestId}`}>
      <div className={classes.leftPanel}>
        {customList(
          `${baseDataTestId}-left`,
          getLang('findUserApp_choices', { fallback: 'Choices' }),
          left,
        )}
      </div>
      <div className={classes.buttonPanel}>
        <Button
          data-testid={`${baseDataTestId}-move-right-button`}
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          className={classes.buttons}
        >
          <span className={classes.arrow}>&gt;</span>
        </Button>
        <Button
          data-testid={`${baseDataTestId}-move-left-button`}
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          className={classes.buttons}
        >
          <span className={classes.arrow}>&lt;</span>
        </Button>
      </div>
      <div className={classes.rightPanel}>
        {customList(
          `${baseDataTestId}-right`,
          getLang('findUserApp_chosen', { fallback: 'Chosen' }),
          right,
        )}
      </div>
    </div>
  );
}

Shuttle.propTypes = {
  left: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      displayName: PropTypes.string,
      role: PropTypes.string,
    }),
  ),
  right: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      displayName: PropTypes.string,
      role: PropTypes.string,
    }),
  ),
  setLeft: PropTypes.func,
  setRight: PropTypes.func,
  'data-testid': PropTypes.string,
};

export default Shuttle;
