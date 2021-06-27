/* global process, require */
const express = require('express');
const http = require('http');
const parser = require('body-parser');
const sendgrid = require('@sendgrid/mail');

const app = express();
const to = process.env.CONTACT_EMAIL || 'bosstaxact@mailinator.com';
const subject = 'Boss Tax and Accounting inquiry';
const textTemplate = 'Hello Latisha, my name is {name} and I am inquiring about services related to {service}' +
    ' at Boss Tax and Accounting. Kindly respond at your earliest convenience. I look forward to working with you.';
const htmlTemplate = '<p>Hello Latisha, <p/>' +
    ' My name is {name} and I am inquiring about services related to <strong>{service}</strong> at Boss Tax and Accounting.' +
    ' Kindly respond at your earliest convenience. I look forward to working with you.';

app.use(parser.json({ limit: '50mb' }));
app.use(parser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/send-email', function (request, response) {
    response.send({ status: 200, message: 'Email sent successfully' });
});

app.post('/send-email', function (request, response) {
    if (process.env.KEY) {
        const body = request.body;
        const from = body.email;
        const text = textTemplate.replace(/{name}/, body.name).replace(/{service}/, body.service);
        const html = htmlTemplate.replace(/{name}/, body.name).replace(/{service}/, body.service);
        const email = { to, from, subject, text, html };
        sendgrid.setApiKey(process.env.KEY);
        sendgrid.send(email).then(() => {
            console.log(email);
            response.send({ status: 200, message: 'Email sent successfully' });
        }).catch(message => {
            response.send({ status: 500, message });
        });
    }
});

let server, port = process.env.PORT || 8888;
server = http.createServer({}, app);

server.listen(port, function () {
    console.log('Starting the Boss Tax and Accounting service');
    console.log('App is currently listening on port ' + port);
});
