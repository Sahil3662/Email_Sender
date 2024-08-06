const { json } = require('express/lib/response');

module.exports = {
	main: async function (req, res) {
		const Joi = require('joi');


		const schema = Joi.object({
			email: Joi.string().min(5).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
			email_2: Joi.string().min(5).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
			subject : Joi.string().optional(),
		});

		try {
			let x = schema.validate(req.query);
			console.log(JSON.stringify(x));

			if (x.hasOwnProperty("error")) {
				res.send(x.error.details);
				return;
			}
		}
		catch (err) {
			console.log(err)
			res.send(err.stack);
			return;
		};

		const { Client } = require('pg');
        const client = new Client({
            user: 'postgres',
            password: '562314789',
            host: '127.0.0.1',
            port: '5432',
            database: 'sahil_db',
        });

        await client.connect();
		
		const nodemailer = require("nodemailer");
		const pg = require('pg');
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, // Use true for port 465, false for all other ports
			auth: {
				user: "satvikkambli@gmail.com",
				pass: "afhcgezhnfygsuhd",
			},
		});
		// console.log(req.body)
		// async..await is not allowed in global scope, must use a wrapper
		async function main() {
			let temp_attachments = [];
			if (req.body.hasOwnProperty("attachments")) {
				for (i = 0; i < req.body.attachments.length; i++) {
					temp_attachments.push({
						path: __dirname + "./../public/" + req.body.attachments[i]
					})
				}
			}

			try {// send mail with defined transport object
				let mail1 = req.query.email;
				let mail2 = req.query.email_2;
				const info = await transporter.sendMail({
					from: '"Maddison Foo Koch 👻" <dalvisahil488@gmail.com>', // sender address
					to: mail1 + "," + mail2, // list of receivers
					subject: req.body.subject, // Subject line
					text: req.body.mail_body, // plain text body
					html: req.body.html, // html body
					attachments: temp_attachments
				});

				var subject = req.body.subject;
				var status = req.body.mobile;
				var input_address = req.body.address;
				const response = await client.query('INSERT into email_logs(subject,status,message_id,sender,receiver) VALUES($1,$2,$3)', [subject,input_mobile,input_address]);
				// console.log("Message sent: %s", info.messageId);
				res.send("Mail sent successfully!");
				return;
				// Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
			} catch (err) {
				console.log(err);
				res.send(err);
				return;
			}
		}

		main().catch(console.error);
		// res.send("done");

	}
}