export class BaseApi {
  constructor(request, baseUrl) {
    this.request = request
    this.baseUrl = baseUrl
  }

  async get(endpoint, headers = {}) {
    return await this.request.get(`${this.baseUrl}${endpoint}`, { headers })
  }

  async post(endpoint, body, headers = {}) {
    return await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: body,
      headers
    })
  }

  async put(endpoint, body, headers = {}) {
    return await this.request.put(`${this.baseUrl}${endpoint}`, {
      data: body,
      headers
    })
  }

  async delete(endpoint, headers = {}) {
    return await this.request.delete(`${this.baseUrl}${endpoint}`, { headers })
  }
}
