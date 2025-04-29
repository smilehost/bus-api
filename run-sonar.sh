#!/bin/bash

# ออกจาก script ถ้า error
set -e

# โหลดค่า ENV จาก .env
export $(grep -v '^#' .env | xargs)

echo "🚀 Running SonarQube scanner..."
sonar-scanner \
  -Dsonar.token=$SONAR_TOKEN \
  -Dsonar.exclusions="coverage/**" \
  -Dsonar.javascript.lcov.reportPaths="coverage/lcov.info" \