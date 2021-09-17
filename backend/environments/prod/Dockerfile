FROM domenicogaeni/php:8.0-base

ENV APP_HOME /var/www/html

# Copy source and install dependencies
COPY . $APP_HOME
RUN composer install

# Clean
RUN rm -rf .git .github .vscode database environments private tests \
    .gitignore .php_cs.dist artisan captainhook.json composer.json composer.lock Dockerfile docker-compose.yml LICENSE phpunit-printer.yml phpunit.xml psalm.xml README.md

# Change ownership of our applications
RUN chown -R www-data:www-data $APP_HOME

# Start
COPY environments/prod/start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh
CMD ["start.sh"]