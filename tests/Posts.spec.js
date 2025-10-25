import { test, expect, request as playwrightRequest } from '@playwright/test'
import { CrudApi } from '../pages/crudApi.js'

test.describe.serial('CRUD /posts - GoRest API com userId compartilhado', () => {
  const baseUrl = 'https://gorest.co.in/public/v2'
  const token = 'dfb6fda70f2391f935e81c6ba7eefe3fc68f25c1e2a964c609b5d0f51bbdd24b'
  const userId = 8202456
  let apiRequest
  let postsApi
  let postId
  let createdPostData

  test.beforeAll(async () => {
    console.log('Criando APIRequestContext')
    apiRequest = await playwrightRequest.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` }
    })

    postsApi = new CrudApi(apiRequest, baseUrl, token)

    const postResponse = await postsApi.createPost({
      user_id: userId,
      title: 'Post TaggPlus',
      body: 'Conteúdo inicial TagPlus'
    })

    expect(postResponse.status()).toBe(201)
    
    const postBody = await postResponse.json()
    postId = postBody.id
    createdPostData = postBody

    console.log(`Post criado com ID: ${postId}`)
    console.log('Dados do post criado:', postBody)

    expect(postBody).toHaveProperty('id')
    expect(postBody).toHaveProperty('user_id', userId)
    expect(postBody).toHaveProperty('title', 'Post TaggPlus')
    expect(postBody).toHaveProperty('body', 'Conteúdo inicial TagPlus')

    const getResponse = await postsApi.getPost(postId)
    expect(getResponse.status()).toBe(200)
    const getBody = await getResponse.json()
    expect(getBody.id).toBe(postId)
    expect(getBody.user_id).toBe(userId)
    expect(getBody.title).toBe(createdPostData.title)
  })

  test('PUT /posts/:id - Atualizar post existente', async () => {
    console.log(`Teste PUT iniciado para postId: ${postId}`)

    const updateData = {
      title: 'Post Atualizado',
      body: 'Conteúdo atualizado do post'
    }

    const response = await postsApi.updatePost(postId, updateData)
    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: postId,
      title: updateData.title,
      body: updateData.body
    })

    console.log(`Teste PUT finalizado com sucesso para postId: ${postId}`)
  })

  test('GET /posts/:id - Consultar post existente', async () => {
    console.log(`Teste GET iniciado para postId: ${postId}`)

    const response = await postsApi.getPost(postId)
    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: postId,
      title: 'Post Atualizado',
      body: 'Conteúdo atualizado do post',
      user_id: userId
    })

    console.log('Dados retornados no GET:', body)
    console.log(`Teste GET finalizado para postId: ${postId}`)
  })

  test('DELETE /posts/:id - Excluir post existente', async () => {
    console.log(`Teste DELETE iniciado para postId: ${postId}`)

    const response = await postsApi.deletePost(postId)
    expect([200, 204]).toContain(response.status())

    const getAfterDelete = await postsApi.getPost(postId)
    expect(getAfterDelete.status()).toBe(404)

    console.log(`Teste DELETE finalizado para postId: ${postId}`)
  })
})
