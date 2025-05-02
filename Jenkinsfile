pipeline {
    agent any

    tools {
        // ใช้ชื่อที่คุณตั้งค่าไว้ (เช่น "SonarQube")
        SonarRunnerInstallation 'SonarQube'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.projectKey=bus-api -Dsonar.sources=.'
                }
            }
        }
    }
}