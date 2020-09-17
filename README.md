# 2-Dimensional Kinetics Simulator

Requirements:
1. npm/node
2. docker

## Usage

build
```shell script
npm run build
```

start
```shell script
npm start
```

open
```shell script
npm run open
```

stop
```shell script
npm stop
```

## Test

setup
```shell script
npm run test-setup
```

test
```shell script
npm test
```

cleanup
```shell script
npm run test-cleanup
```

start development mode
```shell script
npm run dev
```

## Maintenance

lint
```shell script
npm run lint
```

lint fix
```shell script
npm run lint:fix
```

clean
```shell script
npm run clean
```

## Notes

The tests are strict so there may be some flaking when run against different browsers or versions than the one they were developed against.

Some tests resize the document body.

Some tests assume that the simulation svg has the same dimensions as the document body (see grid tests).