import fetch from 'node-fetch'

type QueryParameters = { [key: string]: number | number[] | string | string[] }

export class BaseApi {
  constructor(private apiKey: string, private baseUrl: string = 'https://api.pluggy.ai/v1') {}

  protected async createGetRequest<T>(endpoint: string, params?: QueryParameters): Promise<T> {
    return fetch(`${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`, {
      method: 'get',
      headers: {
        'X-API-KEY': this.apiKey,
      },
    })
      .then(async response => {
        try {
          const json = await response.json()
          if (response.status !== 200) {
            return Promise.reject(json)
          } else {
            return Promise.resolve(json)
          }
        } catch {
          const message = await response.text()
          return Promise.reject({ message })
        }
      })
      .catch(error => {
        console.warn(`[API] HTTP request failed: ${error.message || ''}`, error)
        return Promise.reject(error)
      })
  }

  protected createPostRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: any
  ): Promise<T> {
    return this.createMutationRequest('post', endpoint, params, body)
  }

  protected createPutRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: any
  ): Promise<T> {
    return this.createMutationRequest('put', endpoint, params, body)
  }

  protected createPatchRequest<T>(
    endpoint: string,
    params?: QueryParameters,
    body?: any
  ): Promise<T> {
    return this.createMutationRequest('patch', endpoint, params, body)
  }

  protected createMutationRequest<T>(
    method: string,
    endpoint: string,
    params?: QueryParameters,
    body?: any
  ): Promise<T> {
    return fetch(`${this.baseUrl}/${endpoint}${this.mapToQueryString(params)}`, {
      method,
      headers: {
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify(body),
    }).then(async response => {
      try {
        const json = await response.json()
        if (response.status !== 200) {
          return Promise.reject(json)
        } else {
          return Promise.resolve(json)
        }
      } catch {
        const message = await response.text()
        return Promise.reject({ message })
      }
    })
  }

  protected mapToQueryString(params: QueryParameters): string {
    if (!params) {
      return ''
    }

    const query = Object.keys(params)
      .map(key => key + '=' + params[key])
      .join('&')
    return `?${query}`
  }
}
