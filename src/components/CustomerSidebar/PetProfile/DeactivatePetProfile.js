import { useState, useMemo, useCallback } from 'react';
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
  TextField,
} from '@material-ui/core';
import useCustomer from '@/hooks/useCustomer';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@/components/Button';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import { useRouter } from 'next/router';
import { petDeactivateReason } from './petDeactivateReason';
import DeactivatePetDialog from './DeactivatePetDialog';

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
  headingText: {
    ...theme.fonts.h3,
    color: theme.palette.blue[800],
    marginBottom: theme.spacing(0.75),
  },
  selectPetId: {
    width: '100%',
  },
  formContainer: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    borderBottom: '1px solid #f5f5f5',
  },
  formControl1: {
    width: '300px',
    height: '45px',
    marginTop: '8px',
    marginBottom: `${theme.spacing(1.5)}`,
    border: '1px',
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
  },
  inputLabel: {
    marginLeft: '1px',
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
  },
  submitButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    width: '120px',
    height: '42px',
    marginLeft: '20px',
  },
  cancelButton: {
    color: '#333333',
    width: '90px',
    height: '42px',
    marginLeft: '90px',
  },
  buttonGrid: {
    backgroundColor: '#EEEEEE',
    position: 'fixed',
    bottom: 0,
    padding: '0.9500rem',
  },
  searchIcon: {
    marginRight: `-${theme.spacing(3.5)}`,
  },
}));

const DeactivatePetProfile = (props = {}) => {
  const classes = useStyles();

  const router = useRouter();

  const { id: customerId, petId } = useSanitizedRouter();

  const [newPetDeactivateReason, setNewPetDeactivateReason] = useState(null);

  const [openDeactivatePetDialog, setOpenDeactivatePetDialog] = useState(false);

  const { data: customer } = useCustomer();

  const { pets = [] } = customer;

  const petOptions = useMemo(() => pets.map((pet) => ({ id: pet.id, label: pet.name })), [pets]);

  const defaultPetOption = useMemo(() => {
    return petId && petOptions.length > 0 && petOptions.find((p) => p.id === petId);
  }, [router, petOptions]);

  const [selectedPet, setSelectedPet] = useState(defaultPetOption || null);

  const handlePetDeactivateReasonChange = (event) => {
    setNewPetDeactivateReason(event.target.value);
  };

  const handleDeactivatePet = () => {
    setOpenDeactivatePetDialog(true);
  };

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

  const handleOnCloseClick = useCallback((event) => {
    event.preventDefault();
    onClose();
  }, []);

  return (
    <div className={classes.root}>
      <Grid>
        <form
          data-testid="deactivate-pet-profile"
          className={classes.formContainer}
          onSubmit={(event) => event.preventDefault()}
        >
          <div data-testid="deactivate-pet-profile-title">
            <Typography className={classes.headingText}>{'Select a pet to edit'}</Typography>
            <Grid container rowSpacing={4}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1} variant="outlined">
                  <Autocomplete
                    name="pet-profile:select"
                    onChange={(event, value) => setSelectedPet(value)}
                    value={selectedPet}
                    data-testid="select-pet-profile"
                    options={petOptions}
                    getOptionLabel={(option) => option?.label?.toString()}
                    renderOption={(option) => option?.label?.toString()}
                    /* eslint-disable react/jsx-props-no-spreading */
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Pet Name"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <SearchIcon className={classes.searchIcon} />,
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Typography className={classes.headingText} data-testid="pet-deactive-reason">
                {petOptions.map((option) =>
                  option.id === petId ? `Why ${option.label} is being deactivated?` : null,
                )}
              </Typography>
              <Grid item xs={12}>
                <FormControl className={classes.formControl1} variant="outlined">
                  <InputLabel
                    className={classes.inputLabel}
                    required
                    shrink={newPetDeactivateReason && newPetDeactivateReason.length > 0}
                  >
                    {'Reason for Deactivation'}
                  </InputLabel>
                  <Select
                    data-testid="add-pet-retirement-reason"
                    value={newPetDeactivateReason}
                    required={true}
                    label="Retirement Reason"
                    onChange={handlePetDeactivateReasonChange}
                  >
                    {petDeactivateReason &&
                      petDeactivateReason.map((petDeactivateOptions) => (
                        <MenuItem
                          key={petDeactivateOptions.name}
                          value={petDeactivateOptions.name}
                          data-testid={`pet:deactivate-${petDeactivateOptions.value}`}
                        >
                          {petDeactivateOptions.value}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </form>
        <div>
          <Grid className={classes.buttonGrid}>
            <Button
              className={classes.cancelButton}
              data-testid="deactivate-pet-cancel"
              aria-label="Cancel"
              onClick={handleOnCloseClick}
            >
              Cancel
            </Button>
            <Button
              solid
              className={classes.submitButton}
              data-testid="deactivate-pet-submit"
              disabled={!newPetDeactivateReason}
              type="submit"
              aria-label="Save Pet"
              onClick={handleDeactivatePet}
            >
              Save Changes
            </Button>
          </Grid>
        </div>
      </Grid>
      {openDeactivatePetDialog && (
        <DeactivatePetDialog
          isOpen={openDeactivatePetDialog}
          openDialog={setOpenDeactivatePetDialog}
          customerId={customerId}
          petId={petId}
          newPetDeactivateReason={newPetDeactivateReason}
        />
      )}
    </div>
  );
};

DeactivatePetProfile.propTypes = {};

export default DeactivatePetProfile;
