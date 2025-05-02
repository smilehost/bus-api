pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check SonarQube') {
            steps {
                sh '''
                    which sonar-scanner || echo "SonarQube Scanner not in PATH"
                    find / -name "sonar-scanner" 2>/dev/null || echo "SonarQube Scanner not found"
                    echo "JENKINS_HOME = $JENKINS_HOME"
                    ls -la $JENKINS_HOME/tools || echo "No tools directory found"
                '''
            }
        }
    }
}