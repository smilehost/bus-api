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
                withSonarQubeEnv(installationName: 'SonarQube', credentialsId: 'SONAR_TOKEN') {
                    // sh '${SONAR_SCANNER_HOME}/bin/sonar-scanner'
                    // sh 'echo $SONAR_SCANNER_HOME'
                    sh '''
  echo "SCANNER HOME = $SONAR_SCANNER_HOME"
  ls -la $SONAR_SCANNER_HOME/bin
'''
                }
            }
        }
    }
}