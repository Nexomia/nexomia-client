export default function getNeededMessageCount() {
  return Math.floor(document.body.clientHeight / 800 * 50);
}
