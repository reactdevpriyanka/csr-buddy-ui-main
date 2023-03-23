/** Converts the standard thumbnail data payload to a fetchable url
 * @TODO : Further spike into logic/reasoning?
 *
 * https://img.chewy.com/is/image/catalog/215832_main,1577737076
 * to
 * https://img.chewy.com/is/image/catalog/215832_main.jpg
 *
 */
const Thumbnails = (image, imageSize = 250) => {
  if (!image) return '';
  /** @TODO : More elegant way to handle the mockdata vs api/real data */
  if (!image.includes('http://placeimg.com/')) {
    const [withoutTimestamp] = image.split(',');
    return withoutTimestamp.length > 0 ? `https:${withoutTimestamp}._SS${imageSize}_.jpg` : '';
  }
  return image;
};

export default Thumbnails;
