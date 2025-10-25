import { BaseApi } from './baseApi.js'

export class CrudApi extends BaseApi {
  constructor(request, baseUrl, token) {
    super(request, baseUrl)
    this.token = token
  }

  get headers() {
    return { Authorization: `Bearer ${this.token}` }
  }

  async createUser(data) {
    return await this.post('/users', data, this.headers)
  }

  async getUser(id) {
    return await this.get(`/users/${id}`, this.headers)
  }

  async updateUser(id, data) {
    return await this.put(`/users/${id}`, data, this.headers)
  }

  async deleteUser(id) {
    return await super.delete(`/users/${id}`, this.headers)
  }

  async createPost(data) {
    return await this.post('/posts', data, this.headers)
  }

  async getPost(id) {
    return await this.get(`/posts/${id}`, this.headers)
  }

  async updatePost(id, data) {
    return await this.put(`/posts/${id}`, data, this.headers)
  }

  async deletePost(id) {
    return await super.delete(`/posts/${id}`, this.headers)
  }

  async createComment(data) {
    return await this.post('/comments', data, this.headers)
  }

  async getComment(id) {
    return await this.get(`/comments/${id}`, this.headers)
  }

  async updateComment(id, data) {
    return await this.put(`/comments/${id}`, data, this.headers)
  }

  async deleteComment(id) {
    return await super.delete(`/comments/${id}`, this.headers)
  }
}
