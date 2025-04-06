import { BaseUserInfoType } from "@/routes/auth/providers/services/types/baseUserInfo.type"
import { ProviderOptsType } from "@/routes/auth/providers/services/types/providerOpts.type"
import { BaseService } from "./base"

export class GoogleProvider extends BaseService {
  constructor(opts: ProviderOptsType) {
    super({
      name: "google",

      authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
      access_url: "https://oauth2.googleapis.com/token",
      profile_url: "https://www.googleapis.com/oauth2/v3/userinfo",

      scopes: opts.scopes,
      client_id: opts.client_id,
      client_secret: opts.client_secret,
    })
  }

  async extractUserInfo(data: GoogleProfile): Promise<BaseUserInfoType> {
    return super.extractUserInfo({
      id: data.sub,
      avatarUrl: data.picture,
      name: data.name,
      email: data.email,
    })
  }
}

interface GoogleProfile extends Record<string, any> {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name?: string
  given_name: string
  hd?: string
  iat: number
  iss: string
  jti?: string
  locale?: string
  name: string
  nbf?: number
  picture: string
  sub: string
  access_token: string
  refresh_token?: string
}
