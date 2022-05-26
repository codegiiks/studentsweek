pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3005:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm ci' 
                sh 'npm run build' 
            }
        }
    }
}
