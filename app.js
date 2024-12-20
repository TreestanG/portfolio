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

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        header: 'about'
    });
});


app.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Projects',
        header: 'projects',
        projects: projects.projects
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});