pipeline {
    agent any

    environment {
        // กำหนดชื่อ installation ตรงกับที่ตั้งไว้ใน Jenkins > Global Tool Config
        // (ตรงกับชื่อใน "SonarQube Scanner installations")
        SONARQUBE_INSTALLATION = 'SonarQube'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(installationName: "${SONARQUBE_INSTALLATION}", credentialsId: 'SONAR_TOKEN') {
                    sh '${SONAR_SCANNER_HOME}/bin/sonar-scanner'
                }
            }
        }
    }
}