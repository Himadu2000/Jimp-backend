var Jimp = require("jimp")
const app = require("express")()
var upload = require("multer")({ dest: "uploads/" })
const helmet = require("helmet")
const cors = require("cors")

const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.all("*", (req, res, next) => {
  console.info(req.url)
  next()
})

app.post("/", upload.array("photos"), (req, res) => {
  // console.log(req.files);
  const processedImages = []
  req.files.forEach(file => {
    Jimp.read(file.path)
      .then(image => {
        image.getBase64("image/png", (err, value) => {
          processedImages.push(value)
        })
        if (req.files.length === processedImages.length) {
          res.send(processedImages)
        }
      })
      .catch(err => console.error(err))
  })
  // res.set("Content-Type", "image/png");
  // res.send(Buffer(processedImages));
  // res.send(Buffer(processedImages));
})

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
})
