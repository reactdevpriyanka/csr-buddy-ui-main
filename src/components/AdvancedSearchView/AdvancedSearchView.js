import { Grid, Paper } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { uniqBy } from 'lodash';
import useAdvancedSearch from '@/hooks/useAdvancedSearch';
import { cleanParams } from '@/utils/cleanParams';
import { Form, Formik } from 'formik';
import SearchResultsTable from './SearchResultsTable/SearchResultsTable';
import SearchForm from './SearchForm/SearchForm';
import formSchema from './SearchForm/formSchema';
import {
  doFilterFormValidation,
  OrderfilterFormWhiteList,
  validationSchema,
} from './SearchForm/utils';

function merge(results) {
  return uniqBy(results, 'externalOrderId');
}

const AdvancedSearchView = () => {
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [formattedSearchResults, setFormattedSearchResults] = useState([]);
  const [searchErrors, setSearchErrors] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [formState, setFormState] = useState(formSchema);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [shouldRevalidate, setShouldRevalidate] = useState(false);
  const formRef = useRef();
  const { data: searchResults = {} } = useAdvancedSearch(
    {
      searchInProgress: searchInProgress,
      page: pageNumber,
      size: pageSize,
      ...formState,
    },
    shouldRevalidate,
  );

  const isFormValid =
    formRef?.current?.isValid && Object.keys(formRef?.current?.touched)?.length > 0;

  useEffect(() => {
    if (isFormValid) {
      setSearchInProgress(true);
    }
  }, [pageSize, pageNumber]);

  useEffect(() => {
    if (searchResults?.error) {
      setSearchInProgress(false);
      setSearchErrors(searchResults.error);
      return;
    }
    if (searchResults?.searchOrders || searchResults?.byOrderId) {
      setSearchErrors(null);
      setFormattedSearchResults(
        searchResults?.searchOrders
          ? merge([...formattedSearchResults, ...searchResults?.searchOrders?.results])
          : [searchResults?.byOrderId],
      );

      setTotalResults(
        searchResults?.searchOrders
          ? searchResults?.searchOrders?.totalResults
          : searchResults?.byOrderId?.totalResults,
      );

      setTotalPages(searchResults?.searchOrders?.numberOfPages);
      setShouldRevalidate(false);
      setSearchInProgress(false);
    } else if (searchResults?.byOrderId === null || searchResults?.searchOrders === null) {
      resetAllFields();
    }
  }, [searchResults]);

  const handleSearch = (props) => {
    setFormState(cleanParams(props));
    setSearchErrors(null);
    setFormattedSearchResults([]);
    setPageNumber(0);
    setShouldRevalidate(true);
    setSearchInProgress(true);
  };

  const resetAllFields = () => {
    setFormattedSearchResults([]);
    setTotalPages(0);
    setShouldRevalidate(false);
    setSearchInProgress(false);
  };

  return (
    <Grid container wrap="nowrap">
      <Grid item xs="auto">
        <Paper
          sx={{
            maxWidth: '300px',
          }}
        >
          <Formik
            innerRef={formRef}
            enableReinitialize
            initialValues={formSchema}
            onSubmit={handleSearch}
            validate={doFilterFormValidation.bind(this, validationSchema, OrderfilterFormWhiteList)}
            validationSchema={validationSchema}
          >
            {({ values, errors, handleChange, handleSubmit, isValid, dirty, resetForm }) => (
              <Form>
                <SearchForm
                  values={values}
                  errors={errors}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isValid={isValid}
                  dirty={dirty}
                  resetForm={resetForm}
                  searchInProgress={searchInProgress}
                  handleSearch={handleSearch}
                  formState={formState}
                  loading={searchInProgress}
                />
              </Form>
            )}
          </Formik>
        </Paper>
      </Grid>
      <Grid item xs>
        <SearchResultsTable
          searchInProgress={searchInProgress}
          results={formattedSearchResults}
          totalResults={totalResults}
          pageNumber={pageNumber}
          totalPages={totalPages}
          pageSize={pageSize}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          errors={searchErrors}
        />
      </Grid>
    </Grid>
  );
};

export default AdvancedSearchView;
