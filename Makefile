DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.yml -f docker-compose.prod.yml

# Targets
build:
	bash scripts/build.sh $(ARGS)

start:
	$(DOCKER_COMPOSE_PROD) up --build $(ARGS)

stop:
	$(DOCKER_COMPOSE_PROD) down $(ARGS)

# Targets with sudo
sudoBuild:
	sudo bash scripts/build.sh $(ARGS)

sudoStart:
	sudo $(DOCKER_COMPOSE_PROD) up --build $(ARGS)

sudoStop:
	sudo $(DOCKER_COMPOSE_PROD) down $(ARGS)
