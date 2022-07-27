const express = require('express')
const router = express.Router();
const postController  = require("../controllers/postsControllers");
const checkAuth = require("../middlewares/check_auth");
const extractFile = require("../middlewares/file");

router.get('', postController.getAllPosts);

router.post("", 
    extractFile,
    checkAuth,postController.addPost)

router.delete('/:id', checkAuth,postController.deletePost)

router.put('/:id', 
    extractFile,
    checkAuth, postController.updatePost)

router.get('/:id', checkAuth,postController.getPost)


module.exports = router;