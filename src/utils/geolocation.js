export default () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(position)
      }, function (err) {
        reject('User rejected.')
      })
    } else {
      reject('Geolocation not supported.')
    }
  })
