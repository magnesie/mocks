const casual = require('casual')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 7881

server.use(jsonServer.bodyParser)
server.use(middlewares)

server.post('/result', (request, response) => {
    if (request.method === 'POST') {
        let submission_id = request.body['submission_id']
        let result_url = request.body['result_url']
        if (submission_id != null && result_url != null) {
            console.log('Result received: ' + result_url)
            response.status(200).jsonp()
        } else {
            response.status(404).jsonp()
        }
    }
});

server.listen(port, () => {
    console.log('Result storage API mock is running')
})
