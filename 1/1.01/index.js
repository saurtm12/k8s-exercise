const getHashNow = () => {
    const randomhash = Math.random().toString(36).substring(2, 36)
    return randomhash
}

const print = () => {
    const timestamp = new Date().toISOString()

    console.log(timestamp + ' ' + getHashNow())
}

print()
setInterval(print, 5000)