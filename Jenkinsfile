pipeline {
    agent any

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

                REM Stop & remove semua container dari compose
                for /f "tokens=*" %%c in ('docker-compose ps -q') do (
                    docker stop %%c || echo "%%c tidak berjalan"
                    docker rm %%c || echo "%%c sudah dihapus"
                )

                REM Hapus container orphan
                docker-compose down --remove-orphans

                REM Hapus dangling container & image
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
                docker-compose up -d
                docker ps
                '''
            }
        }

        stage('Verify All Services') {
            steps {
                echo "🔍 Verifikasi semua service & port otomatis..."
                bat '''
                setlocal enabledelayedexpansion

                REM Tunggu container siap
                ping 127.0.0.1 -n 20 >nul

                REM Loop semua service
                for /f "tokens=*" %%s in ('docker-compose config --services') do (
                    REM Ambil semua port mapping untuk service
                    for /f "tokens=2 delims=:" %%p in ('docker-compose port %%s 80 2^>nul') do (
                        set PORT=%%p
                        echo ==== CEK SERVICE %%s di port !PORT! ====
                        curl -I http://127.0.0.1:!PORT! || echo "⚠ Gagal akses %%s di port !PORT!"
                    )
                )

                endlocal
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Semua container berhasil dijalankan dan verifikasi otomatis selesai!'
        }
        failure {
            echo '❌ Build gagal, cek log Jenkins console output.'
        }
    }
}
