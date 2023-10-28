class EComImagesClient {
  private baseUrl;
  private imagesPrefix;

  constructor() {
    const a = process.env.NEXT_PUBLIC_E_COM_IMAGES_BASE_URL;
    if (!a) throw new Error("NEXT_PUBLIC_E_COM_IMAGES_BASE_URL is not set!")
    const b = process.env.NEXT_PUBLIC_E_COM_IMAGES_IMAGES_PREFIX;
    if (!b) throw new Error("NEXT_PUBLIC_E_COM_IMAGES_IMAGES_PREFIX is not set!")

    this.baseUrl = a;
    this.imagesPrefix = b;
  }

  async uploadImage(file: File, token: string): Promise<string | undefined> {
    const params = new URLSearchParams();
    params.append("presignToken", token);
    const form = new FormData();
    form.append("file", file);
    try {
      const resp = await fetch(`${this.baseUrl}/upload?${params}`, {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        try {
          const errBody = await resp.json();
          console.log(errBody);
        } catch (e) {
          console.log(`[EComImagesClient#uploadImage] Failed to parse error response body as JSON`)
          console.error(e);
        }
        console.log(`[EComImagesClient#uploadImage] Failed to upload image! Received status code ${resp.status}`)
        return undefined;
      }

      const res = await resp.json()

      console.log(`[EComImagesClient#uploadImage] Successfully uploaded image!`)
      return res.fileName;
    } catch (e) {
      console.error(e)
      console.log("[EComImagesClient#uploadImage] Something went wrong!");
    }

    return undefined;
  }

  getImageUrl(imageId: string) {
    return `${this.baseUrl}/${this.imagesPrefix}/${imageId}`;
  }

}

export const eComImagesClient = new EComImagesClient();
