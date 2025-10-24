import { BaseApi } from './baseApi.js'

export class UsersApi extends BaseApi {
  constructor(request, baseUrl, token) {
    super(request, baseUrl)
    this.endpoint = '/users'
    this.token = token
  }

  get headers() {
    return { Authorization: `Bearer ${this.token}` }
  }

  async createUser(data) {
    return await this.post(this.endpoint, data, this.headers)
  }

  async getUsers() {
    return await this.get(this.endpoint)
  }

  async getUser(id) {
    return await this.get(`${this.endpoint}/${id}`, this.headers)
  }

  async updateUser(id, data) {
    return await this.put(`${this.endpoint}/${id}`, data, this.headers)
  }

  async deleteUser(id) {
    return await this.delete(`${this.endpoint}/${id}`, this.headers)
  }
}
