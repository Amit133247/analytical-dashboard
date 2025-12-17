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
        -hostkey "ssh-ed25519 255 SHA256:Fnrl8pLn/7yp/npnywTBccqesv9bKCTFQJCQoACep60" ^
        ec2-user@100.31.156.45 ^
        "
        docker pull amit133247/analytical-playground:latest &&
        docker ps -q --filter 'publish=80' | xargs -r docker stop &&
        docker ps -aq --filter 'publish=80' | xargs -r docker rm &&
        docker run -d --name analytical-playground -p 80:80 amit133247/analytical-playground:latest
        "
        """
    }
}
       
    }
}
