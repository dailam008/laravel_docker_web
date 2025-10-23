pipeline {
    agent any

    environment {
        APP_CONTAINER = "laravel_web_app"
        DB_CONTAINER = "laravel_db"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Checkout repository dari GitHub..."
                git branch: 'main', url: 'https://github.com/dailam008/laravel_docker_web.git'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                dir('laravel_docker_web') {
                    echo "⚙️ Build dan Jalankan Docker Compose"
                    bat '''
                    docker-compose down --remove-orphans
                    docker-compose build app
                    docker-compose up -d
                    '''
                }
            }
        }

        stage('Set Permissions') {
            steps {
                dir('laravel_docker_web') {
                    echo "🧰 Set permission (skip di Windows)"
                    bat 'echo Skip permission stage for Windows'
                }
            }
        }

        stage('Check Running Containers') {
            steps {
                echo "📋 Menampilkan container yang sedang berjalan"
                bat 'docker ps -a'
            }
        }

        stage('Finish') {
            steps {
                echo "🎉 Pipeline selesai! Laravel aktif di http://localhost:8082"
            }
        }
    }

    post {
        always {
            echo "✅ Build selesai!"
        }
    }
}
