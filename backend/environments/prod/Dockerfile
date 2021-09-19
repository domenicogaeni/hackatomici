FROM domenicogaeni/php:8.0-base

ENV APP_HOME /var/www/html

# Load environment variables from build args
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD
ARG GOOGLE_API_TOKEN

ENV DB_DATABASE=$DB_DATABASE
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV GOOGLE_API_TOKEN=$GOOGLE_API_TOKEN

# Copy source and install dependencies
COPY backend $APP_HOME
RUN cd $APP_HOME
RUN composer install
COPY backend/environments/prod/.env.example .env

# Clean
RUN rm -rf .git .github .vscode database environments private tests \
    .gitignore .php_cs.dist artisan captainhook.json composer.json composer.lock Dockerfile docker-compose.yml LICENSE phpunit-printer.yml phpunit.xml psalm.xml README.md fronted

# Change ownership of our applications
RUN chown -R www-data:www-data $APP_HOME

# Start
COPY backend/environments/prod/start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh
CMD ["start.sh"]