# simple-server

#### A simple server based on Express

## Installation

Using npm:

	npm i --save https://github.com/svon/server

In Node.js:

	import Server from '@svon/server'

	const { app } = Server()

	app.get('/', function(req, res) {
		res.send('hello')
	})
