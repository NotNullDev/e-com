class EComImagesClient {
  private baseUrl = process.env.NEXT_PUBLIC_E_COM_IMAGES_BASE_URL;
  private imagesPrefix = process.env.NEXT_PUBLIC_E_COM_IMAGES_IMAGES_PREFIX;

  async uploadImage(file: File, token: string): Promise<string | undefined> {

    const params = new URLSearchParams();
    params.append("presignToken", token);
    try {
      const resp = await fetch(`${this.baseUrl}/upload?${params}`, {
        method: "POST",
        body: file,
      });
      if (!resp.ok) {
        try {
          console.log(await resp.json());
        } catch (e) {
        }
        console.log("[EComImagesClient#uploadImage] Failed to upload image!")
      }

      const {fileName} = await resp.json()

      return fileName;
    } catch (e) {
      console.log("[EComImagesClient#uploadImage] Something went wrong!");
    }

    return undefined;
  }

  getImageUrl(imageId: string) {
    return `${this.baseUrl}/${this.imagesPrefix}/${imageId}`;
  }

}

export const eComImagesClient = new EComImagesClient();
