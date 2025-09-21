setup-project:
	cp .env.example .env
	npm install

run-app:
	docker compose up --build migrate
	docker compose up --build

stop-app:
	docker compose down

restart-app:
	docker compose down
	docker compose up -d migrate
	docker compose up -d

migrate:
	docker compose run --rm migrate
