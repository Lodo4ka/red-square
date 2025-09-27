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

run-database-gui:
	docker compose run --rm -p 5555:5555 -e DATABASE_URL=postgresql://app:app@db:5432/app migrate npx prisma studio --hostname 0.0.0.0 --port 5555
