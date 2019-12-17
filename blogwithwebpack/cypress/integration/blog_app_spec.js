describe('Blog app', function () {
  const name = 'ArthurvdL'
  const username = 'arthur'
  const password = 'dikvetpassword'

  before(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name,
      username,
      password
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })

  describe('Login/logout functionality', function () {

    it('Login can be opened', function () {
      cy.visit('http://localhost:3000')
      cy.contains('Login')
    })

    it('User can login', function () {
      cy.get('[data-cy=username]')
        .type(username)
      cy.get('[data-cy=password]')
        .type(password)
      cy.get('[type=submit]')
        .click()
      cy.contains(`${name} logged in`)
    })

    it('User can logout', function () {
      cy.get('[type=logout]')
        .click()
      cy.contains('Login')
    })
  })

  describe('Logged in user functionality', function () {
    before(function () {
      cy.visit('http://localhost:3000')
      cy.get('[data-cy=username]')
        .type(username)
      cy.get('[data-cy=password]')
        .type(password)
      cy.get('[type=submit]')
        .click()
    })

    it('User can create a new blog post', function () {
      cy.contains('New Blog')
        .click()
      cy.get('[data-cy=title]')
        .type('Dit is een nieuwe titel')
      cy.get('[data-cy=author]')
        .type('Hele stoere auteur')
      cy.get('[data-cy=url]')
        .type('https://www.example.com')
      cy.get('[type=submit]')
        .click()
    })

    it('A notification is shown with the new blog post', function () {
      cy.contains(`a new blog Dit is een nieuwe titel by Hele stoere auteur added`)
    })

    it('The new blog post is present', function () {
      cy.contains('Dit is een nieuwe titel Hele stoere auteur')
    })

    it('The details of the blog post can be visited', function () {
      cy.contains('a', 'Dit is een nieuwe')
        .click()
      cy.contains('0 likes')
      cy.contains(`Added by ${name}`)
    })

    it('Clicking the like button increases the likes', function () {
      cy.contains('like')
        .click()
      cy.contains('1 likes')
    })

    it('User can add comment', function () {
      cy.get('[data-cy=comment]')
        .type('Ik ben niet gediend van commentaar!')
      cy.contains('add new comment')
        .click()
      cy.contains('Ik ben niet gediend van commentaar!')
      cy.get('[data-cy=comment]')
        .should('be.empty')
    })

  })

})
