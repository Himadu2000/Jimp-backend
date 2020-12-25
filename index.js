var Jimp = require("jimp")
const app = require("express")()
var upload = require("multer")({ dest: "uploads/" })
const helmet = require("helmet")
const cors = require("cors")
const lodash = require("lodash")

const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.all("*", (req, res, next) => {
  console.info(req.ip)
  next()
})

app.post("/", upload.array("photos"), (req, res) => {
  console.log(req.body)
  const processedImages = []
  const { greyscale, quality } = req.body
  req.files.forEach(file => {
    Jimp.read(file.path)
      .then(image => {
        if (greyscale == "true") {
          image.greyscale()
        }
        image
          // .greyscale(greyscale)
          .quality(lodash.toInteger(quality))
          .getBase64("image/png", (error, value) => {
            if (error) {
              console.error(error)
            } else {
              processedImages.push(value)
            }
          })
        if (req.files.length === processedImages.length) {
          res.send(processedImages)
        }
      })
      .catch(err => console.error(err))
  })
})

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
})
