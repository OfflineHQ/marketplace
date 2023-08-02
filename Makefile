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
	@docker-compose -f docker-compose.yaml down --volumes
	@docker-compose -f ./tools/test/docker-compose.yml --env-file ./tools/test/.env.test.jest down --volumes

restart-hasura:
	@docker-compose -f docker-compose.yaml --env-file .env.local restart hasura-engine

reset-nx-cache:
	@pnpm run nx reset && rm -rf node_modules/.cache/nx dist
