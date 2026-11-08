export const AiProvidersSymbol = Symbol("AiProviders")

export interface AiStructuredGenerationArgs {
  systemPrompt: string
  userPrompt: string
  schemaName: string
  schema: Record<string, unknown>
  temperature?: number
  maxTokens?: number
  disableReasoning?: boolean
  retryCount?: number
}

export interface AiStructuredClientInterface {
  generateStructured: (args: AiStructuredGenerationArgs) => Promise<unknown>
}

export interface AiProviderInterface extends AiStructuredClientInterface {
  readonly name: string
}
