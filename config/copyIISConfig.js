const fs = require('fs-extra');

const webConfigPath = './build/web.config';
debugger;
if (fs.existsSync(webConfigPath)) {
    fs.unlinkSync(webConfigPath);
}
fs.copySync('./config/web.config', webConfigPath);


if (fs.existsSync('./build/clientError.xslt')) {
    fs.unlinkSync('./build/clientError.xslt');
}
if (fs.existsSync('./build/clientErrorWithLink.xslt')) {
    fs.unlinkSync('./build/clientErrorWithLink.xslt');
}
if (fs.existsSync('./build/clientInfo.xslt')) {
    fs.unlinkSync('./build/clientInfo.xslt');
}
fs.copySync('./content/xslt/clientError.xslt', './build/clientError.xslt');
fs.copySync('./content/xslt/clientErrorWithLink.xslt', './build/clientErrorWithLink.xslt');
fs.copySync('./content/xslt/clientInfo.xslt', './build/clientInfo.xslt');