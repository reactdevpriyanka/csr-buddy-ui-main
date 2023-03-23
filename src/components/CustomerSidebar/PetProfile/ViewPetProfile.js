import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, FormLabel } from '@material-ui/core';
import usePetProfile from '@/hooks/usePetProfile';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { formatRescheduleDate } from '@/utils';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import { petWeightType } from '@components/CustomerSidebar/PetProfile/petWeightType';
import CopiedIcon from '@icons/check-outline.svg';
import PetAge from '@components/CustomerSidebar/PetProfile/PetAge';
import { FeatureFlag } from '@/features';
import useAthena from '@/hooks/useAthena';
import { petGenderOption } from './petGender';

const COPIED_ICON_TIMEOUT_MS = 1000;

const copiedIcon = {
  true: CopiedIcon,
  false: function empty() {
    return <span />;
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.customerSidebarSubpanel,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: theme.utils.fromPx(12),
  },
  content: {
    marginLeft: theme.utils.fromPx(24),
    width: theme.utils.fromPx(330),
  },
  header: {
    display: 'inline-flex',
  },
  headingText: {
    ...theme.fonts.h3,
    color: theme.palette.blue[800],
    marginBottom: theme.spacing(0.75),
  },
  footer: {
    borderTop: `1px solid #c0c0c0`,
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(24)}`,
    marginTop: theme.utils.fromPx(24),
    width: '100%',
  },
  backButton: {
    color: theme.palette.blue[800],
    border: `${theme.utils.fromPx(2)} solid ${theme.palette.blue[800]}`,
    marginRight: theme.utils.fromPx(8),
    minWidth: theme.utils.fromPx(91),
  },
  editButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.blue.dark,
    minWidth: theme.utils.fromPx(91),
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
  detail: {
    display: 'inline-flex',
  },
  label: {
    width: theme.utils.fromPx(160),
    display: 'inline-block',
  },
  value: {
    display: 'inline-flex',
    width: theme.utils.fromPx(160),
    height: theme.utils.fromPx(20),
    color: (props) => props.valueColor || '#121212',
    marginBottom: theme.spacing(0.5),
    fontWeight: '400',
  },
  copiedSpan: {
    display: 'flex',
    marginTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(5),
    flexDirection: 'row',
    color: '#0A8E4E',
    fontWeight: '700',
    width: 'max-content',
  },
  icon: {
    alignContent: 'center',
    width: theme.spacing(1),
    height: theme.spacing(1),
    marginTop: theme.spacing(-0.1),
  },
  copiedText: {
    position: 'relative',
    paddingLeft: theme.spacing(0.2),
    marginTop: theme.spacing(-0.2),
  },
}));

export default function ViewPetProfile(props = {}) {
  const classes = useStyles();

  const router = useRouter();
  const { getLang } = useAthena();
  const { petId } = useSanitizedRouter();
  const { data: pet } = usePetProfile(petId);

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

  const handleEdit = useCallback(() => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          interactionPanel: 'editPetProfile',
          petId: petId,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [petId, router]);

  const timeout = useRef(null);

  const handleDblClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
      navigator.clipboard.writeText(event.target.textContent);
      setShowCopied(true);
      timeout.current && window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        setShowCopied(false);
      }, COPIED_ICON_TIMEOUT_MS);
    }
  }, []);

  const [showCopied, setShowCopied] = useState(false);

  const Icon = copiedIcon[showCopied];

  if (!pet) {
    return null;
  }

  return (
    <div data-testid="view-pet-profile" className={classes.root}>
      <div className={classes.content}>
        <span className={classes.header}>
          <Typography variant="h3" className={classes.headingText} data-testid="viewPet:title">
            {getLang('petDetailsText', { fallback: 'Pet Details' })}
          </Typography>
          <span hidden={!showCopied} className={classes.copiedSpan}>
            <span>
              <Icon data-testid="viewPet:copied:icon" className={cn(classes.icon)} />
            </span>
            <span
              hidden={!showCopied}
              data-testid="viewPet:copied"
              className={cn(classes.copiedText)}
            >
              {getLang('copiedText', { fallback: 'COPIED' })}
            </span>
          </span>
        </span>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:name-label"
              className={cn(classes.label)}
            >
              {getLang('petNameText', { fallback: 'Name:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:name-value"
              className={cn(classes.value)}
            >
              {pet?.name}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:type-label"
              className={cn(classes.label)}
            >
              {getLang('petTypeText', { fallback: 'Type:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:type-value"
              className={cn(classes.value)}
            >
              {pet?.type?.name}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:sex-label"
              className={cn(classes.label)}
            >
              {getLang('petSexText', { fallback: 'Sex:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              data-testid="viewPet:sex-value"
              component="label"
              className={cn(classes.value)}
            >
              {pet?.gender
                ? petGenderOption.find((option) => option.value === pet.gender).name
                : 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:breed-label"
              className={cn(classes.label)}
            >
              {getLang('petBreedText', { fallback: 'Breed:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:breed-value"
              className={cn(classes.value)}
            >
              {pet?.breed?.name || 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:weight-label"
              className={cn(classes.label)}
            >
              {getLang('petWeightText', { fallback: 'Weight:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:weight-value"
              className={cn(classes.value)}
            >
              {pet?.weightInPounds || 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:weightclass-label"
              className={cn(classes.label)}
            >
              {getLang('petWeightClassText', { fallback: 'Weight Class:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:weightclass-value"
              className={cn(classes.value)}
            >
              {pet?.weightType
                ? petWeightType.find((option) => option.value === pet.weightType).name
                : 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:age-label"
              className={cn(classes.label)}
            >
              {getLang('petAgeText', { fallback: 'Age:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:age-value"
              className={cn(classes.value)}
            >
              {pet?.birthday ? <PetAge>{pet.birthday}</PetAge> : 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:birthday-label"
              className={cn(classes.label)}
            >
              {getLang('petBirthdayText', { fallback: 'Birthday:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:birthday-value"
              className={cn(classes.value)}
            >
              {pet?.birthday ? formatRescheduleDate(pet.birthday) : 'N/A'}
            </FormLabel>
          </span>
        </div>

        <div className={cn(classes.detail)}>
          <span>
            <FormLabel
              component="label"
              data-testid="viewPet:adoptionday-label"
              className={cn(classes.label)}
            >
              {getLang('petAdoptionDayText', { fallback: 'Adoption Day:' })}
            </FormLabel>
          </span>
          <span onDoubleClick={handleDblClick}>
            <FormLabel
              component="label"
              data-testid="viewPet:adoptionday-value"
              className={cn(classes.value)}
            >
              {pet?.adoptionDate ? formatRescheduleDate(pet.adoptionDate) : 'N/A'}
            </FormLabel>
          </span>
        </div>

        <FeatureFlag flag="feature.explorer.petProfileTagsEnabled">
          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="viewPet:foodallergies-label"
                className={cn(classes.label)}
              >
                {getLang('petFoodAllergiesText', { fallback: 'Food Allergies:' })}
              </FormLabel>
            </span>
            <span onDoubleClick={handleDblClick}>
              {pet?.allergies && pet?.allergies.length > 0 ? (
                pet?.allergies?.map((allergy) => (
                  <FormLabel
                    key={`a:${allergy.name}`}
                    component="label"
                    className={cn(classes.value)}
                  >
                    {allergy.name}
                  </FormLabel>
                ))
              ) : (
                <FormLabel component="label" className={cn(classes.value)}>
                  {'None'}
                </FormLabel>
              )}
            </span>
          </div>

          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="viewPet:medicalconditions-label"
                className={cn(classes.label)}
              >
                {getLang('petMedicalConditionsText', { fallback: 'Medical Conditions:' })}
              </FormLabel>
            </span>
            <span onDoubleClick={handleDblClick}>
              {pet?.existingMedicalConditions && pet?.existingMedicalConditions.length > 0 ? (
                pet?.existingMedicalConditions?.map((medCondition) => (
                  <FormLabel
                    key={`mc:${medCondition.name}`}
                    component="label"
                    className={cn(classes.value)}
                  >
                    {medCondition.name}
                  </FormLabel>
                ))
              ) : (
                <FormLabel component="label" className={cn(classes.value)}>
                  {getLang('petNoneText', { fallback: 'None' })}
                </FormLabel>
              )}
            </span>
          </div>

          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="viewPet:medications-label"
                className={cn(classes.label)}
              >
                {getLang('petMedicationsText', { fallback: 'Medications:' })}
              </FormLabel>
            </span>
            <span onDoubleClick={handleDblClick}>
              {pet?.medications && pet?.medications.length > 0 ? (
                pet?.medications?.map((medication) => (
                  <FormLabel
                    key={`m:${medication.name}`}
                    component="label"
                    className={cn(classes.value)}
                  >
                    {medication.name}
                  </FormLabel>
                ))
              ) : (
                <FormLabel component="label" className={cn(classes.value)}>
                  {getLang('petNoneText', { fallback: 'None' })}
                </FormLabel>
              )}
            </span>
          </div>

          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="viewPet:medicationallergies-label"
                className={cn(classes.label)}
              >
                {getLang('petMedicationAllergiesText', { fallback: 'Medication Allergies:' })}
              </FormLabel>
            </span>
            <span onDoubleClick={handleDblClick}>
              {pet?.medicationAllergies && pet?.medicationAllergies.length > 0 ? (
                pet?.medicationAllergies?.map((medAllergy) => (
                  <FormLabel
                    key={`ma:${medAllergy.name}`}
                    component="label"
                    className={cn(classes.value)}
                  >
                    {medAllergy.name}
                  </FormLabel>
                ))
              ) : (
                <FormLabel component="label" className={cn(classes.value)}>
                  {getLang('petNoneText', { fallback: 'None' })}
                </FormLabel>
              )}
            </span>
          </div>
        </FeatureFlag>
      </div>
      <div className={classes.footer}>
        <Button onClick={handleCancel} variant="outlined" className={classes.backButton}>
          {'Back'}
        </Button>
        <FeatureFlag flag="feature.petProfile.editPetEnabled">
          <Button onClick={handleEdit} variant="filled" className={classes.editButton}>
            {getLang('petEditText', { fallback: 'Edit Pet' })}
          </Button>
        </FeatureFlag>
      </div>
    </div>
  );
}
