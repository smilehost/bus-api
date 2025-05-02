pipeline {
    agent any

    tools {
        // Use the correct tool type from the error message: hudson.plugins.sonar.SonarRunnerInstallation
        'hudson.plugins.sonar.SonarRunnerInstallation' 'SonarQube Scanner'
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