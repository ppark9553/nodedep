var io = require('socket.io').listen(3000)
var pg = require ('pg')

var con_string = 'tcp://arbiter:makeitpopweAR!1@localhost/arbiter'

var pg_client = new pg.Client(con_string)
pg_client.connect()
var query = pg_client.query('LISTEN projectstate')

io.sockets.on('connection', function (socket) {
    socket.emit('connected', { connected: true })

    socket.on('ready for data', function (date, task_name, status, log, time) {
        pg_client.on('notification', function(title) {
            socket.emit('update', {
              today_date: date,
              task_just_update: task_name,
              task_status: status,
              task_log: log,
              task_processed_time: time
            })
        })
    })
})
