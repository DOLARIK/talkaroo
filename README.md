# cornell health

### To deploy the project locally (staging environment):
```
docker-compose -f docker-compose.yml up --build
```
make sure to keep .env in the directory

### To deploy the development environmnet:
```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
make sure to keep .env and .env.dev files in the directory

### To deploy the production environmnet:
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```
make sure to keep .env and .env.prod files in the directory




