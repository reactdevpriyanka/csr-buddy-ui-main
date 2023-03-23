import PropTypes from 'prop-types';
import { getDayDateYearTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core';
import {
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Fragment, useMemo } from 'react';
import { BlockRounded, EditRounded, AutorenewRounded } from '@mui/icons-material';
import CopyableText from '@/components/CopyableText';
import FlagsCell from './FlagsCell';
import OrderStatusCell from './OrderStatusCell';
import CustomerNameCell from './CustomerNameCell';
import TableLoadingSkeleton from './TableLoadingSkeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0rem 1rem',
  },
  fadeIn: {
    animation: 'fadeIn 1s',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.utils.fromPx(4),
  },
  flagsBlock: {
    paddingBottom: theme.utils.fromPx(4),
  },
}));

const SearchResultsTable = ({
  results = [],
  totalResults,
  pageNumber,
  totalPages,
  pageSize,
  setPageSize,
  setPageNumber,
  errors,
  searchInProgress,
}) => {
  const classes = useStyles();

  const columns = useMemo(() => [
    {
      id: 'externalOrderId',
      label: 'Order ID',
      format: function render(value) {
        return (
          <CopyableText copyOnDoubleClick={true}>
            <span>{value}</span>
          </CopyableText>
        );
      },
    },
    {
      id: 'timePlaced',
      label: 'Order Date',
      format: (timePlaced) => getDayDateYearTimeTimezone(new Date(timePlaced)),
    },
    {
      id: 'memberId',
      label: 'Customer Name',
      format: function render(value) {
        return <CustomerNameCell customerId={value} />;
      },
    },
    {
      id: 'total',
      label: 'Total',
      format: (total) => '$' + total.value,
    },
    {
      id: 'status',
      label: 'Status',
      format: function render(status) {
        return <OrderStatusCell status={status} />;
      },
    },
    {
      id: 'timeUpdated',
      label: 'Last Update',
      format: (timeUpdated) => getDayDateYearTimeTimezone(new Date(timeUpdated)),
    },
    {
      id: 'flags',
      label: 'Flags',
      format: function render(value, row) {
        return (
          <FlagsCell
            blocked={row?.blocked}
            blocks={row?.blocks}
            businessChannel={row?.businessChannel}
            submitter={row?.submitter}
            classes={classes}
          />
        );
      },
    },
  ]);

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  const nextButtonDisabled = useMemo(() => {
    return searchInProgress || pageNumber === totalPages - 1 || results?.length === 0;
  }, [searchInProgress, pageNumber, totalPages]);

  const tableRowsToRender = useMemo(() => {
    return results?.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);
  }, [results, pageNumber, pageSize]);

  return (
    <div className={classes.root}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography
          variant="h6"
          id="tableTitle"
          sx={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          }}
        >
          Search Results
          <TablePagination
            sx={{ marginLeft: 'auto' }}
            rowsPerPageOptions={[]}
            component="div"
            count={totalResults ? totalResults : 1}
            rowsPerPage={pageSize}
            page={pageNumber}
            onPageChange={handleChangePage}
            nextIconButtonProps={{ disabled: nextButtonDisabled }}
          />
        </Typography>

        <TableContainer
          data-testid="advanced-search-results"
          sx={{ maxHeight: 900, minHeight: 900 }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <Fragment key={column.id}>
                    <TableCell align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  </Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results?.length === 0 && !errors && !searchInProgress && (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography justifyContent="center" display="flex" variant="h7">
                      {'No Results Found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {errors && (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography justifyContent="center" display="flex" variant="h7" color="error">
                      {'Error getting search results'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {searchInProgress && <TableLoadingSkeleton numberofColumns={columns.length} />}
              {tableRowsToRender?.map((row) => {
                return (
                  <Fade in key={row?.externalOrderId}>
                    <TableRow
                      hover
                      data-testid={`${row?.externalOrderId}:row`}
                      className={classes.fadeIn}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            data-testid={`${column.id}`}
                            key={column.id}
                            align={column.align}
                          >
                            {column.format(value, row)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </Fade>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={totalResults ? totalResults : 1}
          rowsPerPage={pageSize}
          page={pageNumber}
          onPageChange={handleChangePage}
          nextIconButtonProps={{ disabled: nextButtonDisabled }}
        />
      </Paper>
      <Paper
        elevation={1}
        sx={{
          marginTop: '1rem',
          padding: '1rem',
          alignItems: 'center',
          display: 'inline-flex',
          width: '100%',
        }}
      >
        {'Flag Legend: '}
        <span className={classes.legendItem}>
          {' '}
          <BlockRounded fontSize="small" color="error" /> = Blocked,{' '}
        </span>
        <span className={classes.legendItem}>
          {' '}
          <EditRounded fontSize="small" color="error" /> = CSR Edit,{' '}
        </span>
        <span className={classes.legendItem}>
          {' '}
          <AutorenewRounded fontSize="small" color="error" /> = Recurring
        </span>
      </Paper>
    </div>
  );
};

SearchResultsTable.propTypes = {
  results: PropTypes.array,
  totalResults: PropTypes.number,
  pageNumber: PropTypes.number,
  totalPages: PropTypes.number,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  setPageNumber: PropTypes.func,
  errors: PropTypes.bool,
  searchInProgress: PropTypes.bool,
};

export default SearchResultsTable;
