const Query = {
    users(parent, args, { db }, info) {
        if(!args.query) {
            return db.users
        }
        return db.users.filter((user) => {
           return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if(!args.query) {
            return db.posts
        }
        return db.posts.filter((post) => {
           return post.title.toLowerCase().includes(args.query.toLowerCase()) ||  (post.body && post.body.toLowerCase().includes(args.query.toLowerCase()))
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: "zeew",
            name: "Anuj Jain",
            email: "anuj.jain@asaasas.com"
        }
    },
    post() {
        return {
            id: "123",
            title: "ABC",
            published: false
        }
    }
}

export { Query as default }