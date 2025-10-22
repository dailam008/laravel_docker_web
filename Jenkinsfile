pipeline {
    agent any

    environment {
        IMAGE_NAME = "laravel-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checkout source code dari repo..."
                git branch: 'main', url: 'https://github.com/dailam008/laravel_docker_web.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🏗  Build Docker images..."
                bat 'docker-compose build'
            }
        }

        stage('Cleanup Old Containers & Orphans') {
            steps {
                echo "🧹 Stop & remove semua container lama..."
                bat '''
                setlocal enabledelayedexpansion

                REM Stop & remove semua container dari docker-compose
                for /f "tokens=*" %%c in ('docker-compose ps -q') do (
                    docker stop %%c || echo "%%c tidak berjalan"
                    docker rm %%c || echo "%%c sudah dihapus"
                )

                REM Hapus container orphan dan network lama
                docker-compose down --remove-orphans

                REM Bersihkan dangling container & image
                docker container prune -f
                docker image prune -f

                endlocal
                '''
            }
        }

        stage('Up Docker Compose') {
            steps {
                echo "🚀 Jalankan semua service via docker-compose..."
                bat '''
                REM Build ulang & jalankan semua service
                docker-compose up -d --build
                docker ps
                '''
            }
        }

        stage('Verify Laravel & phpMyAdmin') {
            steps {
                echo "🔍 Verifikasi service Laravel & phpMyAdmin..."
                bat '''
                setlocal enabledelayedexpansion

                REM Tunggu container siap
                ping 127.0.0.1 -n 20 >nul

                REM Cek Laravel app di port 8082
                echo ==== CEK LARAVEL ====
                curl -I http://127.0.0.1:8082 || echo "⚠ Laravel gagal diakses"

                REM Cek phpMyAdmin di port 8081
                echo ==== CEK PHPMYADMIN ====
                curl -I http://127.0.0.1:8081 || echo "⚠ phpMyAdmin gagal diakses"

                endlocal
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Semua container berhasil dijalankan, Laravel bisa konek ke DB, dan tidak ada duplikat!'
        }
        failure {
            echo '❌ Build gagal, cek log Jenkins console output.'
        }
    }
}
