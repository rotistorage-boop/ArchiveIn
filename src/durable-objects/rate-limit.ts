export interface Env {}

export interface DurableObjectState {
  storage: {
    get<T>(key: string): Promise<T | undefined>
    put(key: string, value: any): Promise<void>
  }
  id: { toString(): string }
}

export class RateLimit {
  state: DurableObjectState

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
  }

  async fetch(request: Request) {
    const url = new URL(request.url)
    const key = url.searchParams.get('key') || 'ip'

    const currentWindow = Math.floor(Date.now() / 60000)
    const storageKey = `rate:${key}:${currentWindow}`

    let count = (await this.state.storage.get<number>(storageKey)) || 0

    if (count >= 100) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429 })
    }

    count++
    await this.state.storage.put(storageKey, count)

    return new Response(JSON.stringify({ count }), { status: 200 })
  }
}
