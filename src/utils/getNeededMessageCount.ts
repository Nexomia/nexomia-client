export default function getNeededMessageCount() {
  const count = Math.floor(document.body.clientHeight / 800 * 50);
  console.log(count);
  return count;
}
