import { test, expect, request as playwrightRequest } from '@playwright/test'
import { CrudApi } from '../pages/crudApi.js'

test.describe.serial('CRUD /comments - GoRest API com postId compartilhado', () => {
  const baseUrl = 'https://gorest.co.in/public/v2'
  const token = 'dfb6fda70f2391f935e81c6ba7eefe3fc68f25c1e2a964c609b5d0f51bbdd24b'
  const postId = 253077
  let apiRequest
  let commentsApi
  let commentId
  let createdCommentData

  test.beforeAll(async () => {
    console.log('Criando APIRequestContext')
    apiRequest = await playwrightRequest.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` }
    })

    commentsApi = new CrudApi(apiRequest, baseUrl, token)

    const commentResponse = await commentsApi.createComment({
      post_id: postId,
      name: 'QA Test',
      email: `qa${Date.now()}@test.com`,
      body: 'Comentário inicial de teste'
    })

    expect(commentResponse.status()).toBe(201)

    const commentBody = await commentResponse.json()
    commentId = commentBody.id
    createdCommentData = commentBody

    console.log(`Comentário criado com ID: ${commentId}`)
    console.log('Dados do comentário criado:', commentBody)

    expect(commentBody).toHaveProperty('id')
    expect(commentBody).toHaveProperty('post_id', postId)
    expect(commentBody).toHaveProperty('name', 'QA Test')
    expect(commentBody).toHaveProperty('email')
    expect(commentBody).toHaveProperty('body', 'Comentário inicial de teste')

    const getResponse = await commentsApi.getComment(commentId)
    expect(getResponse.status()).toBe(200)
    const getBody = await getResponse.json()
    expect(getBody.id).toBe(commentId)
    expect(getBody.post_id).toBe(postId)
    expect(getBody.name).toBe(createdCommentData.name)
  })

  test('PUT /comments/:id - Atualizar comentário existente', async () => {
    console.log(`Teste PUT iniciado para commentId: ${commentId}`)

    const updateData = {
      name: 'QA Atualizado',
      body: 'Comentário atualizado'
    }

    const response = await commentsApi.updateComment(commentId, updateData)
    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: commentId,
      name: updateData.name,
      body: updateData.body
    })

    console.log(`Teste PUT finalizado com sucesso para commentId: ${commentId}`)
  })

  test('GET /comments/:id - Consultar comentário existente', async () => {
    console.log(`Teste GET iniciado para commentId: ${commentId}`)

    const response = await commentsApi.getComment(commentId)
    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: commentId,
      post_id: postId,
      name: 'QA Atualizado',
      body: 'Comentário atualizado'
    })

    console.log('Dados retornados no GET:', body)
    console.log(`Teste GET finalizado para commentId: ${commentId}`)
  })

  test('DELETE /comments/:id - Excluir comentário existente', async () => {
    console.log(`Teste DELETE iniciado para commentId: ${commentId}`)

    const response = await commentsApi.deleteComment(commentId)
    expect([200, 204]).toContain(response.status())

    const getAfterDelete = await commentsApi.getComment(commentId)
    expect(getAfterDelete.status()).toBe(404)

    console.log(`Teste DELETE finalizado para commentId: ${commentId}`)
  })
})
