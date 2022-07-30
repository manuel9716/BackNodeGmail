const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const { google } = require("googleapis");
const express = require('express');


const OAuth2 = google.auth.OAuth2;
const app = express();

/**
 * Envia un correo por smtp via gmail
 * @route POST /message
 */
app.post('/message', function(req, res) {

    const { email_target, email_transmitter, email_message } = req.body;

    const createTransporter = async() => {
        const oauth2Client = new OAuth2(
            "549791319134-m3sfqcs442gotu25l7f4vh9suas10hj6.apps.googleusercontent.com", //cliend_id
            "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", //client_secret
            "https://www.googleapis.com/oauth2/v4/token" //redirect_uri
        );

        oauth2Client.setCredentials({
            refresh_token: "1//059NF8IsUWXTYCgYIARAAGAUSNwF-L9IrMObSr-_VGH1TtJlxGSDKv8M_hjHvZHLtY3UvC82z5JldR_RMyLQ86HaXj7631rReRdY"
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject("Failed to create access token :(");
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "manuelvalencia9716@gmail.com",
                accessToken,
                clientId: "549791319134-m3sfqcs442gotu25l7f4vh9suas10hj6.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//059NF8IsUWXTYCgYIARAAGAUSNwF-L9IrMObSr-_VGH1TtJlxGSDKv8M_hjHvZHLtY3UvC82z5JldR_RMyLQ86HaXj7631rReRdY"
            }
        });

        return transporter;
    };

    const sendEmail = async(emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions, function(err, info) {
            if (err) {
                res.json({
                    ok: false,
                    message: 'El mensaje no pudo ser mandado',
                    err
                });
            } else {
                res.json({
                    ok: true,
                    message: 'El mensaje enviado',
                    info
                });
            }
        });
    };

    sendEmail({
        from: 'manuelvalencia9716@gmail.com', // sender address
        to: "manuelvalencia9716@gmail.com", // list of receivers
        cc: email_target,
        subject: 'Datos Formulario', // Subject line
        html: `<p>Correo: ${email_target} <br>Nombre: ${email_transmitter} <br>Mensaje: ${email_message}</p>` // plain text body
    });

});

module.exports = app;