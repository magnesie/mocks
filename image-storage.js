const casual = require('casual')

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = 7880

server.use(jsonServer.bodyParser)
server.use(middlewares)

function generate_photos(min, max){
	let photos = []
	if (min < 0 || max < min) {
		return photos
	}

	min = Math.ceil(min)
	max = Math.floor(max)
	photos_count = Math.floor(Math.random() * (max - min + 1)) + min;

	for(let i = 0; i < photos_count; i++) {
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

server.get('/new_submissions', (request, response) => {
    if (request.method === 'GET') {
        const submissions = []

        for (let i = 0; i < Math.floor(Math.random() * (5 + 1)) ; i++) {
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
