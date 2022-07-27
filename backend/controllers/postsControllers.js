const express = require("express");
const Post = require("../models/post");

exports.getAllPosts = async(req,res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery.then(doc => {
        fetchedPosts = doc;
        return Post.count();
    })
    .then(count => {
         res.status(200).json({
            msg:"Post fetched successfully",
            posts: fetchedPosts,
            maxCount: count
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({msg:"Couldn't load posts"})
    })
}

exports.addPost = async(req,res) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post({
            title:req.body.title,
            content:req.body.content,
            image: url + "/images/" + req.file.filename,
            creator: req.userData
        });
        post.save()
        .then((createdPost) => {
            res.status(201).json({
                msg:"POst added successfully!!",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            })
            console.log("POst added");
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({msg:"Creating post failed!!"})
        })
}

exports.deletePost = async(req,res) => {
    Post.findByIdAndDelete({_id:req.params.id, 
        creator: req.userData.userId})
        .then(result => {
            if(result._id.toString() === req.params.id){
                res.status(200).json({msg:"Deleted!!"})
            }else {
                res.status(500).json({msg:"Not authorized to delete this post"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg:"Couldn't delete post"})
        })
}

exports.updatePost = async(req,res) => {
    let imagePath = req.body.image;
            if(req.file) {
                const url = req.protocol + "://" + req.get("host");
                imagePath = url + "/images/" + req.file.filename
            }
            const post = new Post({
                _id:req.params.id,
                title:req.body.title,
                content: req.body.content,
                image: imagePath,
                creator: req.userData
            });
            Post.updateOne(
                {_id:req.params.id, 
                creator: req.userData}, post)
            .then((result) => {
                if(result.matchedCount > 0){
                    res.status(200).json({msg:"Updated!!"})
                }else {
                    res.status(500).json({msg:"Not authorized to update this post"})
                }
                console.log(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({msg:"Couldn't update post"})
            })
}


exports.getPost = async(req,res) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else {
            res.status(404).json({msg:"No post found"});
        }
    })
    
    .catch(err => {
        console.log(err);
        res.status(500).json({msg:"Couldn't load posts"})
    })
}