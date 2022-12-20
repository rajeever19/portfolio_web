const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const { getPostById } = require('./stub/posts');
const { default: axios } = require('axios');
const { API_ENDPOINTS } = require('../../src/api/apiEndPoints');
const PORT = process.env.PORT || 3000;

// static resources should just be served as they are
app.use(express.static(
    path.resolve(__dirname, '..', 'build'),
    { maxAge: '30d' },
));
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
})
// const indexPath = path.resolve(__dirname, '../../public', 'index.html');
const indexPath = path.resolve(__dirname, 'build', 'index.html');

app.get('/*', (req, res, next) => {
    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        console.error('Error during file reading rajeev',);

        // TODO get post info

        // TODO inject meta tags
    });
});
app.get('/course/:id', (req, res, next) => {
    fs.readFile(indexPath, 'utf-8',async (err, htmlData) => {
        if (err) {
            console.error('Error during file reading', err);
            return res.status(404).end()
        }
        // get post info
        const postId = req.params.id;


        const post =await getdata(postId)
        if (!post) return res.status(404).send("Post not found");
        // inject meta tags
        htmlData = htmlData.replace(
            "<title>Eduley App</title>",
            `<title>${post?.name}</title>`
        )
            .replace('__META_OG_TITLE__', post?.name)
            .replace('__META_OG_DESCRIPTION__', post?.short_description)
            .replace('__META_DESCRIPTION__', post?.short_description)
            .replace('__META_OG_IMAGE__', post?.poster_image?.media_file)
        return res.send(htmlData);
    });
});


const getdata = async (id) => {
    console.log('rajeev', id)
    try {
        let res = await axios.get(`${API_ENDPOINTS.COURSE}/${id}/`)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }

}