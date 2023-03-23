/* eslint-disable no-restricted-globals */

import SingleTabLayout from '@/components/Layout/SingleTabLayout';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Select, InputLabel, MenuItem } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';
import useUser from '@/hooks/useUser';
import { useSnackbar } from 'notistack';
import * as blueTriangle from '@utils/blueTriangle';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { ALL_ROLES } from '@/constants/userRoles';
import { cleanParams } from '@/utils/cleanParams';
import InfoIcon from '@mui/icons-material/Info';
import Button from '../Button';
import Shuttle from '../Shuttle';
import TooltipPrimary from '../TooltipPrimary';
import ChangePasswordDialog from './ChangePasswordDialog';
import IAMTitle from './IAMTitle';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '20px',
    '& .MuiFormHelperText-root': {
      color: 'red',
    },
  },
  titleContainer: {
    marginLeft: '15px',
    marginBottom: '20px',
  },
  formControl1: {
    width: '80%',
    marginLeft: '15px',
    marginBottom: '10px',
  },
  inputLabel: {
    marginLeft: '15px',
    marginTop: '-5px',
    paddingRight: '5px',
  },
  buttonPanel: {
    marginLeft: '15px',
    marginTop: '10px',
  },
  title: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '22px',
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: '15px',
  },
  rightTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '22px',
    marginTop: '0',
    marginBottom: '0',
  },
  sideTitle: {
    marginBottom: '20px',
  },
  sideContent: {},
  rightSideTitle: {
    marginBottom: '10px',
    display: 'flex',
  },
  rightSideContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'inherit',
  },
  rightSideContent: {
    paddingRight: '10px',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
  },
  link: {},
  contentContainer: {
    display: 'grid',
    gridTemplateColumns: '700px auto',
    height: '480px',
  },
  logo: {
    fill: '#031657 !important',
    width: '25px !important',
    height: '25px !important',
    marginLeft: '5px !important',
  },
}));

const tmpSelected = [
  {
    id: '76',
    displayName: 'CSR Vet Diet',
    role: 'CSR_VET_DIET',
  },
  {
    id: '58',
    displayName: 'ITOC Administrator',
    role: 'ITOC_ADMINISTRATOR',
  },
  {
    id: '59',
    displayName: 'IAM Administrator',
    role: 'IAM_ADMINISTRATOR',
  },
  {
    id: '8943',
    displayName: 'Practice Hub - Clinic Outreach',
    role: 'PRACTICE_HUB_CLINIC_OUTREACH',
  },
  {
    id: '14',
    displayName: 'Customer Service Representative',
    role: 'CUSTOMER_SERVICE_REPRESENTATIVE',
  },
];

function not(a, b) {
  return a.filter((value) => {
    const idx = b.findIndex((obj) => {
      return value.id === obj.id;
    });
    return idx === -1;
  });
}

const areRolesEqual = ({ initRoles = [], selectedRoles = [] }) => {
  const tmpSelectedRoles = selectedRoles.map((role) => role.role);
  return _.isEqual(initRoles, tmpSelectedRoles);
};

