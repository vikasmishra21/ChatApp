let socket = io()

socket.on('connect', () => {
console.log('Connected to server');
});

socket.on('disconnect', () => {
console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    // console.log('newMessage', message)
    // let li = document.createElement('li')
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}`
    // document.querySelector('body').appendChild(li)
    const template = document.querySelector('#message-template').innerHTML
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div)
})

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#location-message-template').innerHTML
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div)
    // console.log('newLocationMessage', message)
    // let li = document.createElement('li')
    // let a = document.createElement('a')
    // li.innerText = `${message.from} ${formattedTime}: `
    // a.setAttribute('target', '_blank')
    // a.setAttribute('href', message.url)
    // a.innerText = 'My current location'
    // li.appendChild(a)
    // document.querySelector('body').appendChild(li)
})

// socket.emit('createMessage', {
//     from: 'john',
//     text: 'Hey'
// } , (message) => {
//     console.log('Got it.', message)
// })

document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault()

    socket.emit('createMessage', {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, (msg) => {

    })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geo location is not supported by the browser.')
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('createLocationMessage', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        })
    }, () => {
        alert('Unable to fetch location.')
    })
})