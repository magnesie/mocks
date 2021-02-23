const casual = require('casual')
const http = require('http')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 7879

server.use(jsonServer.bodyParser)
server.use(middlewares)
server.set('trust proxy', true)

casual.register_provider({
    photogrammetry_job: () => {
        return {
            id: casual.uuid,
            status: 'InProgress'
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


server.post('/job', (request, response) => {
    if (request.method === 'POST') {
        let photos = request.body['photos']
        let callback = request.body['callback']
        if (Array.isArray(photos) && photos.length > 0 && callback != null) {
            const uuid = casual.uuid
            response.status(200).jsonp({ id: start_job(photos, callback, request.ip) })


        } else {
            console.log(photos)
            console.log(callback)
            response.status(400).jsonp()
        }
    }
});

server.get('/job/:id', (request, response) => {
    if (request.method === 'GET') {
        const id = request.params['id']

        let job = undefined;

        for (let i in jobs) {
            if (jobs[i].id == id) {
                job = jobs[i];
                break;
            }
        }

        if (job != null) {
            response.status(200).jsonp(job)
        } else {
            response.status(400).jsonp()
        }
    }
})

server.listen(port, '0.0.0.0', () => {
    console.log('Photogrammetry API mock is running')
})

let jobs = [];
const start_job = (photos, callback, ip) => {
    let job = casual.photogrammetry_job
    jobs.push(job);

    const job_duration = photos.length * 100

    setTimeout(() => {
        for (let i in jobs) {
            if (jobs[i].id == job.id) {
                jobs[i].status = 'Finished';
                break;
            }
        }
        const url = 'http://' + ip + ':7878' + callback + '/' + job.id
        http.get(url, (res) => {
            let data = ''

            res.on('data', d => {
                data += d
            })
            res.on('end', () => {
                // console.log(data)
            })

            res.on('error', (chunk) => {
                console.log(chunk);
            })
        })
    }, job_duration)

    return job.id
}
