pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Skip tool declaration altogether and just use withSonarQubeEnv
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        ${SONAR_RUNNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=bus-api \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://YOUR_SONARQUBE_URL:9000
                    '''
                }
            }
        }
    }
}