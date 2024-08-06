module.exports = function (app) 
{
    app.post('/api/client/v1/send_email/', function(req, res)
    {
        let send_mail = require(__dirname + './../src/email/send_mail');
        send_mail.main(req, res)
    }
)
}