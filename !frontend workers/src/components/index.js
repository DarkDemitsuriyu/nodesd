const files = require.context('.', true, /\.vue$/)//
const components = {}

files.keys().forEach(key => {
  components[files(key).default.name] = files(key).default//
})

export default components
