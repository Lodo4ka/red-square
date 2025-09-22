setup-project:
	cp .env.example .env
	npm install

run-app-backend:
	docker compose up --build migrate
	docker compose up --build

run-app-frontend:
	npm run client:dev

stop-app:
	docker compose down

restart-app:
	docker compose down
	docker compose up -d migrate
	docker compose up -d

migrate:
	docker compose run --rm migrate
