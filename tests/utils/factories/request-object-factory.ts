export class RequestObjectFactory {
  static createRequest(
    url: string,
    config: {
      headers?: Record<string, string>;
      method?: string;
      body?: unknown;
    }
  ): Request {
    const { headers, method, body } = config;

    const requestInit: RequestInit = {
      method: method ? method.toUpperCase() : "GET",
      headers: headers ? new Headers(headers) : new Headers(),
      body: body ? JSON.stringify(body) : undefined,
    };

    return new Request(url, requestInit);
  }
}
