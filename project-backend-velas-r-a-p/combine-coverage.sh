#!/bin/bash
# Script para combinar cobertura de tests unitarios y e2e para SonarQube

set -e

# Ejecuta unit tests con cobertura y guarda el reporte
npx jest --coverage --coverageDirectory=coverage/unit
cp coverage/unit/lcov.info coverage/lcov-unit.info

# Ejecuta e2e tests con cobertura y guarda el reporte
npx jest --config test/jest-e2e.json --coverage --coverageDirectory=coverage/e2e
cp coverage/e2e/lcov.info coverage/lcov-e2e.info

# Combina ambos reportes en uno solo
cat coverage/lcov-unit.info coverage/lcov-e2e.info > coverage/lcov.info

echo "Cobertura combinada generada en coverage/lcov.info"
