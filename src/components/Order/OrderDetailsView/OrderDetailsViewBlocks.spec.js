/* eslint-disable unicorn/prefer-dom-node-dataset */
import { renderWrap } from '@/utils';
import * as features from '@/features';
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { CardActions, Link } from '@material-ui/core';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsViewBlocks from './OrderDetailsViewBlocks';
import { snakeCaseToTitleCase } from '@/utils/string';

const defaultProps = {
  ...orderDetailsViewData,
};
jest.spyOn(global, 'setTimeout');

describe('<OrderDetailsViewBlocks />', () => {
  const render = renderWrap(OrderDetailsViewBlocks, { defaultProps });

  test('it should display the orderDetailsViewBlocksContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewBlocksContainer`)).toBeTruthy();
  });

  test('it should render an BLOCKS', () => {
    const { getByText } = render();
    expect(getByText('BLOCKS')).toBeInTheDocument();
  });

  test('it should render an View Blocks', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByText } = render();
    expect(getByText('View Blocks')).toBeInTheDocument();
  });

  it('should scroll to block history and apply styles', () => {
    const blockHistory = document.createElement('div');
    blockHistory.setAttribute('data-testid', 'orderDetailsViewBlockDetailsContainer');
    document.body.append(blockHistory);

    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    const { getByTestId } = render(
      <Link disableRipple>
        View Blocks
      </Link>
    );
    // Act
    act(() => {
      fireEvent.click(getByTestId('order:viewblock:link'));
      jest.advanceTimersByTime(3000);
    });

    const scrollToSpy = jest.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(blockHistory.style.outline).toBe('#1C49C2 1px solid');
    expect(blockHistory.style.marginTop).toBe('22px');
    expect(blockHistory.style.position).toBe('relative');
    expect(blockHistory.style.border.toUpperCase()).toBe('2PX SOLID #1C49C2');
    expect(blockHistory.style.transition).toBe('all 0.2s');
    expect(blockHistory.style.boxShadow).toBe('0px 0px 4px 2px rgb(28, 73, 194, 0.6)');
    expect(setTimeout).toHaveBeenCalledTimes(3);
  });
});
