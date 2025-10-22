pipeline {
    agent any

    environment {
        // Nama image utama (bisa dipakai kalau mau build khusus)
        IMAGE_NAME = "laravel-app"
        // Daftar container dari docker-compose.yml
        CONTAINERS = "laravel_docker_web-app laravel_phpmyadmin laravel_db"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checkout source code dari repo kamu..."
                git branch: 'main', url: 'https://github.com/dailam008/laravel_docker_web.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🏗  Build Docker images menggunakan docker-compose..."
                bat 'docker-compose build'
            }
        }

        stage('Stop & Remove Containers Lama') {
            steps {
                echo "🛑 Hentikan dan hapus container lama jika ada..."
                bat """
                for %%c in (${CONTAINERS}) do (
                    docker stop %%c || echo "%%c tidak berjalan"
                    docker rm %%c || echo "%%c sudah dihapus"
                )
                """
            }
        }

        stage('Up Docker Compose') {
            steps {
                echo "🚀 Jalankan ulang semua service via docker-compose..."
                bat '''
                docker-compose down || exit 0
                docker-compose up -d
                docker ps
                '''
            }
        }

        stage('Verify Containers') {
            steps {
                echo "🔍 Verifikasi container Laravel dan phpMyAdmin..."
                bat '''
                echo ==== TUNGGU 20 DETIK SUPAYA CONTAINER SIAP ====
                ping 127.0.0.1 -n 20 >nul

                echo ==== CEK KONEKSI LARAVEL ====
                curl -I http://127.0.0.1:8082 || echo "⚠ Gagal akses Laravel di port 8082"

                echo ==== CEK KONEKSI PHPMYADMIN ====
                curl -I http://127.0.0.1:8081 || echo "⚠ Gagal akses phpMyAdmin di port 8081"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Semua container berhasil dijalankan!'
        }
        failure {
            echo '❌ Build gagal, cek log Jenkins console output.'
        }
    }
}
