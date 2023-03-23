export const getSessionStorage = (storageKey) => {
  if (typeof window === 'undefined') return;
  const storage = sessionStorage.getItem(storageKey);
  return storage ? JSON.parse(storage) : null;
};

export const setSessionStorageItem = (storageKey, objectToAdd) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(storageKey, JSON.stringify({ ...objectToAdd }));
};

export const setSessionStorageItemByKey = (storageKey, keyToGet, objectToAdd) => {
  if (typeof window === 'undefined') return;
  const storage = getSessionStorage(storageKey) || {};
  storage[keyToGet] = objectToAdd;
  sessionStorage.setItem(storageKey, JSON.stringify({ ...storage }));
};

export const addSessionStorageItem = (storageKey, objectToAdd) => {
  if (typeof window === 'undefined') return;
  const storage = getSessionStorage(storageKey);
  sessionStorage.setItem(storageKey, JSON.stringify({ ...storage, ...objectToAdd }));
};

export const removeSessionStorageKey = (storageKey) => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(storageKey);
};

export const removeSessionStorageItemByKey = (storageKey, keyToRemove) => {
  if (typeof window === 'undefined') return;
  const storage = getSessionStorage(storageKey);
  if (storage[keyToRemove]) delete storage[keyToRemove];
  sessionStorage.setItem(storageKey, JSON.stringify(storage));
};

export const getSessionStorageItemByKey = (storageKey, keyToGet) => {
  if (typeof window === 'undefined') return;
  const storage = getSessionStorage(storageKey) || {};
  return storage[keyToGet] ? storage[keyToGet] : {};
};
