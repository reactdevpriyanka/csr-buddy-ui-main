import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import customer from '__mock__/customers/nessa';
import { useField } from 'formik'; // package will be auto mocked
import SearchForm from './SearchForm';

jest.mock('@/hooks/useCustomer');
jest.mock('formik');

const initialValues = {
  orderId: '',
  logonId: '',
  status: '',
  name: '',
  address: '',
  city: '',
  zip: '',
  email: '',
  phone: '',
  partNumber: '',
  blocked: '',
  blockReason: '',
  fulfillmentCenter: '',
  payReferenceId: '',
  paypalEmail: '',
  ipAddress: '',
  timePlacedFrom: '',
  timePlacedTo: '',
  timeUpdatedFrom: '',
  timeUpdatedTo: '',
};

const defaultProps = {
  searchInProgress: false,
  values: initialValues,
  errors: initialValues,
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  isValid: false,
  resetForm: jest.fn(),
};

describe('<SearchForm />', () => {
  const render = renderWrap(SearchForm, {
    defaultProps,
  });

  const mockMeta = {
    touched: false,
    error: '',
    initialError: '',
    initialTouched: false,
    initialValue: '',
    value: '',
  };
  const mockField = {
    value: '',
    checked: false,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    multiple: undefined,
    name: 'firstName',
  };

  const mockHelpers = {
    setError: jest.fn(),
    setTouched: jest.fn(),
    setValue: jest.fn(),
  };

  useField.mockReturnValue([mockField, mockMeta, mockHelpers]);

  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });

  test('it should render the search form', () => {
    expect(render()).toMatchSnapshot();
  });
});
