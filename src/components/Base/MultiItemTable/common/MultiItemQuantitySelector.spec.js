import { ThemeProvider } from '@material-ui/core/styles';
import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import theme from '@/theme';
import { ReplaceRefundContext } from '../ReplaceRefund/ReplaceRefundTable';
import MultiItemQuantitySelector from './MultiItemQuantitySelector';

const onUpdate = jest.fn();

const defaultProps = {
  max: 5,
  onUpdate,
  itemId: '123',
};

const defaultReturnState = {
  allSelected: false,
};

describe('<QuantitySelector />', () => {
  afterEach(() => {
    onUpdate.mockClear();
  });

  const renderQtySelector = ({ props = defaultProps, returnState = defaultReturnState } = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <ReplaceRefundContext.Provider value={returnState}>
          <MultiItemQuantitySelector {...props} />
        </ReplaceRefundContext.Provider>
      </ThemeProvider>,
    );
  };

  it('should increase quantity on plus button click', () => {
    const { queryByText, getByTestId } = renderQtySelector();
    expect(queryByText('0')).toBeInTheDocument();
    expect(queryByText('1')).not.toBeInTheDocument();

    fireEvent.click(getByTestId('gwf:multi-item-quantity-plus:123'));
    expect(queryByText('1')).toBeInTheDocument();

    expect(onUpdate).toHaveBeenCalledWith(1);
  });

  describe('when all items are selected', () => {
    it('should call the onUpdate prop with the max quantity', () => {
      renderQtySelector({ returnState: { allSelected: true } });
      expect(onUpdate).toHaveBeenCalledWith(5);
    });

    it('should have both buttons disabled', () => {
      const { getByTestId } = renderQtySelector({ returnState: { allSelected: true } });
      expect(getByTestId('gwf:multi-item-quantity-minus:123')).toBeDisabled();
      expect(getByTestId('gwf:multi-item-quantity-plus:123')).toBeDisabled();
    });
  });
});
