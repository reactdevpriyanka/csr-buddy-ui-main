/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select as BaseSelect } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from './Icon';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.utils.fromPx(14)} 0`,
    width: '100%',
  },
}));

const useSelectStyles = makeStyles((theme) => ({
  root: {
    padding: '0 !important',
    '&:hover': {
      background: 'transparent !important',
    },
  },
}));

const Select = ({
  keyProp = 'id',
  labelProp = 'label',
  optionComponent: Option = MenuItem,
  options = [],
}) => {
  const classes = useStyles();

  const select = useSelectStyles();

  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState(options.length > 0 ? options[0] : null);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onChange = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue],
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <BaseSelect
      variant="outlined"
      className={classes.root}
      classes={select}
      IconComponent={() => <Icon onClick={openMenu} />}
      value={value}
      open={isOpen}
      onChange={onChange}
      renderValue={(value) => <Option onClick={openMenu}>{value[labelProp]}</Option>}
    >
      {options.map((option) => (
        <Option value={option} {...option} key={option[keyProp]} onClick={closeMenu}>
          {option[labelProp]}
        </Option>
      ))}
    </BaseSelect>
  );
};

Select.propTypes = {
  keyProp: PropTypes.string,
  labelProp: PropTypes.string,
  options: PropTypes.array,
  optionComponent: PropTypes.elementType,
};

export default Select;
