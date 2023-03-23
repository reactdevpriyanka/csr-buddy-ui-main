import { renderWrap } from '@utils';
import ConcessionDetailRow from './ConcessionDetailRow';

const renderDetails = renderWrap(ConcessionDetailRow);

describe('<ConcessionDetailRow />', () => {
  it('should render null if no details given', () => {
    const { container } = renderDetails();
    expect(container).toBeEmptyDOMElement();
  });

  it('should render details when given', () => {
    const details = [
      { label: 'Label1', value: 'Value1' },
      { label: 'Label2', value: 'Value2' },
    ];
    const { queryByText } = renderDetails({ details });
    expect(queryByText('Label1')).toBeInTheDocument();
    expect(queryByText('Value2')).toBeInTheDocument();
  });
});
