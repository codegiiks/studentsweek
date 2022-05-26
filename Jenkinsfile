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
                sh 'npm install' 
                sh 'npm run build' 
            }
        }
    }
}
