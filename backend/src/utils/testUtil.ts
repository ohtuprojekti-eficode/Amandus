import simpleGit from 'simple-git'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { File } from '../types/file'

export const initTestRepo = (): void => {
  const repoPath = path.join(
    'testRepositories',
    'testuser',
    'github',
    'testuser',
    'e2etest'
  )

  mkdirSync(repoPath, { recursive: true })
  mkdirSync(repoPath + '/robots/', { recursive: true })

  const git = simpleGit(repoPath)

  const files: File[] = [
    { name: 'README.md', content: 'This is a README.md' },
    {
      name: 'robots/example-loop.robot',
      content:
        '*** Settings ***\n' +
        'Documentation     An example executing a loop only two times.\n\n' +
        '*** Variables ***\n' +
        '@{ROBOTS}=        Bender    Johnny5    Terminator    Robocop\n\n' +
        '*** Tasks ***\n' +
        '#Execute a loop only two times\n' +
        '    ${index}=    Set Variable    1\n' +
        '    FOR    ${robot}    IN    @{ROBOTS}\n' +
        '        Exit For Loop If    ${index} > 9000\n' +
        '        Log    ${robot}\n' +
        '        ${index}=    Evaluate    ${index} + 1\n' +
        '    END\n',
    },
    {
      name: 'robots/resource.robot',
      content:
        '*** Settings ***\n' +
        'Documentation     A resource file with reusable keywords and variables.\n' +
        '...\n' +
        '...               The system specific keywords created here form our own\n' +
        '...               domain specific language. They utilize keywords provided\n' +
        '...               by the imported SeleniumLibrary.\n' +
        'Library           SeleniumLibrary\n\n' +
        '*** Variables ***\n' +
        '${SERVER}         localhost:7274\n' +
        '${BROWSER}        Firefox\n' +
        '${DELAY}          0\n' +
        '${VALID USER}     demo\n' +
        '${VALID PASSWORD}    mode\n' +
        '${LOGIN URL}      http://${SERVER}/\n' +
        '${WELCOME URL}    http://${SERVER}/welcome.html\n' +
        '${ERROR URL}      http://${SERVER}/error.html\n\n' +
        '*** Keywords ***\n' +
        'Open Browser To Login Page\n' +
        '    Open Browser    ${LOGIN URL}    ${BROWSER}\n' +
        '    Maximize Browser Window\n' +
        '    Set Selenium Speed    ${DELAY}\n' +
        '    Login Page Should Be Open\n\n' +
        'Login Page Should Be Open\n' +
        '    Title Should Be    Login Page\n\n' +
        'Go To Login Page\n' +
        '    Go To    ${LOGIN URL}\n' +
        '    Login Page Should Be Open\n\n' +
        'Input Username\n' +
        '    [Arguments]    ${username}\n' +
        '    Page Should Not Contain     Welcome\n' +
        '    Input Text    username_field    ${username}\n\n' +
        'Input Password\n' +
        '    [Arguments]    ${password}\n' +
        '    Input Text    password_field    ${password}\n\n' +
        'Submit Credentials\n' +
        '    Click Button    login_button\n\n' +
        'Welcome Page Should Be Open\n' +
        '    Location Should Be    ${WELCOME URL}\n' +
        '    Title Should Be    Welcome Page\n',
    },
  ]

  files.forEach((file) =>
    writeFileSync(`${repoPath}/${file.name}`, file.content)
  )

  git
    .init()
    .add(files.map((file) => file.name))
    .addConfig('user.name', 'testuser')
    .addConfig('user.email', 'testuser@testus.er')
    .commit('e2e commit')
    .catch((e) => console.log(e))
}
