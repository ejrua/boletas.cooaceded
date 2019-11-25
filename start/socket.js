const Ws = use('Ws')

const Event = use('Event')


Ws.channel('chat', 'ChatController')

// Ws.channel('chat', ({ socket }) => {
//     console.log('a new subscription for news topic-----')
//   })

// const chat = Ws.subscribe('chat')

// chat.on('ready', () => {
//   chat.emit('message', 'hello')
// })