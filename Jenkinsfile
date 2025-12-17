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

         stage('Deploy to EC2') {
            steps {
                bat """
                "C:\\Program Files\\PuTTY\\plink.exe" ^
                -batch ^
                -i C:\\jenkins-keys\\googlemeet-key.ppk ^
                ec2-user@100.31.156.45 ^
                "docker pull amit133247/analytical-playground:latest && \
                 docker stop analytical-playground || true && \
                 docker rm analytical-playground || true && \
                 docker run -d --name analytical-playground -p 80:80 amit133247/analytical-playground:latest"
                """
            }
        }
       
    }
}
