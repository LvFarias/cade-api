const nodeMailer = require('nodemailer');

const logger = require('./logger');

const env = process.env;

function createEmailTest() {
    return new Promise((res, rej) => {
        nodeMailer.createTestAccount((err, account) => {
            if (err) return rej(err);
            res(account);
        });
    });
}

function createTransport() {
    return new Promise(async (res, rej) => {
        const account = await createEmailTest().catch(rej);
        if (account) {
            // const transporter = nodeMailer.createTransport({
            //     host: 'smtp.ethereal.email',
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: account.user,
            //         pass: account.pass,
            //     }
            // });
            const transporter = nodeMailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: env.SEND_EMAIL,
                    pass: env.SEND_EMAIL_PW,
                }
            });
            res(transporter);
        }
    });   
}

function getTemplateOptions(templateName, emailTo, values) {
    const templateConfig = require(`../../mails/${templateName}.js`);
    logger.debug(`get template config for: ${templateName}`);
    templateConfig.setValues(values);
    const options = templateConfig.getOptions(emailTo);
    logger.debug(`get option for: ${templateName}`);
    
    return options;
}
function sendEmail(options) {
    return new Promise(async (res, rej) => {
        const transporter = await createTransport().catch(rej);
        
        if (transporter) {
            logger.debug('send email');
            transporter.sendMail(options, (error, info) => {
                if (error) rej(error);
                logger.debug(info);
                res(info);
            });
        }
    });
}

function newUser(email, userName, password) {
    return new Promise((res, rej) => {
        const options = getTemplateOptions('newUser', email, { email, userName, password });
        sendEmail(options).then(res).catch(rej);
    });
}
function receivedSurvey(email, buttonURL, projectName) {
    return new Promise((res, rej) => {
        const options = getTemplateOptions('receivedSurvey', email, { email, buttonURL, projectName });
        sendEmail(options).then(res).catch(rej);
    });
}
function forgotPassword(email, userName, buttonURL) {
    return new Promise((res, rej) => {
        const options = getTemplateOptions('forgotPassword', email, { userName, buttonURL });
        sendEmail(options).then(res).catch(rej);
    });
}

module.exports = {
    newUser,
    receivedSurvey,
    forgotPassword
};