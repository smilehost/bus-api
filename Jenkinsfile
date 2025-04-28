pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    stages {
        stage('Scan') {
            steps {
                withSonarQubeEnv('sq1') {
                    sh 'sonar-scanner'
                }
            }
        }
    }
}