import assert from 'node:assert'
import { suite, test } from 'node:test'
import { suggestDomain, verify } from './index.js'

suite('email-verifier', () => {
  test('verify', async () => {
    const email = 'name@example.com'
    const result = await verify(email)
    assert.equal(result.email, email)
  })

  test('suggestDomain', async () => {
    const domain = 'gmai.com'
    const result = await suggestDomain(domain)
    assert.equal(result, 'gmail.com')
  })
})
