pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                // Clone project dari GitHub
                git branch: 'main', url: 'https://github.com/dailamlaravel/laravel_docker_web.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build image Laravel
                bat 'docker build -t laravel_app .'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Jalankan composer install di dalam container sementara
                bat 'docker run --rm -v %cd%:/app composer install'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                // Bersihkan container lama agar tidak bentrok
                bat 'docker rm -f laravel_db || echo "No old laravel_db container to remove"'
                bat 'docker rm -f laravel_phpmyadmin || echo "No old phpmyadmin container to remove"'
                bat 'docker rm -f laravel_app || echo "No old laravel_app container to remove"'

                // Bersihkan jaringan & container yatim piatu
                bat 'docker-compose down --remove-orphans'

                // Build ulang service Laravel
                bat 'docker-compose build app'

                // Jalankan semua container (app, db, phpmyadmin)
                bat 'docker-compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                // Pastikan semua container jalan
                bat 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ Build dan deployment berhasil! Laravel app sudah berjalan di http://localhost:8082'
        }
        failure {
            echo '❌ Build gagal. Cek log Jenkins untuk detail error.'
        }
    }
}
