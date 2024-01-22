
describe('initializing', () => {

  beforeEach(() => {
    cy.visit('localhost:5173')
  })
  it('is able to visit localhost', () => {
    cy.contains('Flowery')
  })
  it('is able to open and click log in form', () => {
    cy.get('[data-cy="login-submit-button"]').click()
  })
  it('is not able to log in with wrong credentials', () => {

  })
})