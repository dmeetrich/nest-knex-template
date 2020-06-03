# NestJS Knex Template

## Development

Install docker:

```bash
brew install docker
```

Install node.js

```bash
brew install node
```

To start database and migrate it in docker just run a command:

```bash
docker-compose up -d
```

After db starting you should run seed for db:

```bash
npm run knex seed:run
```

To start local server just run a command:

```bash
npm run webpack:build
```

and in another console window:

```bash
npm run webpack:start
```
