import { renderWrap } from '@utils';
import EventTitle from './EventTitle';

describe('<EventTitle />', () => {
  const render = renderWrap(EventTitle);

  const renderWithTitle = (title) => render({ children: title });

  test('it should render children', () => {
    const { getByText } = renderWithTitle("Ozwald's Vet Appt.");
    expect(getByText("Ozwald's Vet Appt.")).toBeTruthy();
  });
});
