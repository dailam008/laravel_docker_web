pipeline {
    agent any

    environment {
        APP_CONTAINER = "laravel_docker_web-app"
        DB_CONTAINER = "laravel_db"
        COMPOSER = "/usr/local/bin/composer"
    }

    triggers {
        pollSCM('H/5 * * * *') 
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checkout repository dari GitHub"
                git branch: 'main', url: 'https://github.com/dailam008/laravel_docker_web.git'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                dir('laravel_docker_web') { // pastikan ini nama folder repo kamu
                    echo "Build dan Jalankan Docker Compose"
                    sh 'docker-compose down --remove-orphans'
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Set Permissions') {
            steps {
                dir('laravel_docker_web') {
                    echo "Set permission folder storage & cache"
                    sh 'docker-compose exec app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true'
                }
            }
        }

        stage('Check Running Containers') {
            steps {
                echo "Cek container yang berjalan"
                sh 'docker ps -a'
            }
        }

        stage('Finish') {
            steps {
                echo "Deployment selesai! Laravel web harusnya sudah aktif di http://localhost:8082"
            }
        }
    }
}
