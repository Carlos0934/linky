import { LINK_SHORT_PATH_LENGTH } from "../domain/links";

export default function generateShortPath() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // 62 characters
  let result = "";
  for (let i = 0; i < LINK_SHORT_PATH_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
