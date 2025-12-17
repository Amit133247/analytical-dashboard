pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t analytical-playground:latest .'
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    docker tag analytical-playground:latest amit133247/analytical-playground:latest
                    docker push amit133247/analytical-playground:latest
                    '''
                }
            }
        }
       
    }
}
