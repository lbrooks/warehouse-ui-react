const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express')
const app = express()
const port = 3000

const initJaegerTracer = require("jaeger-client").initTracer;

function initTracer(serviceName) {
  var config = {
    serviceName: serviceName,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
        collectorEndpoint: process.env.JAEGER_URL //'http://localhost:14268/api/traces',
    },
  };
  var options = {
    tags: {
      'version': '0.0.1',
    },
    logger: {
      info: function logInfo(msg) {
        console.log("INFO ", msg);
      },
      error: function logError(msg) {
        console.log("ERROR", msg);
      },
    },
  };
  return initJaegerTracer(config, options);
}

const tracer = initTracer('warehouse-react');

app.use('/api', createProxyMiddleware({ target: process.env.WAREHOUSE_URL, changeOrigin: true })); //'http://localhost:3001'
app.use(express.static('build'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})