const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post

    //TODO need to add some functionality to verification content.
    //Right now it even adding an empty post.

    let post  = {

        userId: request.currentUser.id,
        text: request.body.text,

        media: {
            type: request.body.media.type,
            url: request.body.media.url
        }
    }

    PostModel.create(post, () => {
        response.status(201).json()
    });
    response.json([]);
});


    /**
    let post;

    if (request.body.text != ' ' || request.body.media.url != ' ') {
        post = {

            userId: request.currentUser.id,
            text: request.body.text,

            media: {
                type: request.body.media.type,
                url: request.body.media.url
            }
        }
    }
    else {
        post = null;
    }

    if (post != null) {
        PostModel.create(post, () => {
            response.status(201).json()
            response.json([]);
        });
    }
    else if (post == null) {
        response.status(406).json()
        response.json([]);
    }
     **/




router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    PostModel.like(request.currentUser.id,request.params.postId, () => {
        response.status(201)
    });
    response.json([])
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    PostModel.unlike(request.currentUser.id, request.params.postId,() => {
        response.status(201)
    });
    response.json([])
});

module.exports = router;
