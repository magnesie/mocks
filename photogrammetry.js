const casual = require('casual')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 7879

server.use(jsonServer.bodyParser)
server.use(middlewares)


casual.register_provider({
    photogrammetry_job: () => {
        return {
        }
    }
})

/*
server.get('/new_submissions', (request, response) => {
    if (request.method === 'GET') {
        const submissions = []

        for (let i = 0; i < Math.floor(Math.random() * (5 + 1)); i++) {
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
});*/

server.listen(port, () => {
    console.log('Photogrammetry API mock is running')
})
