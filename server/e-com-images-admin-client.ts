export class EComImagesAdminClient {
  private baseUrl = process.env.NEXT_PUBLIC_E_COM_IMAGES_BASE_URL;
  private adminKey = process.env.E_COM_IMAGES_ADMIN_KEY;
  private imagesPrefix = process.env.NEXT_PUBLIC_E_COM_IMAGES_IMAGES_PREFIX;

  public async getPresignUrl(): Promise<string | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/images/presign`, {
        headers: {
          'Authorization': `Bearer ${this.adminKey}`,
        }
      })

      if (!response.ok) {
        console.log("Failed to get presign url!")
        return undefined;
      }

      const data = await response.json();
      return data.token;
    } catch (e) {
      console.error("[EComImagesAdminClient#getPresignUrl] Something went wrong!!!", e);
    }
  }

  // E_COM_IMAGES_ADMIN_KEY
  // E_COM_IMAGES_BASE_URL
  // E_COM_IMAGES_IMAGES_PREFIX
}

export const eComImagesAdminClient = new EComImagesAdminClient();
