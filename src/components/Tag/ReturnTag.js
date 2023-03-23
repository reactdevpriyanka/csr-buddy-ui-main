import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { removeUnderscores, snakeCaseToTitleCase } from '@/utils/string';
import { makeStyles } from '@material-ui/core';
import ConditionalWrapper from '@/utils/conditionalWrapper';
import { formatAction } from '../Card/utils';
import Sticker from '../Sticker';

const useStyles = makeStyles((theme) => ({
  sticker: {
    color: '#BC2848',
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  tooltipText: {
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
}));

const ReturnTag = ({ returnItem, isGridItem = false }) => {
  const classes = useStyles();

  const key = `${returnItem.returnId}-${returnItem.type}`;

  const testId = `product:return:pill:${key}`;

  const getTitleElem = (title) => {
    return <span className={classes.tooltipText}>{title}</span>;
  };

  const gridWrapper = (children) => (
    <Grid item xs="auto" sx={{ marginRight: '4px' }}>
      {children}
    </Grid>
  );

  return (
    <ConditionalWrapper condition={isGridItem} wrapper={gridWrapper} key={testId}>
      <Sticker
        type="default"
        className={classes.sticker}
        toolTip={getTitleElem(snakeCaseToTitleCase(returnItem.reasonCategory))}
      >
        <span className={classes.nowrap} data-testid={testId}>
          {removeUnderscores(formatAction(returnItem.type, returnItem.state))?.toUpperCase()}
        </span>
      </Sticker>
    </ConditionalWrapper>
  );
};

ReturnTag.propTypes = {
  returnItem: PropTypes.object,
  isGridItem: PropTypes.bool,
};

export default ReturnTag;
