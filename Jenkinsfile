pipeline {
    agent any

    tools {
        // Define SonarQube Scanner tool - this is the important addition
        sonarqubeScanner 'SonarQube Scanner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(installationName: 'SonarQube') {
                    sh '''
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=bus-api \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://YOUR_SONARQUBE_URL:9000
                    '''
                }
            }
        }
    }
}