export default function coalesce(collection) {
  if (typeof collection.filter === 'function') {
    return collection.filter((entryValue) => entryValue !== null && entryValue !== undefined);
  }

  throw new TypeError('@/utils/coalesce.js: `collection` argument must implement `filter` method');
}
