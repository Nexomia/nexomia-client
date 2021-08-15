export default function getConvertedData(data: object): string {
  let convertedString = '';

  const entries = Object.entries(data);

  for (const entry of entries) {
    convertedString += `${entry[0]}=${entry[1]}`;
    if (entries.indexOf(entry) < entries.length - 1) {
      convertedString += '&';
    }
  }

  console.log(convertedString);

  return convertedString;
}
