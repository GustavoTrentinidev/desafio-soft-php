#!/bin/bash
set -e

# Change the current directory to the script directory
pushd $(dirname $0) > /dev/null

ID=$(docker inspect --format="{{.Id}}" php_desafio)

docker exec -it $ID bash -c "composer dump-autoload";
docker exec -it $ID bash -c "composer require --dev phpunit/phpunit ^10";

# Return to the previous directory
popd > /dev/null