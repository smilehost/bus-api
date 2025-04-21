#!/bin/bash

# โหลดค่า ENV จาก .env
export $(cat .env | xargs)

echo "📦 Running go test with coverage..."
go test -coverprofile=coverage.out ./...

echo "🚀 Running SonarQube scanner..."
sonar-scanner \
  -Dsonar.projectKey=Peoject \
  -Dsonar.sources=. \
  -Dsonar.go.coverage.reportPaths=coverage.out \
  -Dsonar.token=$SONAR_TOKEN