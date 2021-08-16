export default function getIconString(str: string) {
  return (
    str.split(' ')[1]
    ? str.split(' ')[0][0] + str.split(' ')[1][0]
    : str.split(' ')[0][0] + (
      str.split(' ')[0][1]
      ? str.split(' ')[0][1]
      : ''
    )
  );
}
