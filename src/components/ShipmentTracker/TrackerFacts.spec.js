import { renderWrap } from '@utils';
import TrackerFacts from './TrackerFacts';

describe('<TrackerFacts />', () => {
  const orderNumber = '123123';

  const facts = [
    { heading: 'Fulfillment Center', value: 'SDF1' },
    { heading: 'Total Packages', value: 2 },
  ];

  const defaultProps = { orderNumber, facts };

  const render = renderWrap(TrackerFacts, { defaultProps });

  test('it should render orderNumber', () => {
    const { getByText } = render();
    expect(getByText('Order #123123')).toBeTruthy();
  });

  test('it should render all facts as header = value', () => {
    const { getByText } = render();

    for (const fact of facts) {
      expect(getByText(fact.heading)).toBeTruthy();
      expect(getByText(fact.value)).toBeTruthy();
    }
  });

  const nils = [
    [{ heading: 'Fulfillment Center', value: undefined }],
    [{ heading: 'Fulfillment Center', value: null }],
    [{ heading: 'Fulfillment Center', value: '' }],
  ];

  for (const empty of nils) {
    const { value } = empty[0];
    describe(`with ${value} facts`, () => {
      test('it should render nothing', () => {
        const { getByTestId } = render({ facts: empty });
        const grid = getByTestId('tracker-facts:grid');
        expect(grid.childNodes).toHaveLength(0);
      });
    });
  }
});
