import { IMAGE_URL_PREFIX } from "./CONST";

export function getAppImageUrl(imageName: string) {
  return IMAGE_URL_PREFIX + "/" + imageName;
}
