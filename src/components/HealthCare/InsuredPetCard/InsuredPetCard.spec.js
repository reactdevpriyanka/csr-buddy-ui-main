import { renderWrap } from '@utils';
import InsuredPetCard from '@/components/HealthCare/InsuredPetCard/InsuredPetCard';

const defaultProps = {
  pet: {
    id: 86905740,
    type: {
      id: 1,
      name: 'Dog',
    },
    name: 'PetOne',
    gender: 'FMLE',
    breed: {
      id: 370,
      name: 'Belgian Tervuren',
      type: {
        id: 1,
        name: 'Dog',
      },
    },
    petInsurancePolicies: [
      {
        policyVendor: 'Trupanion',
        policyId: 'P003040',
        policyStatus: 'Active',
        productType: 'Insurance',
        productName: 'Essential Plus Accident & Illness',
        total: 131.32,
      },
      {
        policyVendor: 'Trupanion',
        policyId: 'P003042',
        policyStatus: 'Active',
        productType: 'Wellness',
        productName: 'Wellness',
        total: 20,
      },
    ],
    petInsuranceTotal: 131.32,
  },
};

describe('<InsuredPetCard />', () => {
  const render = (props = {}) => renderWrap(InsuredPetCard, { defaultProps, ...props })();

  test('It should render an Insured Pet Card', () => {
    const { getByTestId } = render();
    expect(getByTestId('healthcare:pet-avatar')).toBeInTheDocument();
    expect(getByTestId('healthcare:pet-name:PetOne')).toBeInTheDocument();
    expect(getByTestId('healthcare:policy-vendor:Trupanion')).toBeInTheDocument();
    expect(getByTestId('healthcare:pet-id:86905740')).toBeInTheDocument();
    expect(getByTestId('healthcare:insurance-policy')).toHaveTextContent(
      'Essential Plus Accident & Illness',
    );
    expect(getByTestId('healthcare:wellness-plan')).toHaveTextContent('Wellness (P003042)');
    expect(getByTestId('healthcare:total')).toHaveTextContent('$131.32');
  });

  test('it should render Insured Pet Card with an insurance policy and no wellness plan', () => {
    const { getByTestId } = render({
      defaultProps: {
        pet: {
          petInsurancePolicies: [
            {
              policyVendor: 'Trupanion',
              policyId: 'P003040',
              policyStatus: 'Active',
              productType: 'Insurance',
              productName: 'Essential Plus Accident & Illness',
              total: 131.32,
            },
            {
              policyVendor: 'Trupanion',
              policyId: 'P003042',
              policyStatus: 'Cancelled',
              productType: 'Wellness',
              productName: 'Wellness',
              total: 20,
            },
          ],
          petInsuranceTotal: 131.32,
        },
      },
    });
    expect(getByTestId('healthcare:insurance-policy')).toHaveTextContent(
      'Essential Plus Accident & Illness',
    );
    expect(getByTestId('healthcare:wellness-plan')).toHaveTextContent('None');
  });

  test('it should render Insured Pet Card with a wellness plan and no insurance plan', () => {
    const { getByTestId } = render({
      defaultProps: {
        pet: {
          petInsurancePolicies: [
            {
              policyVendor: 'Trupanion',
              policyId: 'P003040',
              policyStatus: 'Cancelled',
              productType: 'Insurance',
              productName: 'Essential Plus Accident & Illness',
              total: 131.32,
            },
            {
              policyVendor: 'Trupanion',
              policyId: 'P003042',
              policyStatus: 'Active',
              productType: 'Wellness',
              productName: 'Wellness',
              total: 20,
            },
          ],
          petInsuranceTotal: 131.32,
        },
      },
    });
    expect(getByTestId('healthcare:insurance-policy')).toHaveTextContent('None');
    expect(getByTestId('healthcare:wellness-plan')).toHaveTextContent('Wellness (P003042)');
  });
});
