export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>About Me</title>
        </head>
        <body>
            <h1>About Me Page</h1>
            <p>This is a test to see if the API route works.</p>
            <a href="/">Back to Home</a>
        </body>
        </html>
    `);
}