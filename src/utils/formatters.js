export default function toFormattedPhoneNumber(value) {
  const phoneRegex = /(\d{3})(\d{3})(\d{4})/g;
  if (value && /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/.test(value)) {
    const matches = phoneRegex.exec(value.replace(/\D/g, ''));
    return matches[1] + '-' + matches[2] + '-' + matches[3];
  }
  return value;
}
