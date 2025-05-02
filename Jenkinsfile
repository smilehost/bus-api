pipeline {
    agent any

    tools {
        sonarQubeScanner 'SonarQube' // ใช้ชื่อจาก Tools config
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv(credentialsId: 'SONAR_TOKEN') {
                    // sh 'sonar-scanner'
                    sh 'echo Connected to SonarQube!'
                }
            }
        }
    }
}