const alphaNumericRegExp = /^[\dA-Za-z]+$/;
export default function CreateModifyUserForm({ loginIdInput }) {
  const classes = useStyles();
  const router = useRouter();
  const { findUser, createUser, updateUser, resetPassword } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const { getLang } = useAthena();
  const initRoles = getLang('csr.roles', { fallback: ALL_ROLES });
  const isShowPassword = getLang('feature.explorer.iamAppShowPasswordEnabled', { fallback: true });
  const iamAppRolesListURL = getLang('findUserApp_iamAppRolesListURL', {
    fallback:
      'https://chewyinc.atlassian.net/wiki/spaces/CUST/pages/1890027939/IAM+Tool+-+User+Role+List',
  });

  const [edit, setEdit] = useState(!!loginIdInput);
  const [logonId, setLogonId] = useState(loginIdInput || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registerType, setRegistrationType] = useState('A');
  const [status, setStatus] = useState('true');
  const [roles, setRoles] = useState(initRoles);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isInvalidForm, setIsInvalidForm] = useState(true);
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initUser, setInitUser] = useState(null);
  const [inValidLogonId, setInValidLogonId] = useState(false);
  const [componentInitialized, setComponentInitialized] = useState(false);
  const pageName = 'Create Modify User - VT';

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

  useEffect(() => {
    if (!loginIdInput || !edit) {
      return;
    }

    findUser(loginIdInput, (user) => {
      const selectedRoleObjs = (user?.attributes?.roles || []).map((roleKey) => {
        return initRoles.find((tmpRole) => tmpRole.role === roleKey);
      });

      setUser(user);
      setInitUser(user);
      setEdit(true);
      setLogonId(user?.attributes?.loginId || '');
      setEmail(user?.attributes?.email || '');
      setRoles(not(initRoles, selectedRoleObjs));
      setSelectedRoles(selectedRoleObjs);
      setRegistrationType(user?.attributes?.registerType || 'A');
      setStatus(user?.attributes?.enabled ? 'true' : 'false');
      setFullName(user?.attributes?.fullName || '');
    });
  }, [
    loginIdInput,
    setUser,
    setInitUser,
    setEdit,
    setEmail,
    setRoles,
    setSelectedRoles,
    setRegistrationType,
    setStatus,
  ]);

  useEffect(() => {
    // Add check to make sure loginId is alpha nummeric
    const checkLogonId = !!logonId?.match(alphaNumericRegExp);

    if (!checkLogonId) {
      setInValidLogonId(true);
      setIsInvalidForm(true);
      return;
    }

    setInValidLogonId(false);

    if (!edit) {
      let areValid = [logonId, fullName, email, registerType, status].includes('');

      // If we show the password we need to account for it when trying to validate for new user
      if (isShowPassword) {
        areValid = [logonId, password, fullName, email, registerType, status].includes('');
      }

      setIsInvalidForm(areValid);
    } else {
      if (!initUser) {
        return;
      }

      if (
        initUser.attributes.loginId === logonId &&
        initUser.attributes.fullName === fullName &&
        initUser.attributes.email === email &&
        initUser.attributes.registerType === registerType &&
        initUser.attributes.enabled === JSON.parse(status || false) &&
        areRolesEqual({ initRoles: initUser.attributes.roles, selectedRoles })
      ) {
        setIsInvalidForm(true);
      } else {
        setIsInvalidForm(false);
      }
    }
  }, [logonId, password, fullName, email, registerType, status, initUser, selectedRoles]);

  const onClose = useCallback(() => {
    const query = {};

    router.push(
      {
        pathname: '/users/find-users',
        query,
      },
      undefined,
      { shallow: true },
    );
  }, [router]);

  const handleLogonIdChange = (event) => {
    setLogonId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRegistrationTypeChange = (event) => {
    setRegistrationType(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const doModifyUser = () => {
    const tmpUuser = cleanParams({
      loginId: logonId,
      newPassword: password,
      name: fullName,
      email: email,
      registerType: registerType,
      enabled: status === 'true' ? 1 : 0,
      roles: getSelectedKeys(selectedRoles),
      accountId: user?.attributes?.accountId,
      userId: user?.attributes?.userId,
    });

    updateUser(tmpUuser, () => {
      enqueueSnackbar({
        messageHeader: 'Success!',
        variant: SNACKVARIANTS.SUCCESS,
        messageSubheader: `User ${fullName} was updated`,
        persist: false,
      });
      onClose();
    });
  };

  const doCreateUser = () => {
    const tmpUuser = cleanParams({
      loginId: logonId,
      password,
      name: fullName,
      email: email,
      registerType: registerType,
      roles: getSelectedKeys(selectedRoles),
    });

    createUser(tmpUuser, () => {
      enqueueSnackbar({
        messageHeader: 'Success!',
        variant: SNACKVARIANTS.SUCCESS,
        messageSubheader: `User ${fullName} was created`,
        persist: false,
      });
      onClose();
    });
  };

  const handleSaveUser = () => {
    if (edit) {
      doModifyUser();
    } else {
      doCreateUser();
    }
  };

  const handleChageUserPassword = () => {
    setIsDialogOpen(true);
  };

  const getSelectedKeys = (list) => {
    return (list || []).map((item) => item?.role);
  };

  const doResetUserPassword = (newPassword) => {
    const body = {
      newPassword,
    };
    resetPassword(user?.attributes?.userId, body, () => {
      setIsDialogOpen(false);
      enqueueSnackbar({
        messageHeader: 'Success!',
        variant: SNACKVARIANTS.SUCCESS,
        messageSubheader: `Password changed`,
        persist: false,
      });
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <IAMTitle />
      </div>
      <form
        data-testid="add-user-profile"
        className={cn(classes.formContainer, edit && 'edit')}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={classes.contentContainer}>
          <div className={classes.leftSideContainer}>
            <div className={classes.sideTitle}>
              <span className={classes.title} data-testid="createModifyUser-title">
                {edit
                  ? getLang('findUserApp_edit', { fallback: 'Edit ' })
                  : getLang('findUserApp_Create', { fallback: 'Create ' })}{' '}
                User
              </span>
            </div>
            <div className={classes.sideContent}>
              <FormControl className={classes.formControl1}>
                <TextField
                  required
                  variant="outlined"
                  label={getLang('findUserApp_logonID', { fallback: 'Logon ID' })}
                  value={logonId}
                  data-testid="createModifyUser-logonId-field"
                  name="createModifyUser-logonId-field"
                  onChange={handleLogonIdChange}
                  placeholder={getLang('findUserApp_logonID', { fallback: 'Logon ID' })}
                  helperText={
                    inValidLogonId ? 'Logon Id is required and must be alpha numberic only' : ''
                  }
                />
              </FormControl>

              {!edit && isShowPassword && (
                <FormControl className={classes.formControl1}>
                  <TextField
                    required
                    variant="outlined"
                    label={getLang('findUserApp_password', { fallback: 'Password' })}
                    value={password}
                    type="password"
                    data-testid="createModifyUser-password-field"
                    onChange={handlePasswordChange}
                    placeholder={getLang('findUserApp_password', { fallback: 'Password' })}
                  />
                </FormControl>
              )}
              <FormControl className={classes.formControl1}>
                <TextField
                  required
                  variant="outlined"
                  label={getLang('findUserApp_displayName', { fallback: 'Display Name' })}
                  value={fullName}
                  data-testid="createModifyUser-displayName-field"
                  onChange={handleFullNameChange}
                  placeholder={getLang('findUserApp_displayName', { fallback: 'Display Name' })}
                />
              </FormControl>

              <FormControl className={classes.formControl1}>
                <TextField
                  required
                  variant="outlined"
                  label={getLang('findUserApp_emailAddress', { fallback: 'Email Address' })}
                  value={email}
                  data-testid="createModifyUser-emailAddress-field"
                  onChange={handleEmailChange}
                  placeholder={getLang('findUserApp_emailAddress', { fallback: 'Email Address' })}
                />
              </FormControl>

              <FormControl className={classes.formControl1}>
                <InputLabel className={classes.inputLabel} required>
                  {getLang('findUserApp_addUserRegistrationTypeLabel', {
                    fallback: 'Registration Type',
                  })}
                </InputLabel>
                <Select
                  className={classes.registerType}
                  variant="outlined"
                  data-testid="createModifyUser-registerType-field"
                  value={registerType}
                  required={true}
                  onChange={handleRegistrationTypeChange}
                  label={getLang('findUserApp_addUserRegistrationTypeLabel', {
                    fallback: 'Registration Type',
                  })}
                  renderValue={(value) => (
                    <MenuItem data-testid="user:type-value">{value}</MenuItem>
                  )}
                >
                  <MenuItem key="registration-type-A" value="A" data-testid="user:type-A">
                    {getLang('findUserApp_userRegistrationTypeA', { fallback: 'A' })}
                  </MenuItem>
                  ,
                  <MenuItem key="registration-type-S" value="S" data-testid="user:type-S">
                    {getLang('findUserApp_userRegistrationTypeS', { fallback: 'S' })}
                  </MenuItem>
                </Select>

                <span>
                  {getLang('findUserApp_registrationTypeInstructions', {
                    fallback:
                      'Only set type "S" on Site and IAM Administrators! Set type "A" on all other employees.',
                  })}
                </span>
              </FormControl>

              {edit && (
                <FormControl className={classes.formControl1}>
                  <InputLabel className={classes.inputLabel} required>
                    {getLang('findUserApp_addUserStatusLabel', { fallback: 'Status' })}
                  </InputLabel>
                  <Select
                    className={classes.status}
                    variant="outlined"
                    data-testid="createModifyUser-status-field"
                    value={status}
                    required={true}
                    onChange={handleStatusChange}
                    label={getLang('findUserApp_addUserStatusLabel', { fallback: 'Status' })}
                    renderValue={(value) => (
                      <MenuItem data-testid="user:status-value">
                        {value === 'true' ? 'ACTIVE' : 'INACTIVE'}
                      </MenuItem>
                    )}
                  >
                    <MenuItem key="user-status-S" value="false" data-testid="user:status-S">
                      {getLang('findUserApp_userStatusTypeInactive', { fallback: 'INACTIVE' })}
                    </MenuItem>
                    <MenuItem key="user-status-A" value="true" data-testid="user:status-A">
                      {getLang('findUserApp_userStatusTypeActive', { fallback: 'ACTIVE' })}
                    </MenuItem>
                    ,
                  </Select>
                </FormControl>
              )}
            </div>

            <div className={classes.buttonPanel}>
              <Button
                className={classes.cancelButton}
                data-testid="createModifyUser-cancel-button"
                aria-label={getLang('findUserApp_userCancelBtn', { fallback: 'Cancel' })}
                onClick={onClose}
              >
                {getLang('findUserApp_userCancelBtn', { fallback: 'Cancel' })}
              </Button>
              <Button
                solid
                onClick={handleSaveUser}
                disabled={isInvalidForm}
                className={classes.submitButton}
                data-testid="createModifyUser-save-user-button"
                type="submit"
                aria-label={getLang('findUserApp_saveAUserBtn', { fallback: 'Save User' })}
              >
                {getLang('findUserApp_saveAUserBtn', { fallback: 'Save User' })}
              </Button>

              {edit && isShowPassword && (
                <Button
                  solid
                  onClick={handleChageUserPassword}
                  className={classes.submitButton}
                  data-testid="createModifyUser-change-password-button"
                  aria-label={getLang('findUserApp_changeUserPasswordBtn', {
                    fallback: 'Change Password',
                  })}
                >
                  {getLang('findUserApp_changeUserPasswordBtn', { fallback: 'Change Password' })}
                </Button>
              )}
            </div>
          </div>

          <div className={classes.rightSideContainer}>
            <div className={classes.rightSideTitle}>
              <span className={classes.rightTitle}>
                {getLang('findUserApp_Roles', { fallback: 'Roles' })}
              </span>

              <a
                className={classes.link}
                href={iamAppRolesListURL}
                target="userRolesDef"
                rel="noreferrer"
              >
                <TooltipPrimary
                  title={getLang('findUserApp_FindRolesLinkDescr', {
                    fallback: 'Click to see the list of Roles',
                  })}
                  className={classes.tooltip}
                  placement="top"
                  arrow
                >
                  <InfoIcon className={classes.logo} />
                </TooltipPrimary>
              </a>
            </div>

            <div className={classes.rightSideContent}>
              <Shuttle
                left={[...roles]}
                right={[...selectedRoles]}
                setLeft={setRoles}
                setRight={setSelectedRoles}
                initSelection={[...tmpSelected]}
                data-testid="createModifyUser-shuttle"
              />
            </div>
            <div className={classes.buttonPanel} />
          </div>
        </div>
      </form>

      {isDialogOpen && (
        <ChangePasswordDialog
          isOpen={isDialogOpen}
          onOk={doResetUserPassword}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}

CreateModifyUserForm.propTypes = {
  loginIdInput: PropTypes.string,
};
CreateModifyUserForm.getLayout = () => SingleTabLayout;
