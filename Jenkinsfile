pipeline {
  agent any
  tools {nodejs "node"}
  stages {
    stage('build'){
    steps{
        git 'https://github.com/edx/cypress-e2e-tests.git'
        }
    }
    // Install and verify Cypress
    stage('installation') {
      steps {
        sh 'npm install '
      }
    }
    stage('run e2e tests') {
        steps {
        sh 'npm run cy:test'
      }
    }
  }
  post {
    // Send an email in case of failure
    failure {
      mail to: "vmathavan@sg.palo-it.com", subject: "Cypress e2e Tests failure", body: "The Cypress e2e tests pipeline has failed"
    }
  }
}