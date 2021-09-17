ECR_URL="ECR_URL"
REPOSITORY_NAME="REPO_NAME"

aws ecr get-login-password --region eu-south-1 --profile aws | docker login --username AWS --password-stdin "$ECR_URL"

docker build --no-cache -t "$REPOSITORY_NAME" .
docker tag "$REPOSITORY_NAME:latest" "$ECR_URL/$REPOSITORY_NAME:latest"
docker push "$ECR_URL/$REPOSITORY_NAME"
