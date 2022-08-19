# Penta Security Server [![pipeline status](https://git3.fsoft.com.vn/GROUP/gmose_mobilitysecurity/gmose-backend/badges/develop/pipeline.svg)](https://git3.fsoft.com.vn/GROUP/gmose_mobilitysecurity/gmose-backend/-/commits/develop) [![coverage report](https://git3.fsoft.com.vn/GROUP/gmose_mobilitysecurity/gmose-backend/badges/develop/coverage.svg)](https://git3.fsoft.com.vn/GROUP/gmose_mobilitysecurity/gmose-backend/-/commits/develop)

## Description

[NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Table of Contents

- [Features](#features)
- [Quick run](#quick-run)
- [Links](#links)
- [Database utils](#database-utils)
- [Generate SSL Cert](#generate-ssl-cert)
- [Tests](#tests)

## Features

- [x] NodeJS ([16.x.x](https://nodejs.org/download/release/latest-v16.x/))
- [x] NestJS ([8.x.x](https://docs.nestjs.com/#installation))
- [x] PostgreSQL ([14.2](https://www.postgresql.org/download/))
- [x] TypeORM ([0.2.x](https://www.npmjs.com/package/typeorm))
- [x] Websocket
- [x] Swagger
- [x] Unit tests

## Quick run

```bash
$ cp env-example .env
$ npm install
$ npm run migration:run
$ npm run seed:run
$ npm run start:dev
```

## Links

- Swagger: http://localhost:3000/api/docs
- Socket: http://localhost:3000

## Database utils

Generate migration

```bash
npm run migration:create -- CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Generate SSL Cert

```bash
$ openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out gmoseapp.csr -days 365
$ openssl rsa -in keytmp.pem -out gmoseapp.key
```

## Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# test clear cache
$ npm run test:clearCache
```
