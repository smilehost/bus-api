#!/bin/bash

# ออกจาก script ถ้า error
set -e

# โหลดค่า ENV จาก .env
export $(grep -v '^#' .env | xargs)

echo "🚀 Running SonarQube scanner..."
sonar-scanner \
  -Dsonar.token=$SONAR_TOKEN \
  # -Dsonar.host.url="http://94.237.73.171:9000" \
  # -Dsonar.projectKey="bussing" \
  # -Dsonar.projectName="bussing" \
  # -Dsonar.sources="." \
  # -Dsonar.exclusions="**/__tests__/**, **/*.test.ts, **/*.test.js, **/test/**, **/mock/**, **/docs/**, **/zzzzzzzzzzzzzzzzz.txt" \
  -Dsonar.javascript.lcov.reportPaths="coverage/lcov.info" \
  # -Dsonar.typescript.tsconfigPath="tsconfig.json"
  # ถ้ามี test execution report ก็เพิ่มได้ เช่น
  # -Dsonar.testExecutionReportPaths="test-report.xml"