import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Typography, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useCustomer from '@/hooks/useCustomer';
import usePetProfile from '@/hooks/usePetProfile';
import { makeStyles } from '@material-ui/core/styles';
import AddPetProfile from '@components/CustomerSidebar/PetProfile/AddPetProfile';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.customerSidebarSubpanel,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: theme.utils.fromPx(12),
  },
  formContainer: {
    marginTop: theme.utils.fromPx(12),
    marginLeft: theme.utils.fromPx(24),
  },
  heading: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(20),
    lineHeight: theme.utils.fromPx(28),
    marginBottom: theme.utils.fromPx(5),
  },
  content: {
    height: theme.utils.fromPx(56),
  },
  selectPetId: {
    width: '90%',
  },
  searchIcon: {
    marginRight: `-${theme.spacing(3.5)}`,
  },
  footer: {
    borderTop: `1px solid #c0c0c0`,
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)}`,
    width: '100%',
  },
  cancelButton: {
    border: `${theme.utils.fromPx(2)} solid ${theme.palette.blue[800]}`,
    color: theme.palette.blue[800],
    minWidth: theme.utils.fromPx(96),
    marginLeft: theme.utils.fromPx(90),
    marginRight: theme.utils.fromPx(8),
  },
  nextButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.blue.dark,
    minWidth: theme.utils.fromPx(96),
    height: theme.utils.fromPx(42),
    marginLeft: theme.utils.fromPx(5),
    transition: `background-color 0.25s, opacity 0.25s`,
    '&[disabled]': {
      color: theme.palette.white,
      opacity: 0.2,
    },
    '&:hover': {
      backgroundColor: theme.palette.blue.dark,
      opacity: 0.75,
      transition: `background-color 0.25s, opacity 0.25s`,
    },
  },
}));

export default function EditPetProfile(props = {}) {
  const classes = useStyles();

  const router = useRouter();

  const { data: customer, error } = useCustomer();

  const { pets = [] } = customer || {};

  const petOptions = useMemo(() => pets.map((pet) => ({ id: pet.id, label: pet.name })), [pets]);

  const defaultPetOption = useMemo(() => {
    return (
      router.query.petId &&
      petOptions.length > 0 &&
      petOptions.find((p) => p.id === router.query.petId)
    );
  }, [router, petOptions]);

  const [selectedPet, setSelectedPet] = useState(defaultPetOption || null);

  const [nextClicked, setNextClicked] = useState(!!router.query.petId);

  const { data: pet } = usePetProfile(selectedPet?.id);

  useEffect(() => {
    // update the querystring with the current pet id
    if (selectedPet?.id && router.query.petId !== selectedPet.id) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, petId: selectedPet.id },
        },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [router, selectedPet]);

  const handleCancel = useCallback(() => {
    const query = { ...router.query };
    delete query.interactionPanel;
    delete query.petId;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...query,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [router]);

  const handleNext = useCallback(() => {
    setNextClicked(true);
  }, [setNextClicked]);

  if (error) {
    return null;
  }

  if (!customer) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div data-testid="edit-pet-profile" className={classes.formContainer}>
        <div className={classes.content}>
          <Typography variant="h3" className={classes.heading}>
            {'Select a pet to edit'}
          </Typography>
          <Autocomplete
            name="pet-profile:select"
            onChange={(event, value) => setSelectedPet(value)}
            value={selectedPet}
            data-testid="select-pet-profile"
            ListboxProps={{ style: { maxHeight: 190, overflow: 'auto' } }}
            className={classes.selectPetId}
            options={petOptions}
            getOptionLabel={(option) => option?.label?.toString()}
            renderOption={(option) => option?.label?.toString()}
            /* eslint-disable react/jsx-props-no-spreading */
            renderInput={(params) => (
              <TextField
                {...params}
                height="1.5rem"
                variant="outlined"
                placeholder="Select a pet to edit"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: <SearchIcon className={classes.searchIcon} />,
                }}
              />
            )}
          />
          {pet && nextClicked && <AddPetProfile petData={pet} edit />}
        </div>
      </div>
      {!nextClicked && (
        <div className={classes.footer}>
          <Button onClick={handleCancel} variant="outlined" className={classes.cancelButton}>
            {'Cancel'}
          </Button>
          <Button
            onClick={handleNext}
            variant="filled"
            className={classes.nextButton}
            disabled={!selectedPet}
          >
            {'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
