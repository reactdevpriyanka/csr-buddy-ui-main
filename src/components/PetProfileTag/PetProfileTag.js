import PropTypes from 'prop-types';
import Pill from '@components/Pill';
import { makeStyles } from '@material-ui/core';
import TooltipPrimary from '../TooltipPrimary';

const useStyles = makeStyles((theme) => ({
  tooltipText: {
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14.06px',
    color: 'white',
  },
  outerContainer: {
    cursor: 'pointer !important',
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14.06px',
    color: '#031657',
  },
  petProfilePill: {
    padding: `${theme.spacing(0.2)} ${theme.spacing(0.5)} !important`,
    background: '#EEEEEE !important',
    marginBottom: '7px',
  },
  petProfileStatusPill: {
    padding: `${theme.spacing(0.2)} ${theme.spacing(0.5)} !important`,
    background: '#EEEEEE !important',
    marginBottom: '7px',
    color: '#851940 !important',
    fontWeight: 'bold',
  },
}));

export const PetProfileTagTypes = {
  FoodAllergies: 'FoodAllergies',
  Medications: 'Medications',
  MedicationAllergy: 'MedicationAllergy',
  MedicalCondition: 'MedicalCondition',
  Status: 'Status',
};

export const PetProfileTagType = {
  FoodAllergies: 'Food Allergies',
  Medications: 'Medications',
  MedicationAllergy: 'Med. Allergy',
  MedicalCondition: 'Med. Condition',
  Status: 'INACTIVE',
};

const getTooltip = (type, vals) => {
  const suffix = vals.join(', ');

  switch (type) {
    case PetProfileTagTypes.FoodAllergies:
      return `Allergies to ${suffix}`;
    case PetProfileTagTypes.Medications:
      return `Current medications ${suffix}`;
    case PetProfileTagTypes.MedicationAllergy:
      return `Allergies to ${suffix}`;
    case PetProfileTagTypes.MedicalCondition:
      return `Current medical conditions ${suffix}`;
    default:
      return null;
  }
};

const PetProfileTag = ({ id, type, values = [] }) => {
  const classes = useStyles();
  const tooltipTitle =
    PetProfileTagTypes.Status !== type ? (
      <span className={classes.tooltipText}>{getTooltip(type, values)}</span>
    ) : null;
  const testId = `pet-profile-${type.toLowerCase()}-${id}:tags`;

  return PetProfileTagTypes.Status === type ? (
    <Pill type="tag" className={classes.petProfileStatusPill}>
      {values}
    </Pill>
  ) : (
    <Pill type="tag" className={classes.petProfilePill}>
      <TooltipPrimary
        data-testid={`${testId}:tooltip`}
        aria-label={type}
        arrow
        placement="bottom"
        title={tooltipTitle}
      >
        <span data-testid={testId} key={type} className={classes.outerContainer}>
          {PetProfileTagType[type]}
        </span>
      </TooltipPrimary>
    </Pill>
  );
};

PetProfileTag.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(Object.values(PetProfileTagTypes)).isRequired,
  values: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
};

export default PetProfileTag;
