import { ProviderOptsType } from "@/routes/auth/providers/services/types/providerOpts.type"
import { BaseService } from "./base"

export class GithubProvider extends BaseService {
  constructor(opts: ProviderOptsType) {
    super({
      name: "github",

      authorize_url: "https://github.com/login/oauth/authorize",
      access_url: "https://github.com/login/oauth/access_token",
      profile_url: "https://api.github.com/user",

      scopes: opts.scopes,
      client_id: opts.client_id,
      client_secret: opts.client_secret,
    })
  }

  async extractUserInfo(data: GitHubProfile) {
    return super.extractUserInfo({
      id: data.id.toString(),
      avatarUrl: data.avatar_url,
      name: data.name ?? data.login,
      email: data.email,
    })
  }
}

interface GitHubProfile {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username?: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists?: number
  total_private_repos?: number
  owned_private_repos?: number
  disk_usage?: number
  suspended_at?: string | null
  collaborators?: number
  two_factor_authentication: boolean
  plan?: {
    collaborators: number
    name: string
    space: number
    private_repos: number
  }
  access_token: string
  refresh_token: string
  [claim: string]: unknown
}
