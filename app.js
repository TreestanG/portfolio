const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const expressLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // tells Express to use views/layout.ejs as the default layout

const projects = require('./public/projects.json')

const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

function convertMarkdownToHtml(filePath) {
    if (!filePath.endsWith('.md')) return ''

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return '';
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const contentWithout = content.split('---')[1]
        return md.render(contentWithout);
    } catch (error) {
        console.error(`Error reading markdown file: ${error}`);
        return '';
    }
}

app.use((req, res, next) => {
    if (req.hostname === 'tristangee.com') {
        return res.redirect(301, 'https://www.tristangee.com' + req.originalUrl);
    }

    if (req.url.endsWith('.js.map')) {
        return res.status(404).end();
    }

    next();
});

app.get('/blogs/:page', (req, res) => {
    const pageName = req.params.page.replace(/\.js\.map$/, ''); 
    const mdPath = path.join(__dirname, 'content', `${pageName}.md`);
    const htmlContent = convertMarkdownToHtml(mdPath);

    res.render('blogPage', {
        content: htmlContent,
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        header: ''
    });
});

//routes 

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        header: 'about'
    });
});

app.get('/blogs', (req, res) => {

    let blogsContent = []

    fs.readdirSync(path.join(__dirname, 'content'))
        .filter(file => file.endsWith('.md'))
        .forEach(file => {
            const mdPath = path.join(__dirname, 'content', file);
            const content = fs.readFileSync(mdPath, 'utf-8');

            const overview = content.split('---')[0]
            const title = overview.match(/title: (.*)/)
            const synopsis = overview.match(/synopsis: (.*)/)
            const date = overview.match(/date: (.*)/)

            blogsContent.push({
                title: title[1],
                synopsis: synopsis[1],
                date: date[1],
                url: file.replace('.md', '')
            })
        })

    res.render('blogs', {
        title: 'Blogs',
        header: 'blogs',
        blogs: blogsContent
    });
});


app.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Projects',
        header: 'projects',
        projects: projects.projects
    });
});

app.get('/websites', (req, res) => {
    res.render('websites', {
        title: "Websites",
        header: 'websites'
    })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});