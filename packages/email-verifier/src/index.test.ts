import { expect, it, suite } from 'vitest'
import { suggestDomain, verify } from './index.js'

suite('email-verifier', () => {
  it('verify', async () => {
    const email = 'name@example.com'
    const result = await verify(email)
    expect(result.error).toBeNull()
    expect(result.data.email).toBe(email)
  })

  it('verify-enable-smtp-check', async () => {
    const email = 'name@gmail.com'
    const result = await verify(email, { enableSMTPCheck: true })
    expect(result.error).toBeNull()
    expect(result.data.smtp).not.toBeNull()
  })

  it('verify-host-not-exists-error', async () => {
    const email = 'name@xxx.cxxx'
    const result = await verify(email)
    expect(result.error).toBeTypeOf('string')
    expect(result.error).length.gt(0)
  })

  it('suggestDomain', async () => {
    const domain = 'gmai.com'
    const result = await suggestDomain(domain)
    expect(result).equal('gmail.com')
  })
})
