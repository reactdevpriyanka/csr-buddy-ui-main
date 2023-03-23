import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Progress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { Icon } from '@material-ui/core';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';
import _ from 'lodash';
import { FeatureFlag } from '@/features';
import useAthena from '@/hooks/useAthena';
import useCustomer from '@/hooks/useCustomer';
import Link from '@mui/material/Link';
import PetAvatar from './PetProfile/PetAvatar';
import PetProfile from './PetProfile';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)} 0 0`,
  },
  header: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    ...theme.fonts.h2,
    marginBottom: theme.spacing(1.2),
    padding: '4.5px 0',
    color: theme.palette.blue.dark,
  },
  name: {
    ...theme.fonts.h4,
    fontSize: theme.fonts.size.md,
    color: theme.palette.blue.dark,
  },
  gridContainer: {
    marginBottom: `-${theme.spacing(4.5)}`,
    display: 'grid',
    rowGap: theme.spacing(0.5),
    padding: '5px 0 6px',
  },
  imgContainer: {
    padding: '12px',
  },
  img: {
    fontSize: 'medium',
    color: '#031657',
    transform: 'rotate(90deg)',
  },
  editPetLink: {
    background: 'transparent',
    border: 0,
    color: theme.palette.primary.alternate,
    fontSize: theme.fonts.size.sm,
    fontWeight: 700,
    cursor: 'pointer',
    lineHeight: theme.utils.fromPx(16.41),
    marginTop: theme.utils.fromPx(8),
    padding: 0,
    textTransform: 'uppercase',
  },
}));

const PetProfiles = ({ children }) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const router = useRouter();

  const { data, error } = useCustomer();

  const onCreatePet = useCallback(
    (event) => {
      event.preventDefault();
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            interactionPanel: 'addPetProfile',
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const onEditClick = useCallback(
    (event) => {
      event.preventDefault();
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, interactionPanel: 'editPetProfile' },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  if (error) {
    return null;
  }

  if (!data) {
    return <Progress data-testid="loader" />;
  }

  const { pets = [] } = data;
  const addPetLabel = getLang('addPetlabel', { fallback: 'ADD A PET' });

  return (
    <section className={classes.root} data-testid="pet-profile">
      <div className={classes.header}>
        <Typography className={classes.heading} variant="h2">
          {getLang('petProfileslabel', { fallback: 'Pet Profiles' })}
        </Typography>
        {pets.length > 0 && (
          <FeatureFlag flag="feature.petProfile.editPetEnabled">
            <Link
              data-dd-action-name="Edit Pet Profile"
              onClick={onEditClick}
              variant="text"
              color="#1C49C2"
              component="span"
              data-testid="pet-profile:edit"
              className={classes.editPetLink}
              underline="hover"
            >
              {getLang('petProfilesEditlabel', { fallback: 'Edit' })}
            </Link>
          </FeatureFlag>
        )}
      </div>
      {pets.length > 0 && (
        <div className={classes.gridContainer}>
          {_.sortBy(pets, 'status').map((pet) => (
            <PetProfile id={pet.id} key={pet.id} petData={pet} />
          ))}
        </div>
      )}
      <FeatureFlag flag="feature.explorer.addPetEnabled">
        <div className={classes.gridContainer} data-testid="add-pet-container">
          <Card
            sx={{
              display: 'flex',
              height: 65,
              marginTop: 8.5,
              marginBottom: 4.5,
              borderRadius: 3,
            }}
          >
            <CardMedia sx={{ width: 80 }}>
              <PetAvatar
                data-testid="pet-profile:avatar"
                src="https://dotcms-ui.chewy.com/images/pet-profile/avatars/avatar_dog_xx_generic.png"
              />
            </CardMedia>
            <CardActionArea
              aria-label={addPetLabel}
              data-testid="pet-profile:add-pet-button"
              onClick={onCreatePet}
            >
              <CardContent>
                <Typography className={classes.name} component="div" variant="h6">
                  <Icon className={classes.imgContainer}>
                    <AddCircleOutlineSharpIcon className={classes.img} />
                  </Icon>
                  {addPetLabel}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </FeatureFlag>
    </section>
  );
};

PetProfiles.propTypes = {
  children: PropTypes.node,
};

export default PetProfiles;
