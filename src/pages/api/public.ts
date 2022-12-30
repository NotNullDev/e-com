import type { NextApiRequest, NextApiResponse } from "next";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2+2JGIrnwUyHDG2QaUuL
GhFbrxlm/4PjYYuV9cnKmlL/ga0VdhOyjQW34TtL94y1Jhxt0BLnnZ9/lFEX7PxL
wFVj3ebecJHbO4/L1ypyNTl5jY8j/rt4yLlSyoSCWSX5OqDQutjuj23Vn6TkV4AN
0lNCjmsSjrG+blcBzfGWP9I0jf/Be8DEYXHDJb0lb1praWf5O/Zf4VC49RvDNZOo
/p/XT4T7rkkNTarTRxIojNLHmFXruJnD4mCpHrSRxVCHuisT0/U8Q+yTVQBJK33C
BvCgpbYBmCLJieDMLsgGRmSmyIX1zgbSmRhWDFP/vmUhBB+4bywwlKbxwZLLFTb0
ZQIDAQAB
-----END PUBLIC KEY-----`;

const publicJWTKey = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.json(publicKey);
};

export default publicJWTKey;
