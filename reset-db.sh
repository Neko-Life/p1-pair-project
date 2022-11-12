#!/bin/bash

echo "Doesn't work for heroku postgres, run `heroku run node heroku-migrate` instead"
sequelize db:drop $@
sequelize db:create $@
sequelize db:migrate $@
sequelize db:seed:all $@
