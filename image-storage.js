const casual = require('casual')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 7880

server.use(jsonServer.bodyParser)
server.use(middlewares)

function generate_photos(min, max) {
    let photos = []
    if (min < 0 || max < min) {
        return photos
    }

    min = Math.ceil(min)
    max = Math.floor(max)
    photos_count = Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < photos_count; i++) {
        photos.push(casual.domain + '/' + casual.word + '.jpeg')
    }

    return photos
}

casual.register_provider({
    submission: () => {
        return {
            id: casual.integer(from = 1, to = 256),
            photos: generate_photos(8, 64),
            submission_date: casual.date(format = 'YYYY-MM-DD') + 'T' + casual.time(format = 'hh:mm:ss.sssZ'),
        }
    }
})

let submissions = [];

function generate_submissions() {
    setTimeout(() => {
        submissions.push(casual.submission)
        generate_submissions()
    }, Math.floor(Math.random() * 10) + 5 * 1000)
}

server.get('/new_submissions', (request, response) => {
    if (request.method === 'GET') {
        let new_subs = submissions.filter(submission => submission.status != "Done")
        response.status(200).jsonp(new_subs)
    }
})

server.post('/change_submission_status', (request, response) => {
    if (request.method === 'POST') {
        let id = request.body['id']
        let status = request.body['status']
        if (id != null && status != null) {
            for (const i in submissions) {
                const s = submissions[i]
                if (s.id == id) {
                    s.status = status
                    console.log('Set status of submission ' + id + ' to ' + status)
                }
            }
            response.status(200).jsonp()
        } else {
            response.status(404).jsonp()
        }
    }
});

server.listen(port, () => {
    console.log('Image storage API mock is running')
    generate_submissions()
})
