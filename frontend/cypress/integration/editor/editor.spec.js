describe('When on editor view, as a user', function() {

    beforeEach(function() {    
        cy.visit('http://localhost:3000/filelist')  
    })

    it('I can view the file listing', function() {
      cy.contains('Files in the repository')
    })

    it('I can open a file in editor', function() {
        cy.contains('example.txt').click()
        cy.contains('ohtuprojekti-eficode/robot-test-files/example.txt')
    })

    it('I can edit a file in editor', function() {
        cy.contains('example.txt').click()
        // cy.contains('hello').click().type('{end} editor!')
        // cy.contains('hello editor!')
    })
})