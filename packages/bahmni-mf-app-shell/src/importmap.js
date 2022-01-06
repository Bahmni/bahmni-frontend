if (!window.localStorage.hasOwnProperty('importMap')) {
  window.localStorage.setItem(
    'importMap',
    JSON.stringify({
      medication: [
        {
          name: 'medication-app',
          enabled: true,
          urls: ['/bahmni/mf/bahmni-medication/bundle.js'],
        },
      ],
    }),
  )
}

const importMap = JSON.parse(window.localStorage.getItem('importMap'))
