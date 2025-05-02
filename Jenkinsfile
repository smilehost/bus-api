pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(installationName: 'SonarQube', credentialsId: 'SONAR_TOKEN') {
                    sh 'sonar-scanner'
                    // sh 'echo $SONAR_SCANNER_HOME'
                }
            }
        }
    }
}