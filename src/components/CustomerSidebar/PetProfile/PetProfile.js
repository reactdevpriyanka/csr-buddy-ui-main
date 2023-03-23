import { useCallback } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Card, CardMedia, CardContent, CardActionArea, Box } from '@mui/material';
import PetProfileTag from '@/components/PetProfileTag';
import { PetProfileTagTypes } from '@/components/PetProfileTag/PetProfileTag';
import TooltipPrimary from '@/components/TooltipPrimary';
import FeatureFlag from '@/features/FeatureFlag';
import useFeature from '@/features/useFeature';
import CopyableText from '@components/CopyableText';
import PetAvatar from './PetAvatar';
import PetBreed from './PetBreed';
import PetBreedType from './PetBreedType';
import PetAge from './PetAge';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '300px',
    minHeight: 65,
    marginBottom: 1.5,
    borderRadius: 3,
    whiteSpace: 'nowrap',
    opacity: 1,
    '&.inactive': {
      opacity: '0.43',
    },
  },
  card: {
    opacity: 1,
    '&.inactive': {
      opacity: '0.43',
    },
    display: 'flex',
    width: '300px',
    minHeight: 65,
    marginBottom: 1.5,
    borderRadius: 3,
  },
  detailsContainer: {
    whiteSpace: 'break-spaces',
  },
  name: {
    ...theme.fonts.h4,
    fontSize: theme.fonts.size.md,
    color: theme.palette.blue.dark,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  age: {
    ...theme.fonts.h4,
    fontSize: theme.fonts.size.md,
    color: theme.palette.blue.dark,
    marginTop: `${theme.utils.fromPx(0)}`,
  },
  breedAndType: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    width: `${theme.utils.fromPx(200)}`,
  },
  profileTag: {
    whiteSpace: 'nowrap',
  },
  mainPanel: {
    display: 'grid',
  },
  topPanel: {
    whiteSpace: 'nowrap',
  },
  bottomPanel: {
    display: 'block',
  },
  nameAge: {
    display: 'grid',
    gridTemplateColumns: `auto ${theme.utils.fromPx(50)}`,
  },
  toolTip: {
    marginTop: '0px',
  },
}));

const bgColorByGender = {
  FMLE: '#FE8FB0',
  MALE: '#A3CEF9',
  UNKN: '#bdbdbd',
};

const petTypes = {
  Dog: 'Dog',
  Cat: 'Cat',
  Horse: 'Horse',
  Fish: 'Fish',
  Bird: 'Bird',
  Reptile: 'Reptile',
  Farm: 'Farm',
  'Small Pet': 'Small',
};

export const getAvatarUrl = (breedType) => {
  switch (breedType) {
    case petTypes.Dog:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_dog.png';
    case petTypes.Cat:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_cat.png';
    case petTypes.Horse:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_horse.png';
    case petTypes.Reptile:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_reptile.png';
    case petTypes.Bird:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_bird.png';
    case petTypes.Fish:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_fish.png';
    case petTypes.Farm:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_farm_animal.png';
    case petTypes.Small:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_small_pet.png';
    default:
      return 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/avatar_dog_xx_generic.png';
  }
};

const PetProfile = ({ id, petData }) => {
  const classes = useStyles();

  const router = useRouter();

  const PETTILE_FEATURE_FLAG = 'feature.explorer.petTileEnabled';
  const petTileEnabled = useFeature(PETTILE_FEATURE_FLAG);

  const {
    birthday = '',
    breed = '',
    breedType = '',
    gender = 'UNKN',
    name = '',
    status = '',
    existingMedicalConditions = [],
    medicationAllergies = [],
    medications = [],
    allergies = [], // These are the food allergies
  } = petData;

  /*
    The below method uses timeout to capture if the onclick event is
    for a single or double click. The logic ignores events fired from double click
    and invokes handleClick() for single clicks
   */
  const getClickHandler = (delay = 250) => {
    let timeoutID = null;
    return function (event) {
      if (!timeoutID) {
        timeoutID = setTimeout(function () {
          handleClick();
          timeoutID = null;
        }, delay);
      } else {
        clearTimeout(timeoutID);
        timeoutID = null;
      }
    };
  };

  const handleClick = useCallback(() => {
    if (petTileEnabled) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            interactionPanel: 'viewPetProfile',
            petId: id,
          },
        },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [id, router, petTileEnabled]);

  return (
    <Card
      className={cn(classes.card, { inactive: status === 'INACTIVE' })}
      data-testid="pet-profile:card"
    >
      <CardMedia
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 65,
          height: '100%',
          backgroundColor: bgColorByGender[gender],
        }}
      >
        <PetAvatar
          alt="pet-profile:avatar"
          data-testid="pet-profile:avatar"
          gender={gender}
          variant="square"
          src={getAvatarUrl(breedType)}
        />
      </CardMedia>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '-webkit-fill-available' }}>
        <CardActionArea onClick={getClickHandler()} data-dd-action-name="Pet Profile">
          <CardContent>
            <div className={classes.mainPanel}>
              <div className={classes.topPanel}>
                <div className={classes.nameAge}>
                  <TooltipPrimary className={classes.toolTip} title={name}>
                    <CopyableText copyOnDoubleClick={true}>
                      <Typography
                        data-dd-action-name="Pet Profile"
                        className={classes.name}
                        data-testid="pet-profile:name"
                        component="h6"
                        variant="h6"
                      >
                        {name}
                      </Typography>
                    </CopyableText>
                  </TooltipPrimary>
                  <Typography
                    className={classes.age}
                    data-testid="pet-profile:birthday"
                    component="div"
                    variant="h6"
                  >
                    <PetAge>{birthday}</PetAge>
                  </Typography>
                </div>
                <TooltipPrimary className={classes.toolTip} title={`${breedType}, ${breed}`}>
                  <Typography
                    className={classes.breedAndType}
                    variant="subtitle1"
                    color="textSecondary"
                    component="div"
                  >
                    <PetBreedType>{breedType}</PetBreedType>, <PetBreed>{breed}</PetBreed>
                  </Typography>
                </TooltipPrimary>
              </div>

              <FeatureFlag flag="feature.explorer.petProfileTagsEnabled">
                <div className={classes.bottomPanel}>
                  {allergies.length > 0 && (
                    <PetProfileTag
                      id={id}
                      type={PetProfileTagTypes.FoodAllergies}
                      values={allergies}
                    />
                  )}

                  {medications.length > 0 && (
                    <PetProfileTag
                      id={id}
                      type={PetProfileTagTypes.Medications}
                      values={medications}
                    />
                  )}

                  {medicationAllergies.length > 0 && (
                    <PetProfileTag
                      id={id}
                      type={PetProfileTagTypes.MedicationAllergy}
                      values={medicationAllergies}
                    />
                  )}

                  {existingMedicalConditions.length > 0 && (
                    <PetProfileTag
                      id={id}
                      type={PetProfileTagTypes.MedicalCondition}
                      values={existingMedicalConditions}
                    />
                  )}
                  {status.length > 0 && status !== 'ACTIVE' && (
                    <PetProfileTag id={id} type={PetProfileTagTypes.Status} values={status} />
                  )}
                </div>
              </FeatureFlag>
            </div>
          </CardContent>
        </CardActionArea>
      </Box>
    </Card>
  );
};

PetProfile.propTypes = {
  id: PropTypes.string.isRequired,
  petData: PropTypes.object.isRequired,
};

export default PetProfile;
