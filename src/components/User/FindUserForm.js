import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import useUser from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { FormControl, TextField } from '@material-ui/core';
import * as blueTriangle from '@utils/blueTriangle';
import Button from '../Button';
import IAMTitle from './IAMTitle';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '15px',
  },
  title: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '22px',
  },
  buttonPanel: {
    marginTop: '10px',
  },
  formControl1: {
    width: '300px',
  },
}));

export default function FindUserForm() {
  const classes = useStyles();
  const { findUser } = useUser();
  const { getLang } = useAthena();
  const [loginId, setLoginId] = useState('');
  const [componentInitialized, setComponentInitialized] = useState(false);
  const pageName = 'Find User - VT';

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  const handleLoginIdChange = (event) => {
    setLoginId(event.target.value);
  };

  const handleFindUser = () => {
    findUser(loginId, (data) => {
      const query = { loginId: data?.attributes?.loginId };

      router.push(
        {
          pathname: `/users/create-modify-user`,
          query,
        },
        undefined,
        { shallow: true },
      );
    });
  };

  const handleCreateUser = () => {
    const query = {};

    router.push(
      {
        pathname: `/users/create-modify-user`,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={classes.root}>
      <IAMTitle />
      <form
        data-testid="add-user-profile"
        className={classes.formContainer}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={classes.contentContainer}>
          <FormControl className={classes.formControl1}>
            <TextField
              required
              variant="outlined"
              label={getLang('findUserApp_logonID', { fallback: 'Logon ID' })}
              value={loginId}
              data-testid="find-user-logonId-field"
              onChange={handleLoginIdChange}
              placeholder={getLang('findUserApp_logonID', { fallback: 'Logon ID' })}
            />
          </FormControl>
          <div className={classes.buttonPanel}>
            <Button
              solid
              onClick={handleFindUser}
              disabled={loginId.length === 0}
              className={classes.submitButton}
              data-testid="find-user-find-user-button"
              type="submit"
              aria-label={getLang('findUserApp_findUser', { fallback: 'Find User' })}
            >
              {getLang('findUserApp_findUser', { fallback: 'Find User' })}
            </Button>

            <Button
              solid
              onClick={handleCreateUser}
              className={classes.submitButton}
              data-testid="find-user-create-user-button"
              aria-label={getLang('findUserApp_createUser', { fallback: 'Create User' })}
            >
              {getLang('findUserApp_createUser', { fallback: 'Create User' })}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
