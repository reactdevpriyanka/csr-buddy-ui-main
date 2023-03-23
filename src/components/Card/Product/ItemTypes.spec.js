import { act, fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import ItemTypes from './ItemTypes';

describe('<ItemTypes />', () => {
  const render = (props = {}) =>
    renderWrap(ItemTypes, {
      defaultProps: props,
    })();

  test('should handle multiple item types', () => {
    const { queryByText, getByTestId } = render({
      bundleItem: true,
      tags: ['DISCONTINUED', 'OUT_OF_STOCK', 'FORCED_BACK_ORDER', 'DROPSHIP'],
    });

    // Verify the OUT_OF_STOCK tag is red (#BC2848)
    const outOfStockStyles = window.getComputedStyle(
      getByTestId('stickerContainer:product:itemtype:pill:OUT_OF_STOCK'),
    );
    expect(outOfStockStyles.color).toBe(`rgb(188, 40, 72)`);

    // Verify the DISCONTINUED tag is red (#BC2848)
    const discontinuedStyles = window.getComputedStyle(
      getByTestId('tooltip:stickerContainer:product:itemtype:pill:DISCONTINUED'),
    );
    expect(discontinuedStyles.color).toBe(`rgb(188, 40, 72)`);

    // Verify the FORCED_BACK_ORDER tag is red (#BC2848)
    const forcedBackorderStyles = window.getComputedStyle(
      getByTestId('stickerContainer:product:itemtype:pill:FORCED_BACK_ORDER'),
    );
    expect(forcedBackorderStyles.color).toBe(`rgb(188, 40, 72)`);

    expect(queryByText('BUNDLED ITEM')).toBeInTheDocument();
    expect(queryByText('DISCONTINUED ITEM')).toBeInTheDocument();
    expect(queryByText('OUT OF STOCK')).toBeInTheDocument();
    expect(queryByText('FORCED BACKORDER')).toBeInTheDocument();
    expect(queryByText('DROPSHIPPED ITEM')).toBeInTheDocument();
  });

  test('should render vet contact info for PHARMACY items', async () => {
    const { queryByText, findByTestId } = render({
      tags: ['PHARMACY'],
      vetContactInfo: {
        clinicName: 'Merwin Memorial Free Clinic for Animals',
        contactVet: 'true',
        petName: 'Norma',
        vetProfileId: '789',
      },
    });

    const sticker = queryByText('PHARMACY ITEM');

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    // Wait for the tooltip to show up
    const tooltipPetName = await findByTestId('tag:petName');
    expect(tooltipPetName).toHaveTextContent('Pet Name:');
    expect(tooltipPetName).toHaveTextContent('Norma');

    const tooltipClinicName = await findByTestId('tag:clinicName');
    expect(tooltipClinicName).toHaveTextContent('Clinic Name:');
    expect(tooltipClinicName).toHaveTextContent('Merwin Memorial Free Clinic for Animals');

    const tooltipVetContacted = await findByTestId('tag:vetContacted');
    expect(tooltipVetContacted).toHaveTextContent('Vet Contacted:');
    expect(tooltipVetContacted).toHaveTextContent('Yes');

    const tooltipVetProfile = await findByTestId('tag:vetProfileId');
    expect(tooltipVetProfile).toHaveTextContent('Vet Profile ID:');
    expect(tooltipVetProfile).toHaveTextContent('789');

    expect(sticker).toBeInTheDocument();
  });

  test('should render vet contact info tooltip for VET_DIET items', async () => {
    const { queryByText, findByText } = render({
      tags: ['VET_DIET'],
      vetContactInfo: {
        clinicName: 'Arlington Animal Clinic',
        petName: 'Abraham',
      },
    });

    const sticker = queryByText('VET DIET ITEM');

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    // Wait for the tooltip to show up
    const tooltipPetNameLabel = await findByText('Pet Name:');
    const tooltipPetNameValue = await findByText('Abraham');
    const tooltipClinicNameLabel = await findByText('Clinic Name:');
    const tooltipClinicNameValue = await findByText('Arlington Animal Clinic');

    expect(sticker).toBeInTheDocument();
    expect(tooltipPetNameLabel).toBeInTheDocument();
    expect(tooltipPetNameValue).toBeInTheDocument();
    expect(tooltipClinicNameLabel).toBeInTheDocument();
    expect(tooltipClinicNameValue).toBeInTheDocument();
  });

  test('should render info tooltip for DROPSHIP ITEM items', async () => {
    const { findByTestId } = render({
      tags: ['DROPSHIP'],
      minMaxDates: {
        maxDeliveryDate: '2022-04-08T07:00:00.333Z',
        minDeliveryDate: '2022-03-27T07:00:00.333Z',
      },
    });

    const sticker = await findByTestId('tooltip:stickerContainer:product:itemtype:pill:DROPSHIP');

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    const tag = await findByTestId('tag:minDeliveryDate');
    expect(tag).toHaveTextContent('Sun, Mar 27, 2022');
    expect(tag).toHaveTextContent('Fri, Apr 8, 2022');
  });

  test('should render info tooltip for DISCONTINUED ITEM items', async () => {
    const { findByTestId } = render({
      tags: ['DISCONTINUED'],
      product: {
        discontinueDate: '2022-04-08T07:00:00.333Z',
      },
    });

    const sticker = await findByTestId(
      'tooltip:stickerContainer:product:itemtype:pill:DISCONTINUED',
    );

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    const tag = await findByTestId('tag:discontinueDate');
    expect(tag).toHaveTextContent('Fri, Apr 8, 2022');
  });

  test('should render info tooltip for CONNECT WITH A VET items', async () => {
    const { findByTestId } = render({
      tags: ['CONNECT_WITH_A_VET'],
      vetContactInfo: {
        petName: 'Fred',
      },
      appointmentInfo: {
        id: '12345',
        reason: 'Becasue I said So!!!',
        endTime: '2022-04-08T07:00:00.333Z',
      },
    });

    const sticker = await findByTestId(
      'tooltip:stickerContainer:product:itemtype:pill:CONNECT_WITH_A_VET',
    );

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    const petName = await findByTestId('tag:petName');
    expect(petName).toHaveTextContent('Fred');

    const appointmentReason = await findByTestId('tag:appointmentReason');
    expect(appointmentReason).toHaveTextContent('Becasue I said So!!!');

    const appointmentId = await findByTestId('tag:appointmentId');
    expect(appointmentId).toHaveTextContent('12345');

    const appointmentEndTime = await findByTestId('tag:appointmentEndTime');
    expect(appointmentEndTime).toHaveTextContent('Fri, Apr 8, 2022');
  });

  test('should render info tooltip for PERSONALIZED items', async () => {
    const { findByTestId } = render({
      tags: ['PERSONALIZED'],
      product: {
        personalizationAttributeMap: {
          PersonalizedThumbnailUrl:
            'https://api.spectrumcustomizer.com/api/assets/generated/recipeset/readable/57K597CM/boho',
          RecipeSetId: '57K597CM',
        },
      },
    });

    const sticker = await findByTestId(
      'tooltip:stickerContainer:product:itemtype:pill:PERSONALIZED',
    );

    act(() => {
      fireEvent(sticker, new MouseEvent('mouseover', { bubbles: true }));
    });

    const personalizedThumbnailUrl = await findByTestId(
      'tag:personalized:PersonalizedThumbnailUrl',
    );
    expect(personalizedThumbnailUrl).toHaveTextContent(
      'https://api.spectrumcustomizer.com/api/assets/generated/recipeset/readable/57K597CM/boho',
    );

    const recipeSetId = await findByTestId('tag:personalized:RecipeSetId');
    expect(recipeSetId).toHaveTextContent('57K597CM');
  });
});
