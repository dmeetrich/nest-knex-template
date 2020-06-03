# REQUIRED SECTION
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
include $(ROOT_DIR)/.mk-lib/common.mk
# END OF REQUIRED SECTION

.PHONY: help dependencies up start stop restart status ps clean

clean: confirm ## Clean all data
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

console: ## Show status of containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) exec app bash

log: ## show all the logs
	@$(DOCKER_COMPOSE) logs --tail=100 -f $(c)

ps: status ## Alias of status

restart: ## Restart all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop $(c)
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up $(c) -d

start: ## Start all or c=<name> containers in background
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d $(c)

stop: ## Stop all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop $(c)

status: ## Show status of containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

up: ## Start all or c=<name> containers in foreground
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up $(c)

psql:
	@docker exec -it template-postgres-db psql -U postgres
