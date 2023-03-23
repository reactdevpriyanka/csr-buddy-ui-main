import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { isValid } from 'date-fns';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  FormControl,
  TextField,
  OutlinedInput,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  Link,
  Chip,
} from '@material-ui/core';
import Button from '@/components/Button';
import { KeyboardDatePicker } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import usePetProfile from '@/hooks/usePetProfile';
import usePetType from '@/hooks/usePetType';
import usePetBreed from '@/hooks/usePetBreed';
import usePetMedication from '@/hooks/usePetMedication';
import usePetMedConditions from '@/hooks/usePetMedConditions';
import usePetMedAllergies from '@/hooks/usePetMedAllergies';
import List from '@material-ui/core/List';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { formatDateWithTimeNoTZ } from '@/utils';
import useAthena from '@/hooks/useAthena';
import usePetFoodAllergies from '@/hooks/usePetFoodAllergies';
import { FeatureFlag } from '@/features';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useCustomer from '@/hooks/useCustomer';
import { petGenderOption } from './petGender';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '28px',
    marginBottom: '5px',
    marginTop: '20px',
  },

  formContainer: {
    marginTop: theme.utils.fromPx(24),
    marginLeft: theme.utils.fromPx(24),
    marginBottom: theme.utils.fromPx(24),
    '&.edit': {
      marginLeft: 0,
    },
  },

  formControl: {
    marginTop: theme.spacing(4),
    marginLeft: '10px',
    marginBottom: '20px',
  },
  searchIcon: {
    marginRight: `-${theme.spacing(3.5)}`,
  },

  formControl1: {
    width: '300px',
    height: '50px',
    marginTop: '8px',
    marginBottom: `${theme.spacing(1.5)}`,
    border: '1px',
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
  },
  formControl2: {
    width: '300px',
    height: theme.utils.fromPx(56),
    marginBottom: '8px',
    marginTop: '4px',
    border: '1px',
  },

  inputLabel: {
    marginLeft: '15px',
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
    lineHeight: '0',
  },
  calendar: {
    marginBottom: '4px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '22px',
    marginTop: '20px',
  },

  chip: {
    backgroundColor: '#DBEBF9',
    color: theme.palette.primary.main,
    size: 'small',
    margin: theme.spacing(0.2),
  },

  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: theme.utils.fromPx(20),
  },

  petType: {
    height: theme.utils.fromPx(56),
  },

  deactivateButton: {
    width: '300px',
    height: '50px',
    marginTop: '8px',
    marginBottom: `${theme.spacing(1.5)}`,
    border: '1px',
    '&.solid': {
      color: '#BC2848',
      background: '#FDE4E8',
      '&:hover': {
        background: '#FDE4E8',
        color: '#BC2848',
      },
      border: `${theme.utils.fromPx(2)} solid #BC2848`,
    },
  },
  reactivateButton: {
    background: 'transparent',
    border: '0.0625rem solid #163977',
    borderRadius: '0.25rem',
    color: '#163977',
    fontWeight: '500',
    fontSize: '0.9rem',
    width: '300px',
    padding: theme.spacing(0.375, 0.75),
    textTransform: 'none',
    '&:not(:last-child)': {
      marginRight: '0.5rem',
    },
    '&.solidWhite': {
      color: theme.palette.blue.dark,
      background: 'white',
      '&:hover': {
        background: 'white',
        color: theme.palette.blue.dark,
      },
    },
  },
  reactivateButtonEnabled: {
    background: '#B8D7F3',
    border: '0.0625rem solid #163977',
    borderRadius: '0.25rem',
    color: '#163977',
    fontWeight: '500',
    fontSize: '0.9rem',
    width: '300px',
    padding: theme.spacing(0.375, 0.75),
    textTransform: 'none',
    '&:not(:last-child)': {
      marginRight: '0.5rem',
    },
  },

  footer: {
    borderTop: `1px solid #c0c0c0`,
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)}`,
    width: '100%',
    '&.edit': {
      marginLeft: theme.utils.fromPx(-24),
      width: `calc(100% + ${theme.utils.fromPx(24)})`,
    },
  },
  submitButton: {
    backgroundColor: theme.palette.primary.main,
    minWidth: theme.utils.fromPx(96),
    height: theme.utils.fromPx(42),
    marginLeft: theme.utils.fromPx(5),
  },
  cancelButton: {
    color: '#333333',
    minWidth: theme.utils.fromPx(96),
    height: theme.utils.fromPx(42),
    marginLeft: theme.utils.fromPx(90),
    marginRight: theme.utils.fromPx(8),
    border: `${theme.utils.fromPx(2)} solid ${theme.palette.blue[800]}`,
  },
}));

const AddPetProfile = ({ edit = false, petData = null }) => {
  const classes = useStyles();

  const router = useRouter();

  const { getLang } = useAthena(); // athena config

  const { id: customerId } = router.query;

  const onClose = useCallback(() => {
    const query = { ...router.query };

    delete query.interactionPanel;
    delete query.petId;

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  }, [router]);

  const [newPetName, setPetName] = useState();

  const { data: customerPetType } = usePetType();

  const [newPetType, setPetType] = useState('');

  const { data: customerPetMedication } = usePetMedication();

  const [newPetMedication, setNewPetMedication] = useState([]);

  const [inputPetMedication, setInputPetMedication] = useState([]);

  const { data: customerPetAllergies } = usePetMedAllergies();

  const [newPetAllergies, setPetAllergies] = useState([]);

  const [inputPetAllergies, setInputPetAllergies] = useState([]);

  const { data: customerPetHealthCondition } = usePetMedConditions();

  const [newPetHealthCondition, setPetHealthCondition] = useState([]);

  const [inputPetHealthCondition, setInputPetHealthCondition] = useState([]);

  const { data: customerPetFoodAllergies } = usePetFoodAllergies();

  const [newPetFoodAllergies, setPetFoodAllergies] = useState([]);

  const [inputPetFoodAllergies, setInputPetFoodAllergies] = useState([]);

  const [newPetBreed, setPetBreed] = useState(null);

  const [newPetGender, setPetGender] = useState(null);

  const [newPetWeight, setPetWeight] = useState(null);

  const [newBirthDate, setNewBirthDate] = useState(null);
  const [newBirthDateInputValue, setNewBirthDateInputValue] = useState(null);

  const [newAdoptionDate, setNewAdoptionDate] = useState(null);
  const [newAdoptionDateInputValue, setNewAdoptionDateInputValue] = useState(null);

  const [errors, setErrors] = useState({});

  const { data: customerPetBreed } = usePetBreed(newPetType?.id);

  const { createPetProfile, updatePetProfile, mutate: mutatePetProfile } = usePetProfile();

  const { mutate: mutateCustomerPetProfile } = useCustomer();

  const { data: petsData } = usePetProfile(petData?.id);

  const [newReactivateStatus, setReactivateStatus] = useState(false);

  const handleNewPetNameChange = (event) => {
    setPetName(event.target.value);
  };

  const handleNewBirthDateChange = (date, value) => {
    if (isValid(date)) {
      setNewBirthDate(formatDateWithTimeNoTZ(date));
    }
    setNewBirthDateInputValue(value);
  };

  const handleNewAdoptionDateChange = (date, value) => {
    if (isValid(date)) {
      setNewAdoptionDate(formatDateWithTimeNoTZ(date));
    }
    setNewAdoptionDateInputValue(value);
  };

  const handleOnCloseClick = useCallback((event) => {
    event.preventDefault();
    onClose();
  }, []);

  const handlePetBreedChange = useCallback(
    (event, newInputValue) => {
      setPetBreed(newInputValue);
    },
    [setPetBreed],
  );

  const handlePetTypeChange = useCallback(
    (event) => {
      setPetType(event.target.value);
      if (newPetBreed && !isEqual(event.target.value, newPetBreed.type)) {
        setPetBreed(null);
      }
    },
    [setPetType, setPetBreed, newPetBreed],
  );

  const handlePetGenderChange = (event) => {
    setPetGender(event.target.value);
  };

  const handlePetWeightChange = (event) => {
    const { value } = event.target;
    const weight = Number.parseFloat(value);

    if (value === '') {
      // handles both blank and NaN
      setPetWeight(null);
      setErrors((prevErrors) => ({
        ...prevErrors,
        petWeight: 'Weight is a required field.',
      }));
    } else if (weight < 1) {
      // for Suzzie parity
      setErrors((prevErrors) => ({
        ...prevErrors,
        petWeight: 'Weight must be greater than or equal to 1.',
      }));
    } else {
      setPetWeight(weight);
      setErrors((prevErrors) => {
        const { petWeight, ...nextErrors } = prevErrors;
        return nextErrors;
      });
    }
  };

  const handlePetMedicationChange = (event, newValue) => {
    setNewPetMedication([...newValue]);
  };

  const handlePetHealthConditionChange = (event, newValue) => {
    setPetHealthCondition([...newValue]);
  };

  const handlePetAllergiesChange = (event, newValue) => {
    setPetAllergies([...newValue]);
  };

  const handlePetFoodAllergiesChange = (event, newValue) => {
    setPetFoodAllergies([...newValue]);
  };

  const { enqueueSnackbar } = useSnackbar();

  const { captureInteraction } = useAgentInteractions();

  const handleCreatePetProfile = useCallback(() => {
    const operation = edit ? updatePetProfile : createPetProfile;

    const data = {
      name: newPetName,
      type: newPetType,
      weightInPounds: newPetWeight,
      gender: newPetGender,
      breed: newPetBreed,
      adoptionDate: newAdoptionDate,
      birthday: newBirthDate,
      medicationAllergies: newPetAllergies,
      medications: newPetMedication,
      existingMedicalConditions: newPetHealthCondition,
      allergies: newPetFoodAllergies,
    };

    if (newReactivateStatus) {
      data.status = 'ACTIVE';
    }

    if (edit) {
      data.id = petData?.id;
    }

    const params = { customerId, data };

    if (edit) {
      params.petId = petData.id;
    }

    operation(params)
      .then((response) => {
        if (!edit) {
          // add pet id from response in case of create
          data.id = response.data;
        }
        mutatePetProfile();
        captureInteraction({
          type: 'PET_PROFILE_UPDATED',
          subjectId: data.id,
          action: edit ? 'UPDATE' : 'CREATE',
          currentVal: data,
          prevVal: petsData || {},
        });
      })
      .then(() => {
        mutateCustomerPetProfile();
        onClose();
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Success! Pet profile for ${newPetName} has been ${
            newReactivateStatus ? 'reactivated' : edit ? 'updated' : 'added'
          }`,
        });
      })
      .catch((error) => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to ${edit ? 'update' : 'create'} the pet profile.`,
        });
      });
  }, [
    edit,
    createPetProfile,
    updatePetProfile,
    petsData,
    mutatePetProfile,
    mutateCustomerPetProfile,
  ]);

  const [showPetMedication, setshowPetMedication] = useState(false);

  const handleMedicationDropdown = () => {
    setshowPetMedication(true);
  };

  const [showAllergyDropdown, setshowAllergyDropdown] = useState(false);

  const handleMedicationAllergy = () => {
    setshowAllergyDropdown(true);
  };

  const [showPetHealth, setshowPetHealth] = useState();

  const handleHealthMedicationDropdown = () => {
    setshowPetHealth(true);
  };

  const [showPetFoodAllergies, setshowPetFoodAllergies] = useState(false);

  const handleFoodAllergiesDropdown = () => {
    setshowPetFoodAllergies(true);
  };

  const handleReactivatePetButton = () => {
    setReactivateStatus(true);
  };

  useEffect(() => {
    if (!edit || petData === null) {
      return;
    }

    setPetName(petData.name);
    setPetType(petData.type);
    setPetBreed(petData.breed);
    setPetGender(petData.gender);
    setPetWeight(petData.weightInPounds);
    if (petData.birthday) {
      handleNewBirthDateChange(new Date(petData.birthday));
    }
    if (petData.adoptionDate) {
      handleNewAdoptionDateChange(new Date(petData.adoptionDate));
    }
    if (petData.medications) {
      setNewPetMedication(petData.medications);
    }
    if (petData.allergies) {
      setPetFoodAllergies(petData.allergies);
    }
    if (petData.medicationAllergies) {
      setPetAllergies(petData.medicationAllergies);
    }
    if (petData.existingMedicalConditions) {
      setPetHealthCondition(petData.existingMedicalConditions);
    }
  }, [edit, petData]);

  const onDeactivateButtonClick = useCallback(
    (event) => {
      event.preventDefault();
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, interactionPanel: 'deactivatePetProfile' },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const isPetDataChange = useCallback(() => {
    return (
      (newPetName && petsData.name !== newPetName) ||
      (newPetType && petsData.type !== newPetType) ||
      (newPetBreed && petsData.breed !== newPetBreed) ||
      (newAdoptionDate && petsData.adoptionDate !== newAdoptionDate) ||
      (newBirthDate && petsData.birthday !== newBirthDate) ||
      (newPetGender && petsData.gender !== newPetGender) ||
      (newPetWeight && petsData.weightInPounds !== newPetWeight) ||
      ((newPetFoodAllergies || []).length > 0 &&
        !isEqual(petsData.allergies, newPetFoodAllergies)) ||
      ((newPetAllergies || []).length > 0 &&
        !isEqual(petsData.medicationAllergies, newPetAllergies)) ||
      ((newPetMedication || []).length > 0 && !isEqual(petsData.medications, newPetMedication)) ||
      ((newPetHealthCondition || []).length > 0 &&
        !isEqual(petsData.existingMedicalConditions, newPetHealthCondition)) ||
      (newReactivateStatus && petsData.status !== newReactivateStatus)
    );
  }, [
    petsData,
    newPetName,
    newPetType,
    newPetBreed,
    newAdoptionDate,
    newBirthDate,
    newPetAllergies,
    newPetGender,
    newPetWeight,
    newPetMedication,
    newPetHealthCondition,
    newPetFoodAllergies,
    newReactivateStatus,
  ]);

  const shouldDisableSaveBtn = useMemo(() => {
    if (edit) {
      return !isPetDataChange() || !(newPetType && newPetWeight && newPetName);
    }
    return !(newPetType && newPetWeight && newPetName);
  }, [isPetDataChange, edit, newPetType, newPetWeight, newPetName]);

  const petNameField = (
    <Grid item xs={12}>
      <FormControl className={classes.formControl1}>
        <TextField
          className={classes.formControl1}
          required
          variant="outlined"
          label="Pet Name"
          value={newPetName}
          data-testid="add-pet-name"
          onChange={handleNewPetNameChange}
          inputProps={<OutlinedInput notched label="Pet Name" />}
          placeholder="Pet Name"
        />
      </FormControl>
    </Grid>
  );

  return (
    <div>
      <form
        data-testid="add-pet-profile"
        className={cn(classes.formContainer, edit && 'edit')}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={classes.contentContainer}>
          {!edit && (
            <Typography
              variant="h2"
              className={classes.root}
              data-testid="customer-interaction-add-a-pet"
            >
              {getLang('AddPetText', { fallback: 'Add a Pet' })}
            </Typography>
          )}
          <div>
            <Grid container rowSpacing={4}>
              {!edit && petNameField}
              <Typography
                variant="h2"
                className={classes.root}
                data-testid="pet-general-information"
              >
                {getLang('petGeneralInformationLabel', { fallback: 'General Information' })}
              </Typography>
              {edit && petNameField}
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  <InputLabel className={classes.inputLabel} data-testid="pet-type-label" required>
                    {getLang('addPetTypeLabel', { fallback: 'Pet Type' })}
                  </InputLabel>
                  <Select
                    className={classes.petType}
                    variant="outlined"
                    data-testid="add-pet-type"
                    value={newPetType}
                    required={true}
                    onChange={handlePetTypeChange}
                    label="Pet Type"
                    renderValue={(value) => (
                      <MenuItem data-testid="pet:type-value">{value.name}</MenuItem>
                    )}
                  >
                    {customerPetType &&
                      customerPetType.map((petTypes) => (
                        <MenuItem
                          key={petTypes.id}
                          value={petTypes}
                          data-testid={`pet:type-${petTypes.name}`}
                        >
                          {petTypes.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  <Autocomplete
                    className={classes.formControl2}
                    value={newPetBreed}
                    onChange={handlePetBreedChange}
                    options={customerPetBreed || []}
                    getOptionLabel={(petBreeds) => petBreeds.name}
                    getOptionSelected={(option, value) => value && option.id === value.id}
                    /* eslint-disable react/jsx-props-no-spreading */
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pet Breed"
                        variant="outlined"
                        data-testid="add-pet-breed"
                        placeholder="Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <SearchIcon className={classes.searchIcon} />,
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  {!edit ? (
                    <InputLabel
                      className={classes.inputLabel}
                      shrink={newPetGender && newPetGender.length > 0}
                    >
                      {getLang('addPetGenderLabel', { fallback: 'Sex' })}
                    </InputLabel>
                  ) : (
                    <InputLabel className={classes.inputLabel} shrink>
                      {getLang('addPetGenderLabel', { fallback: 'Sex' })}
                    </InputLabel>
                  )}
                  <Select
                    className={classes.petGender}
                    variant="outlined"
                    data-testid="add-pet-gender"
                    value={newPetGender ?? ''}
                    onChange={handlePetGenderChange}
                    label="Sex"
                  >
                    {petGenderOption &&
                      petGenderOption.map((petGenders) => (
                        <MenuItem
                          key={petGenders.name}
                          value={petGenders.value}
                          data-testid={`pet:gender-${petGenders.name}`}
                        >
                          {petGenders.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  <TextField
                    className={classes.petWeight}
                    required={true}
                    label="Weight"
                    type="number"
                    variant="outlined"
                    data-testid="add-pet-weight"
                    value={newPetWeight}
                    onChange={handlePetWeightChange}
                    InputLabelProps={<OutlinedInput notched label="Weight" />}
                    error={!!errors.petWeight}
                    helperText={errors.petWeight || ' ' /* keep field height consistent */}
                    placeholder="0.00 lbs"
                  />
                </FormControl>
              </Grid>
              <Typography className={classes.calendar} data-testid="pet-birth-date">
                {getLang('addBirthDateLabel', { fallback: 'Birth Date' })}
              </Typography>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  <KeyboardDatePicker
                    value={newBirthDate}
                    inputValue={newBirthDateInputValue}
                    onChange={handleNewBirthDateChange}
                    variant="inline"
                    label="Birth Day"
                    format="MM-dd-yyyy"
                    placeholder="MM-DD-YYYY"
                    inputVariant="outlined"
                    autoOk={true}
                    data-testid="birth-date"
                    className={classes.birthday}
                  />
                </FormControl>
              </Grid>
              <Typography className={classes.calendar} data-testid="pet-adoption-date">
                {getLang('petAdopDateLabel', { fallback: 'Adoption Date' })}
              </Typography>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1}>
                  <KeyboardDatePicker
                    value={newAdoptionDate}
                    inputValue={newAdoptionDateInputValue}
                    onChange={handleNewAdoptionDateChange}
                    variant="inline"
                    label="Adoption Day"
                    format="MM-dd-yyyy"
                    placeholder="MM-DD-YYYY"
                    inputVariant="outlined"
                    autoOk={true}
                    data-testid="adoption-date"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <Typography className={classes.calendar} data-testid="pet-medication">
                    {getLang('addAnyMedicationText', { fallback: 'Any Medication?' })}
                  </Typography>
                  <div>
                    {!showPetMedication && (
                      <Link onClick={handleMedicationDropdown}>
                        {getLang('petMedText', { fallback: '+ Add a medication' })}
                      </Link>
                    )}
                    {showPetMedication && (
                      <Autocomplete
                        renderTags={() => null}
                        value={newPetMedication}
                        onChange={handlePetMedicationChange}
                        inputValue={inputPetMedication}
                        onInputChange={(event, newInputValue) => {
                          setInputPetMedication(newInputValue);
                        }}
                        options={customerPetMedication}
                        getOptionLabel={(petMed) => petMed.name}
                        getOptionSelected={(option, value) => value && option.id === value.id}
                        multiple
                        className={classes.formControl2}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Prescription Medication"
                            variant="outlined"
                            data-testid="add-pet-medication"
                            placeholder="Choose Medication"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: <SearchIcon className={classes.searchIcon} />,
                            }}
                          />
                        )}
                      />
                    )}
                    <List>
                      {(newPetMedication || []).map((petMed) => (
                        <Chip
                          className={classes.chip}
                          label={petMed.name}
                          key={petMed.id}
                          data-testid={`pet-medicationchip-${petMed.name}`}
                          aria-label="delete"
                          onDelete={() => {
                            setNewPetMedication(() => newPetMedication.filter((h) => h !== petMed));
                          }}
                        />
                      ))}
                    </List>
                  </div>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography className={classes.calendar} data-testid="pet-food-allergies">
                  {getLang('addFoodAllergiesLabel', { fallback: 'Any Food Allergies?' })}
                </Typography>
                <FormControl>
                  <div>
                    {!showPetFoodAllergies && (
                      <Link onClick={handleFoodAllergiesDropdown}>
                        {getLang('petFoodAllergiesText', {
                          fallback: '+ Add a food allergy',
                        })}
                      </Link>
                    )}
                    {showPetFoodAllergies && (
                      <Autocomplete
                        renderTags={() => null}
                        value={newPetFoodAllergies}
                        onChange={handlePetFoodAllergiesChange}
                        inputValue={inputPetFoodAllergies}
                        onInputChange={(event, newInputValue) => {
                          setInputPetFoodAllergies(newInputValue);
                        }}
                        options={customerPetFoodAllergies}
                        getOptionLabel={(petFoodAllergy) => petFoodAllergy.name}
                        getOptionSelected={(option, value) => value && option.id === value.id}
                        multiple
                        className={classes.formControl2}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pet Food Allergies"
                            variant="outlined"
                            data-testid="add-pet-food-allergy"
                            placeholder="Choose Food Allergies"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: <SearchIcon className={classes.searchIcon} />,
                            }}
                          />
                        )}
                      />
                    )}
                    <List>
                      {newPetFoodAllergies.map((petFoodAllergy) => (
                        <Chip
                          className={classes.chip}
                          label={petFoodAllergy.name}
                          key={petFoodAllergy.id}
                          aria-label="delete"
                          data-testid={`pet-foodallergychip-${petFoodAllergy.name}`}
                          onDelete={() => {
                            setPetFoodAllergies(() =>
                              newPetFoodAllergies.filter((h) => h !== petFoodAllergy),
                            );
                          }}
                        />
                      ))}
                    </List>
                  </div>
                </FormControl>
              </Grid>
              <Grid container rowSpacing={4}>
                <Typography className={classes.calendar} data-testid="pet-allergies">
                  {getLang('anyAllergyLabel', { fallback: 'Any Medication Allergies?' })}
                </Typography>
                <Grid item xs={12}>
                  <FormControl>
                    <div display="grid">
                      {!showAllergyDropdown && (
                        <Link onClick={handleMedicationAllergy}>
                          {getLang('petAllergyText', { fallback: '+ Add a medication allergy' })}
                        </Link>
                      )}
                      {showAllergyDropdown && (
                        <Autocomplete
                          renderTags={() => null}
                          value={newPetAllergies}
                          onChange={handlePetAllergiesChange}
                          inputValue={inputPetAllergies}
                          onInputChange={(event, newInputValue) => {
                            setInputPetAllergies(newInputValue);
                          }}
                          options={customerPetAllergies}
                          getOptionLabel={(petAllergies) => petAllergies.name}
                          getOptionSelected={(option, value) => value && option.id === value.id}
                          multiple
                          className={classes.formControl2}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pet Allergies"
                              variant="outlined"
                              data-testid="add-pet-allergies"
                              placeholder="Choose Allergies"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: <SearchIcon className={classes.searchIcon} />,
                              }}
                            />
                          )}
                        />
                      )}
                      <List>
                        {newPetAllergies.map((petAllergies) => (
                          <Chip
                            className={classes.chip}
                            label={petAllergies.name}
                            key={petAllergies.id}
                            aria-label="delete"
                            data-testid={`pet-medallergychip-${petAllergies.name}`}
                            onDelete={() => {
                              setPetAllergies(() =>
                                newPetAllergies.filter((a) => a !== petAllergies),
                              );
                            }}
                          />
                        ))}
                      </List>
                    </div>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.calendar} data-testid="pet-health-condition">
                    {getLang('addHealthLabel', { fallback: 'Any Health Conditions?' })}
                  </Typography>

                  <FormControl>
                    <div>
                      {!showPetHealth && (
                        <Link onClick={handleHealthMedicationDropdown}>
                          {getLang('petHealthText', {
                            fallback: '+ Add a health condition',
                          })}
                        </Link>
                      )}
                      {showPetHealth && (
                        <Autocomplete
                          renderTags={() => null}
                          value={newPetHealthCondition}
                          onChange={handlePetHealthConditionChange}
                          inputValue={inputPetHealthCondition}
                          onInputChange={(event, newInputValue) => {
                            setInputPetHealthCondition(newInputValue);
                          }}
                          options={customerPetHealthCondition}
                          getOptionLabel={(petHealthMed) => petHealthMed.name}
                          getOptionSelected={(option, value) => value && option.id === value.id}
                          multiple
                          className={classes.formControl2}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pet Health Conditions"
                              variant="outlined"
                              data-testid="add-pet-health"
                              placeholder="Choose Health Conditions"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: <SearchIcon className={classes.searchIcon} />,
                              }}
                            />
                          )}
                        />
                      )}
                      <List>
                        {newPetHealthCondition.map((petHealth) => (
                          <Chip
                            className={classes.chip}
                            label={petHealth.name}
                            key={petHealth.id}
                            aria-label="delete"
                            data-testid={`pet-healthcondchip-${petHealth.name}`}
                            onDelete={() => {
                              setPetHealthCondition(() =>
                                newPetHealthCondition.filter((h) => h !== petHealth),
                              );
                            }}
                          />
                        ))}
                      </List>
                    </div>
                  </FormControl>
                </Grid>
                <FeatureFlag flag="feature.petProfile.deactivatePetEnabled">
                  {edit && petsData.status === 'ACTIVE' && (
                    <Button
                      solid
                      className={classes.deactivateButton}
                      data-testid="deactivate-pet"
                      type="submit"
                      aria-label="Deactivate Pet"
                      onClick={onDeactivateButtonClick}
                    >
                      Deactivate Pet
                    </Button>
                  )}
                </FeatureFlag>
                <FeatureFlag flag="feature.petProfile.reActivatePetEnabled">
                  {edit && petsData.status === 'INACTIVE' && (
                    <Button
                      outline
                      className={
                        newReactivateStatus === true
                          ? classes.reactivateButtonEnabled
                          : classes.reactivateButton
                      }
                      data-testid="reactivate-pet"
                      type="submit"
                      aria-label="reactivate Pet"
                      onClick={handleReactivatePetButton}
                    >
                      Reactivate Pet
                    </Button>
                  )}
                </FeatureFlag>
              </Grid>
            </Grid>
          </div>
        </div>
      </form>
      <div className={cn(classes.footer, { edit })}>
        <Button
          className={classes.cancelButton}
          data-testid="add-new-pet-cancel"
          aria-label="Cancel"
          onClick={handleOnCloseClick}
        >
          {getLang('petCancelBtn', { fallback: 'Cancel' })}
        </Button>
        <Button
          solid
          className={classes.submitButton}
          data-testid="add-new-pet-submit"
          disabled={shouldDisableSaveBtn}
          type="submit"
          aria-label="Save Pet"
          onClick={handleCreatePetProfile}
        >
          {getLang('saveAPetBtn', { fallback: 'Save Pet' })}
        </Button>
      </div>
    </div>
  );
};

AddPetProfile.propTypes = {
  edit: PropTypes.bool,
  petData: PropTypes.object,
};

export default AddPetProfile;
