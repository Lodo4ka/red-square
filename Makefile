run-app:
	docker compose up --build

stop-app:
	docker compose down

restart-app:
	docker compose down
	docker compose up -d
