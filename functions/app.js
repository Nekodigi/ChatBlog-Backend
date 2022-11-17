// Firebase Admin SDK
const functions = require('firebase-functions');//Firebase上での実行で必要
const app = require("./handler/handler").app;

const PORT = process.env.PORT || 4000;

if(process.argv[2] === "dev"){//0=node 1=filename
//LOCAL DEVELOPMENT
    app.listen(PORT);
    console.log(`Server running at ${PORT}`);
}else{
    exports.app = functions.https.onRequest(app);
}
