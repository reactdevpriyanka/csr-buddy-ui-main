import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import ChewyLogo from '@components/Icons/chewy-logo-circle.svg';
import { useState } from 'react';
import Button from '../Button';
import PetAvatar from '../CustomerSidebar/PetProfile/PetAvatar';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '22px',
  },
  titleContainer: {
    display: 'flex',
    marginTop: '20px',
    marginBottom: '10px',
  },
  logo: {
    width: '40px',
    height: '40px',
  },
  headerContainer: {
    marginTop: '12px',
  },
  iconButton: {
    padding: 0,
    border: 'none',
    '&:hover': {
      cursor: 'default',
      backgroundColor: 'transparent',
    },
  },
  secret: {
    transform: 'scale(2,2)',
    margin: '35px',
  },
}));

export default function IAMTitle() {
  const classes = useStyles();
  const { getLang } = useAthena();
  const [showSecret, setShowSecret] = useState(false);

  const handleClick = (e) => {
    if (e.shiftKey) {
      setShowSecret(true);
    }

    setTimeout(() => {
      setShowSecret(false);
    }, 2000);
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <div>
          {!showSecret ? (
            <Button
              onDoubleClick={handleClick}
              data-testid="click-button"
              className={classes.iconButton}
            >
              <ChewyLogo className={classes.logo} />
            </Button>
          ) : (
            <PetAvatar
              className={classes.secret}
              data-testid="pet-profile:avatar"
              src="/app/secret.png"
            />
          )}
        </div>
        <div className={classes.headerContainer}>
          <span className={classes.title} data-testid="find-user-title">
            {getLang('findUserApp_title', { fallback: 'IAM User Manager' })}
          </span>
        </div>
      </div>
    </div>
  );
}
