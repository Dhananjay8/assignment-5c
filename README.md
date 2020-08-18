# assignment-5c

###

##### Create MySQL table

```
mysql -uroot -proot
GRANT ALL PRIVILEGES ON *.* TO 'dhananjay'@'localhost' IDENTIFIED BY 'dhananjay';
exit

mysql -udhananjay -pdhananjay

CREATE DATABASE test;
USE test;
```

##### Migrations for table creation

```
source set_env_vars.sh
node ./app/sequelize.js
```

##### Start Server

```
source set_env_vars.sh
npm start
```
