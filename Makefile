SHELL := /bin/bash

.PHONY: hasura-console install run clean db-clean db-migrate db-dump prune update populate-backend django-bash test-web generate-gql web

all: run

install:
	@pnpm i

build:
	@docker-compose -f docker-compose.yaml --env-file .env.local build

build-no-cache:
	@docker-compose -f docker-compose.yaml --env-file .env.local build --no-cache

run: install build
	
build-run-no-cache:	build-no-cache
	run-no-cache

prune:
	@docker-compose -f docker-compose.yaml --env-file .env.local down
	@docker-compose -f docker-compose.yaml --env-file .env.local rm -f

clean:	prune
	@pnpm run clean

db-clean:
	@node ./tools/deleteAllData.js

seed-hasura:
	@docker-compose exec -T hasura-console bash -c "cd /usr/src/hasura/app && hasura seeds apply --database-name=default"

reset-db-and-seeds: db-clean seed-hasura

db-clean-test:
	@DB_PORT=5454 node ./tools/deleteAllData.js

reset-docker:
	@docker-compose -f docker-compose.yaml down --volumes
	@docker-compose -f ./tools/test/docker-compose.yml --env-file ./tools/test/.env.test.jest down --volumes

restart-hasura:
	@docker-compose -f docker-compose.yaml --env-file .env.local restart hasura-engine

restart-hasura-test:
	@docker-compose -f ./tools/test/docker-compose.yml --env-file ./tools/test/.env.test.jest restart hasura-engine