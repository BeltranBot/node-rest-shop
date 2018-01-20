const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth') 
const ProductController = require('../controllers/products')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString()
    const date = now.replace(/:/g, '-')
    cb(null, date + file.originalname);
  }
})
const fileFilter = function (req, file, cb) {
  const acceptedMimetypes = [
    'image/jpeg', 'image/png'
  ]
  // accept a file
  if (acceptedMimetypes.indexOf(file.mimetype) !== -1) {
    cb(null, true)
  } else {
    // reject a file
    cb(new error('Format no valid'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.get('/', checkAuth, ProductController.get_all)

router.post('/', upload.single('productImage'), checkAuth, ProductController.store)

router.get('/:productId', ProductController.get)

router.patch('/:productId', checkAuth, ProductController.patch)

router.delete('/:productId', checkAuth, ProductController.delete)

module.exports = router