import { Skeleton, TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, memo } from 'react';
/* eslint-disable unicorn/no-new-array */

const TableLoadingSkeleton = ({ numberofColumns }) => {
  const rows = [...new Array(50)];
  const columns = [...new Array(numberofColumns)];
  return rows.map((row, rIndex) => (
    <Fragment key={rIndex}>
      <TableRow>
        {columns.map((x, cIndex) => (
          <TableCell key={cIndex}>
            <Skeleton animation="pulse" />
          </TableCell>
        ))}
      </TableRow>
    </Fragment>
  ));
};

TableLoadingSkeleton.propTypes = {
  numberOfColumns: PropTypes.string,
};

export default memo(TableLoadingSkeleton);
