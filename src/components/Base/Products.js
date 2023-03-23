/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Typography } from '@material-ui/core';

import getThumbnail from '@utils/thumbnails';

const useStyles = makeStyles((theme) => ({
  root: {},
  productGrid: {
    display: 'inline-grid',
    gridTemplateColumns: `1fr 1fr`,
    gridColumnGap: theme.spacing(0.5),
    width: `calc(100% - ${theme.spacing(2.5)})`,
  },
  button: {
    background: 'white',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #F2F2F2',
    borderRadius: '0.5rem',
  },
  optionHeader: {
    fontSize: theme.fonts.size.md,
    color: theme.palette.gray.medium,
    fontWeight: '500',
    margin: `${theme.spacing(1)} 0`,
  },
  hiddenInput: {
    display: 'none',
  },
  figure: {
    display: 'flex',
    flexFlow: 'row nowrap',
    margin: theme.spacing(0, 0.5),
    '& > img': {
      maxWidth: theme.utils.fromPx(85),
      width: 'auto',
      height: theme.utils.fromPx(85),
      margin: '0 auto',
    },
    '& ~ .overview': {
      marginLeft: theme.utils.fromPx(16),
      textAlign: 'left',
    },
  },
  title: {
    ...theme.fonts.body.bold,
    display: 'inline-block',
    margin: `${theme.utils.fromPx(8)} 0`,
    color: theme.palette.gray.medium,
  },
  price: {
    ...theme.fonts.body.normal,
    display: 'inline-block',
    margin: `0 0 ${theme.utils.fromPx(8)} 0`,
  },
  selected: { border: '1px solid #128ced', background: '#DDF0FF' },
}));

const ProductsNode = ({ node, responseHandler }) => {
  const testId = `gwf-input:product`;
  const classes = useStyles();
  const [hiddenValue, setHiddenValue] = useState('');

  const handleSelect = (catalogEntryId) => {
    if (catalogEntryId) {
      setHiddenValue(catalogEntryId);
      responseHandler(node.id, node.id);
    }
  };

  const productOption = (product) => (
    <button
      key={product.catalogEntryId}
      className={cn(classes.button, product.catalogEntryId === hiddenValue && classes.selected)}
      data-testid={`${testId}-option`}
      data-testkey={`${testId}-${product.catalogEntryId}`}
      type="button"
      onClick={() => {
        handleSelect(product.catalogEntryId);
      }}
    >
      <figure data-testid={`${testId}-thumbnail`} className={cn(classes.figure)}>
        <img src={getThumbnail(product.thumbnail)} alt="" />
      </figure>
      <div className={`${classes.overview} overview`} data-testid={`${testId}-overview`}>
        <strong data-testid={`${testId}-name`} className={cn(classes.title)}>
          {/* {canceled && '(Cancelled)'} {title} */}
          {product.name}
        </strong>
        <p data-testid={`${testId}-price`} className={cn(classes.price)}>
          {`$${product.unitPrice.value}`}
        </p>
      </div>
    </button>
  );

  return (
    <div data-testid={testId} className={classes.root}>
      {/** Primary Option */}
      <Typography variant="h2" className={cn(classes.optionHeader)}>
        Replacement Options
      </Typography>
      <div className={classes.productGrid}>
        {[node.originalItem].map((product) => {
          return productOption(product);
        })}
      </div>
      {/** Secondary Options */}
      <Typography variant="h2" className={cn(classes.optionHeader)}>
        Try one of these instead
      </Typography>
      <div className={classes.productGrid}>
        {node.alternativeChoices.map((product) => {
          return productOption(product);
        })}
      </div>
      <FormControl component="fieldset">
        <TextField
          type="text"
          className={classes.hiddenInput}
          label="test"
          value={hiddenValue}
          name={node.decisionInputAttribute}
          data-testid={`${testId}-selected`}
        />
      </FormControl>
    </div>
  );
};

ProductsNode.propTypes = {
  node: PropTypes.object.isRequired,
  responseHandler: PropTypes.func.isRequired,
};

export default ProductsNode;
