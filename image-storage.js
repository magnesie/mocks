const casual = require('casual')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 8080

server.use(jsonServer.bodyParser)
server.use(middlewares)

casual.register_provider({
    submission: () => {
        return {
            id: casual.integer(from = 1, to = 10),
            photos: [casual.url, casual.url, casual.url],
            submission_date: casual.date(format = 'YYYY-MM-DD') + 'T' + casual.time(format = 'hh:mm:ss.sssZ'),
        }
    }
})

server.get('/new_submissions', (request, response) => {
    if (request.method === 'GET') {
        const submissions = []

        for (let i = 0; i < 10; i++) {
            submissions.push(casual.submission)
        }

        response.status(200).jsonp(submissions)
    }
})

server.post('/change_submission_status', (request, response) => {
    if (request.method === 'POST') {
        let id = request.body['id']
        let status = request.body['status']
        if (id != null && id.length > 0 && status != null && status.length > 0 && ['Todo', 'Running', 'Done'].includes(status)) {
            response.status(200).jsonp()
        } else {
            response.status(404).jsonp()
        }
    }
});

server.listen(port, () => {
    console.log('Image storage API mock is running')
})
