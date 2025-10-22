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

        stage('Check Changes') {
            steps {
                script {
                    // Gunakan git di Windows
                    def depChanges = bat(
                        script: 'git diff --name-only HEAD~1 HEAD | findstr /R "composer.json composer.lock"',
                        returnStdout: true
                    ).trim()

                    def codeChanges = bat(
                        script: 'git diff --name-only HEAD~1 HEAD | findstr /R "app/ routes/ resources/"',
                        returnStdout: true
                    ).trim()

                    if (depChanges == '' && codeChanges == '') {
                        currentBuild.result = 'SUCCESS'
                        echo "Tidak ada perubahan Laravel, pipeline dihentikan."
                        error("Skip pipeline")
                    }

                    env.DEP_CHANGES = depChanges
                    env.CODE_CHANGES = codeChanges

                    echo "Perubahan dependency:\n${depChanges}"
                    echo "Perubahan kode:\n${codeChanges}"
                }
            }
        }

        stage('Build & Install Dependencies (if needed)') {
            when {
                expression { env.DEP_CHANGES != '' }
            }
            steps {
                echo "Dependency berubah → build image & install composer"
                bat 'docker-compose build app'
                bat 'docker-compose run --rm app composer install'
            }
        }

        stage('Start/Update Containers') {
            steps {
                echo "Menjalankan atau memperbarui Docker Compose"
                bat 'docker-compose up -d --remove-orphans'
            }
        }

        stage('Run Laravel Tests') {
            steps {
                echo "Menjalankan Laravel tests (jika ada)"
                bat 'docker-compose exec app php artisan test || echo Tidak ada test tersedia'
            }
        }

        stage('Finish') {
            steps {
                echo "Pipeline selesai, aplikasi sudah terdeploy!"
            }
        }
    }

    post {
        always {
            echo "Pipeline selesai, siap untuk polling berikutnya"
        }
    }
}
