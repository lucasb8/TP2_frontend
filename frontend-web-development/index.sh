/bin/wait-for mariadb:3306
cp -r build/typings/* dist-typings/
echo "CREATE DATABASE $MYSQL_DATABASE" | mysql -h "$MYSQL_HOST" --protocol=tcp -u "$MYSQL_USERNAME" && npm run db:prepare:prod && npm run db:seeds
echo "CREATE DATABASE ${MYSQL_DATABASE}_test" | mysql -h "$MYSQL_HOST" --protocol=tcp -u "$MYSQL_USERNAME" && npm run db:prepare:test
npm run test
npm run start
