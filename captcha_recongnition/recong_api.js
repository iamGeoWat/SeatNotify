const axios = require('axios')
const fs = require('fs')
let anticaptcha = require('./anticaptcha')('d9f06c5d2abd86fcade57c2fd305377a')
anticaptcha.setMinLength(4)

fs.readdirSync('./unrecongnized_images').forEach((item, index) => {
	let bitmap = fs.readFileSync('./unrecongnized_images/' + item)
	let base64str = Buffer.from(bitmap, 'binary').toString('base64')
	console.log('now reading: ', item)
	
	anticaptcha.createImageToTextTask({
		body: base64str,
		numeric: 2,
		maxLength: 4,
		comment: 'Captcha only have letters, no number'
	}, (err, taskId) => {
		if (err) {
			console.log('oops', err)
			return
		}
		console.log('task sent: ', taskId)
		anticaptcha.getTaskSolution(taskId, (err, taskSolution) => {
			if (err) {
				console.log('oops', err)
				return
			}
			console.log('answer received: ', taskSolution.toUpperCase())
			console.log('renaming...', item, ' to...', taskSolution.toUpperCase() + '-' + item)
			fs.rename('./unrecongnized_images/' + item, './recongnized_images/' + taskSolution.toUpperCase() + '-' + item, () => {
				console.log('moved!')
			})
		})
	})
})