const App = {
  map: null,
  modal: null,
  icon1: null,
  icon2: null
}

const initMap = () => {
  const map = L.map('map')

  L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: '<a href=\'https://maps.gsi.go.jp/development/ichiran.html\' target=\'_blank\'>地理院タイル</a>'
  }).addTo(map)

  map.setView([35.1775968005358, 134.33601379394534], 13)

  /*map.on('click', (e) => {
    const { lat, lng } = e.latlng
    console.log(`${lng},${lat}`)
  })*/

  App.map = map
  App.icon1 = L.icon({
    iconUrl: 'assets/flower.png',
    iconSize: [95, 90],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  })

  App.icon2 = L.icon({
    iconUrl: 'assets/flower_success.png',
    iconSize: [95, 90],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  })
}

const getData = async () => {
  const res = await axios.get('./data/quest.json')
  return res.data
}

const showMarkers = (geojson) => {
  L.geoJSON(geojson, {
    pointToLayer: (geoJsonPoint, latlng) => {
      return L.marker(latlng, {
        icon: App.icon1
      })
    }
  }).on('click', (e) => {
    showData(e.layer.feature.properties, e.layer)
  }).addTo(App.map)
}

const showData = (properties, layer) => {
  document.getElementById('title').textContent = properties.title
  document.getElementById('content').textContent = properties.content
  document.getElementById('skill').textContent = properties.skill
  document.getElementById('accept').innerHTML = 'Accept'
  document.getElementById('quest').className = ''
  document.getElementById('accepted').className = 'd-none'
  document.getElementById('accept').onclick = () => {
    document.getElementById('accept').innerHTML = `<div class="spinner-border spinner-border-sm" role="status"></div>`
    setTimeout(() => {
      document.getElementById('quest').className = 'd-none'
      document.getElementById('accepted').className = ''
      document.getElementById('accept').innerHTML = 'Send message'
      layer.setIcon(App.icon2)
      document.getElementById('accept').onclick = () => {
        App.modal.hide()
      }
    }, 2000)
  }
  App.modal.show()
}

const initScrollMessage = () => {
  const speed = 20// 20ミリ秒(0.02秒)ごとに発火
  const container = document.getElementById('messages')
  let last = 0
  const scrollPage = () => {
    container.scrollBy(0, 1)//1pxずつ下にずれる
    last++
    if (last > container.scrollHeight - container.clientHeight) {
      container.scrollTo(0, 0)
      last = 0
      setTimeout(scrollPage, speed * 50)
    } else {
      setTimeout(scrollPage, speed)
    }
  }
  scrollPage()
}

window.addEventListener('load', async () => {
  App.modal = new bootstrap.Modal(document.getElementById('modal'), { backdrop: 'static' })
  initMap()
  showMarkers(await getData())
  setTimeout(() => {
    initScrollMessage()
  }, 1000)
})
