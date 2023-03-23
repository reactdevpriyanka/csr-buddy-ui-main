import { getDayDateTimeTimezone, renderWrap } from '@/utils';
import { useRouter } from 'next/router';
import orderDetailsReturnsData from '__mock__/orderdetails/orderdetails-returns';
import OrderDetailsViewReturns from './OrderDetailsViewReturns';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '5555',
    customerId: '12345',
  },
});

const defaultProps = {
  returns: orderDetailsReturnsData.returns,
  itemMap: orderDetailsReturnsData.itemMap,
};

describe('<OrderDetailsViewReturns />', () => {
  const render = renderWrap(OrderDetailsViewReturns, { defaultProps });

  test('it should display the orderDetailsViewReturnsContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewReturnsContainer`)).toBeTruthy();
  });

  describe('Returns', () => {
    test('it should display Refunds', () => {
      const { getByTestId } = render();
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:title`),
      ).toHaveTextContent(`Refund(9d77052f-d6de-46de-84b5-1ff24c505eba)`);
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:timecreated`),
      ).toHaveTextContent(getDayDateTimeTimezone('2022-06-14T13:35:07.877720Z'));
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:timeupdated`),
      ).toHaveTextContent(getDayDateTimeTimezone('2022-06-14T13:35:09.149120Z'));
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:numofitems`),
      ).toHaveTextContent(`1`);
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:totalcredit`),
      ).toHaveTextContent(`$25.20`);
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:status`),
      ).toHaveTextContent(`Receive Wait`);
      expect(
        getByTestId(
          `return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:item:1493892740:productname`,
        ),
      ).toHaveTextContent(
        `Pedigree Choice Cuts in Gravy Country Stew Canned Dog Food, 13.2-oz, case of 12`,
      );
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:item:1493892740:reason`),
      ).toHaveTextContent(`OTHER`);
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:item:1493892740:qty`),
      ).toHaveTextContent(`2`);
      expect(
        getByTestId(`return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:item:1493892740:sendback`),
      ).toHaveTextContent(`Y`);
      expect(
        getByTestId(
          `return:REFUND:9d77052f-d6de-46de-84b5-1ff24c505eba:item:1493892740:shelterdonation`,
        ),
      ).toHaveTextContent(`Y`);
    });

    test('it should display Replacements', () => {
      const { getByTestId } = render();

      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:title`),
      ).toHaveTextContent(`Replacement(196482d7-7c4f-4f11-b5fb-621ab2dd9d75)`);
      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:timecreated`),
      ).toHaveTextContent(getDayDateTimeTimezone('2021-09-16T22:04:16.645454Z'));
      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:timeupdated`),
      ).toHaveTextContent(getDayDateTimeTimezone('2021-10-07T07:18:04.967162Z'));
      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:numofitems`),
      ).toHaveTextContent(`1`);
      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:status`),
      ).toHaveTextContent(`Receive Wait`);
      expect(
        getByTestId(
          `return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:item:1493892742:productname`,
        ),
      ).toHaveTextContent(`KONG Cozie Marvin the Moose Plush Dog Toy, Medium`);
      expect(
        getByTestId(
          `return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:item:1493892742:reason`,
        ),
      ).toHaveTextContent(`DOES_NOT_WANT`);
      expect(
        getByTestId(`return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:item:1493892742:qty`),
      ).toHaveTextContent(`5`);
      expect(
        getByTestId(
          `return:REPLACEMENT:196482d7-7c4f-4f11-b5fb-621ab2dd9d75:item:1493892742:sendback`,
        ),
      ).toHaveTextContent(`Y`);
    });

    test('it should display Concession', () => {
      const { getByTestId } = render();

      expect(
        getByTestId(`return:CONCESSION:bbe71e74-bd4b-45b2-abac-c74fc9221ffd:title`),
      ).toHaveTextContent(`Concession(bbe71e74-bd4b-45b2-abac-c74fc9221ffd)`);
      expect(
        getByTestId(`return:CONCESSION:bbe71e74-bd4b-45b2-abac-c74fc9221ffd:timecreated`),
      ).toHaveTextContent(getDayDateTimeTimezone('2021-08-13T18:12:53.824948Z'));
      expect(
        getByTestId(`return:CONCESSION:bbe71e74-bd4b-45b2-abac-c74fc9221ffd:totalcredit`),
      ).toHaveTextContent(`$94.49`);
      expect(
        getByTestId(`return:CONCESSION:bbe71e74-bd4b-45b2-abac-c74fc9221ffd:status`),
      ).toHaveTextContent(`Pay Wait`);
      expect(
        getByTestId(
          `return:CONCESSION:bbe71e74-bd4b-45b2-abac-c74fc9221ffd:item:1493892739:reason`,
        ),
      ).toHaveTextContent(`DAMAGED`);
    });
  });
});
