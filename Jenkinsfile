
pipeline {
    agent any //

    environment {
        DEBUG_ENV = 'true'
        PORT = credentials('port')
        DATABASE_URL = credentials('database_url')
        PRIVATE_KEY = credentials('private_key')
        JWT_SECRET = credentials('jwt_secret')
        LOGIN_LIFT_TIME = credentials('login_lift_time')
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool name: 'SonarQube', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
}
