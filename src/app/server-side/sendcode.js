const nodemailer = require('nodemailer');

function sendCheckCode(userEmail){
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'germasik1511@gmail.com',
      pass: 'ghhj ssyk uyxs kmpq'
    }
  });
  const resetCode = Math.floor(100000 + Math.random() * 900000);

  let mailOptions = {
    from: 'germasik1511@gmail.com',
    to: userEmail,
    subject: 'TheBest',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .code-box {
            margin: 20px 0;
            padding: 20px;
            background-color: #e7f3ff;
            border: 1px solid #b3d7ff;
            border-radius: 10px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TheBest</h1>
        </div>
        <div class="content">
            <p>Здравствуйте,</p>
            <p>Мы получили запрос на сброс пароля для вашего аккаунта в компании TheBest. Если вы не отправляли этот запрос, просто проигнорируйте это письмо.</p>
            <p>Для сброса пароля используйте следующий код:</p>
            <div class="code-box">${resetCode}</div>
            <p>Введите этот код на сайте, чтобы продолжить процесс сброса пароля.</p>
            <p>С уважением,<br>Команда TheBest</p>
        </div>
        <div class="footer">
            <p>© 2024 TheBest. Все права защищены.</p>
        </div>
    </div>
</body>
</html>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log(error);
    }
  });
  return {resetCode:resetCode.toString()}
}
module.exports = sendCheckCode;