import { test, expect, request as playwrightRequest } from '@playwright/test'
import { CrudApi } from '../pages/crudApi.js'

test.describe.serial('CRUD /users - GoRest API com userId compartilhado', () => {
  const baseUrl = 'https://gorest.co.in/public/v2'
  const token = 'dfb6fda70f2391f935e81c6ba7eefe3fc68f25c1e2a964c609b5d0f51bbdd24b'
  let apiRequest
  let api
  let userId
  let createdUserData

  test.beforeAll(async () => {
    console.log('Criando APIRequestContext')
    apiRequest = await playwrightRequest.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` }
    })

    api = new CrudApi(apiRequest, baseUrl, token)

    const response = await api.createUser({
      name: 'User TagPlus',
      email: `tagPlusUser@teste.com`,
      gender: 'male',
      status: 'active'
    })

    expect(response.status()).toBe(201)

    const body = await response.json()
    userId = body.id
    createdUserData = body

    console.log(`Usuário criado com ID: ${userId}`)
    console.log('Dados criados:', body)

    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'User TagPlus')
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('gender', 'male')
    expect(body).toHaveProperty('status', 'active')

    const getResponse = await api.getUser(userId)
    expect(getResponse.status()).toBe(200)
    const getBody = await getResponse.json()
    expect(getBody.id).toBe(userId)
    expect(getBody.name).toBe(createdUserData.name)
    expect(getBody.email).toBe(createdUserData.email)
  })

  test('PUT /users/:id - Atualizar usuário existente', async () => {
    console.log(`Teste PUT iniciado para userId: ${userId}`)

    const updateData = { name: 'Usuario Atualizado', status: 'inactive' }
    const response = await api.updateUser(userId, updateData)

    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: userId,
      name: updateData.name,
      status: updateData.status
    })

    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('gender')
    console.log(`Teste PUT finalizado com sucesso para userId: ${userId}`)
  })

  test('GET /users/:id - Consultar usuário existente', async () => {
    console.log(`Teste GET iniciado para userId: ${userId}`)

    const response = await api.getUser(userId)
    expect(response.status()).toBe(200)
    const body = await response.json()

    expect(body).toMatchObject({
      id: userId,
      name: 'Usuario Atualizado',
      gender: 'male',
      status: 'inactive'
    })
    expect(body).toHaveProperty('email')

    console.log('Dados retornados no GET:', body)
    console.log(`Teste GET finalizado para userId: ${userId}`)
  })

  test('DELETE /users/:id - Excluir usuário existente', async () => {
    console.log(`Teste DELETE iniciado para userId: ${userId}`)

    const response = await api.deleteUser(userId)
    expect([200, 204]).toContain(response.status())

    const getAfterDelete = await api.getUser(userId)
    expect(getAfterDelete.status()).toBe(404)
    console.log(`Teste DELETE finalizado para userId: ${userId}`)
  })

})
