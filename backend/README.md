# Lumen Base Project

## Requirements
- [Docker](https://www.docker.com/)

## Installation
- `cd` in project directory
- Create `.env` file with `cp .env.example .env` and fill all missing variables
- Start Lumen and Database containers with `docker-compose up -d`
- If you pull the repo with the containers already started run this command: `docker exec -it lumen bash -c "composer install"`
- Run migrations:
    - if you want to delete all tables and recreate losing all data run this command: `docker exec -it lumen bash -c "php artisan migrate:fresh --seed"`;
    - if you want to execute only the new changes, execute this command: `docker exec -it lumen bash -c "php artisan migrate --force"` 
