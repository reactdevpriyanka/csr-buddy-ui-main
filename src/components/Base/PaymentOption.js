import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { InputLabel } from '@material-ui/core';
import Select, { CardOption } from '@components/Select';

const PaymentOption = ({
  choices,
  name,
  id,
  title,
  value: defaultValue = '',
  onChoose = () => {},
}) => {
  const [value, setValue] = useState(defaultValue);

  const options = useMemo(() => {
    return choices.map((choice) => {
      return {
        ...(choice.id && { id: choice.id }),
        label: choice.label,
        type: choice.paymentMethod,
        value: choice,
        disabled: choice.disabled || false,
      };
    });
  }, [choices]);

  // TODO: Eventually when we get the real data format from the backend we
  //       will nead to convert the choices like this:
  // const options2 = useMemo(() => {
  //   return choices.map((choice) => {
  //     // eslint-disable-next-line unicorn/prefer-ternary
  //     if (choice.type === "CARD") {
  //       return {
  //         value: choice.card.accountNumber,
  //         label: `Payment ending in ${choice.card.accountNumber}`,
  //         payMentMethod: choice.card.type
  //       }
  //     } else {
  //       return {
  //         value: choice.service.accountEmail,
  //         label: `Paid via PayPal with ${choice.service.accountEmail}`,
  //         payMentMethod: choice.service.serviceName
  //       }
  //     }
  //   });
  // }, [choices]);

  const onChange = useCallback(
    (event) => {
      setValue(event.target.value);
      onChoose();
    },
    [setValue, onChoose],
  );

  return (
    <>
      {title && <InputLabel htmlFor={id}>{title}</InputLabel>}
      {/* <Select name={name} labelId={id} value={value} onChange={onChange}>
        {choices.map(({ label, value, paymentMethod, disabled = false }) => (
          <CardOption key={`${id}-${value}`} type={paymentMethod} value={value} label={label} disabled={disabled} />
        ))}
      </Select> */}

      <Select
        optionComponent={CardOption}
        options={options}
        name={name}
        labelId={id}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

PaymentOption.propTypes = {
  choices: PropTypes.array,
  title: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChoose: PropTypes.func,
  value: PropTypes.any,
};

export default PaymentOption;
