# WWOF

An energy efficient offloading framework for migrating web worker from browser to server


## download
```
git clone -b server https://github.com/NewFuture/WWOF.git
```

## run with [docker](https://github.com/NewFuture/WWOF-docker)

```
docker run -it --rm -p 8888:8888 -v "$(pwd)/WWOF/":/newfuture/wwof newfuture/wwof node app.js
```

## run manually
```
npm install
```
```
node app.js
```