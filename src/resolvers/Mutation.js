import uuidv4 from 'uuid/v4';

const Mutation =  {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user)=>{
            return user.email === args.data.email
        })

        if(emailTaken) {
            throw new Error('Email already taken')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)
        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)
        if(userIndex == -1) {
            throw new Error('User not found')
        }

        const deletedUser = db.users.splice(userIndex, 1);
        // removing related data in other entity

        db.posts = db.posts.filter((post) => {
            const match = post.author == args.id
            if(match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match
        })

        db.comments = db.comments.filter((comment)=> comment.author !== args.id)
        return deletedUser[0];
    },
    updateUser(parent, args, { db }, info) {
        
        const {id, data} = args; 

        const user = db.users.find((user) => user.id === id)
        if(!user) {
            throw new Error('User not found')
        }

        if(typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)

            if(emailTaken) {
                throw new Error('email already taken')
            }
            user.email = data.email
        }

        if(typeof data.name === 'string') {
            user.name = data.name
        }

        if(typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user;
        
    },
    createPost(parent, args, { db, pubsub }, info) {

        const userExist = db.users.some((user)=>{
            return user.id === args.data.author
        })

        if(!userExist) {
            throw new Error('User not registered')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        if(args.data.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "CREATED",
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if(postIndex == -1) {
            throw new Error('Post not found')
        }

        const [post] = db.posts.splice(postIndex, 1);
        // removing related data in other entity
        db.comments = db.comments.filter((comment)=> comment.post !== args.id)

        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }

        return post

    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        if(!post) {
            throw new Error('Post not found')
        }

        const originalPost = {...post}

        if(typeof data.title === 'string') {
            post.title = data.title
        }

        if(typeof data.body === 'string') {
            post.body = data.body
        }

        if(typeof data.published === 'boolean') {
            post.published = data.published
            if(originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            }
        } else if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info) {

        const userExist = db.users.some((user)=>{
            return user.id === args.data.author
        })

        if(!userExist) {
            throw new Error('User not registered')
        }

        const postExistAndPublish = db.posts.some((post)=>{
            return post.id === args.data.post && post.published
        })

        if(!postExistAndPublish) {
            throw new Error('Post not exist')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`COMMENT ${args.data.post}`, {
            comment: {
                mutation: "CREATED",
                data: comment
            }
        })

        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if(commentIndex == -1) {
            throw new Error('Comment not found')
        }
        const [comment] = db.comments.splice(commentIndex, 1);
        
        pubsub.publish(`COMMENT ${comment.post}`, {
            comment: {
                mutation: "DELETED",
                data: comment
            }
        })
        
        return comment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)
        if(!comment) {
            throw new Error('Comment not found')
        }

        if(typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`COMMENT ${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }