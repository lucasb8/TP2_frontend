sleep 5 # waits until the database as started
cp -r build/typings/* dist-typings/
echo "CREATE DATABASE $MYSQL_DATABASE" | mysql -h "$MYSQL_HOST" --protocol=tcp -u "$MYSQL_USERNAME" && npm run db:prepare:prod && npm run db:seeds
echo "CREATE DATABASE ${MYSQL_DATABASE}_test" | mysql -h "$MYSQL_HOST" --protocol=tcp -u "$MYSQL_USERNAME" && npm run db:prepare:test
node --async-stack-traces index.js
