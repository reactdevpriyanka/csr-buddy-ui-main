import renderWrap from '@/utils/renderWrap';
import { fireEvent, within } from '@testing-library/dom';
import Address from './Address';

const address1 = {
  id: '1',
  addressLine1: '1 First street',
  city: 'Boston',
  state: 'MA',
  postcode: '02120',
};
const address2 = {
  id: '2',
  addressLine1: '2 Second street',
  city: 'Roxbury',
  state: 'MA',
  postcode: '02121',
};
const address3 = {
  id: '3',
  addressLine1: '3 Third street',
  city: 'Cambridge',
  state: 'MA',
  postcode: '02214',
};

const defaultProps = {
  choices: [address1, address2, address3],
};

describe('<AddressOption />', () => {
  const baseRender = renderWrap(Address, { defaultProps });

  describe('Title', () => {
    it('Renders a title if provided', () => {
      const { queryByText } = baseRender({ title: 'A title' });
      expect(queryByText('A title')).toBeInTheDocument();
    });

    it('Doesnt render a title if not provided', () => {
      const { queryByText } = baseRender();
      expect(queryByText('A title')).toBeNull();
    });
  });

  describe('Label', () => {
    it('Renders a label if provided', () => {
      const { queryByText } = baseRender({ label: 'A label' });
      expect(queryByText('A label')).toBeInTheDocument();
    });

    it('Doesnt render a label if not provided', () => {
      const { queryByText } = baseRender();
      expect(queryByText('A label')).toBeNull();
    });
  });

  describe('SubLabel', () => {
    it('Renders a sublabel if provided', () => {
      const { queryByText } = baseRender({ subLabel: 'A sublabel' });
      expect(queryByText('A sublabel')).toBeInTheDocument();
    });

    it('Doesnt render a sublabel if not provided', () => {
      const { queryByText } = baseRender();
      expect(queryByText('A sublabel')).toBeNull();
    });
  });

  describe('InputLabel', () => {
    it('Renders a inputlabel if provided', () => {
      const { queryAllByText } = baseRender({ inputLabel: 'Choose an Address' });
      expect(queryAllByText('Choose an Address')).toHaveLength(2);
    });

    it('Doesnt render a inputlabel if not provided', () => {
      const { queryByText } = baseRender();
      expect(queryByText('Choose an Address')).toBeNull();
    });
  });

  describe('Address Choices', () => {
    it('Renders all the options', () => {
      const { getByTestId } = baseRender();
      const addrSelect = getByTestId('gwf-input:address');
      const ddBtn = within(addrSelect).getByRole('button');
      fireEvent.click(ddBtn);
      fireEvent.mouseDown(ddBtn);
      defaultProps.choices.map((choice) =>
        expect(getByTestId(`gwf-input:address:${choice.id}`)).toBeInTheDocument(),
      );
    });

    it('Invokes onChoose on select', () => {
      const onChoose = jest.fn();
      const { getByTestId } = baseRender({ onChoose });
      const addrSelect = getByTestId('gwf-input:address');
      const ddBtn = within(addrSelect).getByRole('button');
      fireEvent.click(ddBtn);
      fireEvent.mouseDown(ddBtn);
      const choice1 = defaultProps.choices[0].id;
      const selval = getByTestId(`gwf-input:address:${choice1}`);
      fireEvent.click(selval);
      expect(onChoose).toHaveBeenCalled();
    });
    it('invokes default on select', () => {
      const { getByTestId } = baseRender({});
      const addrSelect = getByTestId('gwf-input:address');
      const ddBtn = within(addrSelect).getByRole('button');
      fireEvent.click(ddBtn);
      fireEvent.mouseDown(ddBtn);
      const choice1 = defaultProps.choices[0].id;
      const selval = getByTestId(`gwf-input:address:${choice1}`);
      fireEvent.click(selval);
      expect(addrSelect).toBeTruthy();
    });
  });
});
