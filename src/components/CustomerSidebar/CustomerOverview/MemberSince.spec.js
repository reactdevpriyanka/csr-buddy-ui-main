import { renderWrap } from '@utils';
import MemberSince from './MemberSince';

describe('<MemberSince />', () => {
  const defaultProps = {
    children: '2021-12-07 09:43:20',
  };

  const render = renderWrap(MemberSince);

  test('it should not render NaN for a date', () => {
    const { getByText } = render(defaultProps);
    expect(getByText('Customer Since 2021')).toBeInTheDocument();
  });

  it('renders empty if no props are provided', () => {
    const { container } = render({});
    expect(container).toBeEmptyDOMElement();
  });
});
