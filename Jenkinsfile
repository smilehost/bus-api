pipeline {
    agent any

    tools {
        // SonarQube Scanner is the simplification of hudson.plugins.sonar.SonarRunnerInstallation
        'sonar' 'SonarQube Scanner'
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
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=bus-api \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://YOUR_SONARQUBE_URL:9000
                    '''
                }
            }
        }
    }
}