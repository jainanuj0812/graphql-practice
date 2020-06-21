const users = [
    {
        id: "1",
        name: "Andrew Symon",
        email: "andrewS@example.com"
    },
    {
        id: "2",
        name: "Anuj Jain",
        email: "anuj.jain@example.com",
        age: 43
    },
    {
        id: "3",
        name: "Sarah Los",
        email: "sarah.los@example.com",
        age: 43
    }
]

const posts = [
    {
        id: "1",
        title: "Node JS",
        body: "Loremipsum Text",
        published: true,
        author: '1'
    },
    {
        id: "2",
        title: "Angular",
        body: "Loremipsum Text",
        published: true,
        author: '1'
    },
    {
        id: "3",
        title: "React",
        published: false,
        author: '2'
    },
]

const comments = [
    {
        id: "1",
        text: "This is awesome",
        post: "2",
        author: "1"
    },
    {
        id: "2",
        text: "This is great",
        post: "1",
        author: "2"
    },
    {
        id: "3",
        text: "loving it",
        post: "1",
        author: "3"
    },
    {
        id: "4",
        text: "way to go man",
        post: "2",
        author: "3"
    },
    {
        id: "5",
        text: "waiting for next classes from you",
        post: "3",
        author: "3"
    }
]

const db = {
    users,
    posts,
    comments
}

export {db as default}