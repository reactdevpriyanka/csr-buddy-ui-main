import userInfo from '__mock__/users/user_details';

const findUser = jest.fn((logonId, onSuccess) => {
  onSuccess && onSuccess(userInfo);
  return userInfo;
});
const createUser = jest.fn();
const updateUser = jest.fn();
const resetPassword = jest.fn();

export default function mockUseUser() {
  return {
    findUser,
    createUser,
    updateUser,
    resetPassword,
  };
}

mockUseUser.findUser = findUser;
mockUseUser.createUser = createUser;
mockUseUser.updateUser = updateUser;
mockUseUser.resetPassword = resetPassword;
