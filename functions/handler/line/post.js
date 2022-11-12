


// switch(user.status){
//     case status.waitingAction:
//         if(event.message.text == keyword.post){
//             user.setStatus(status.waitingTitle);
//             return {'type':'text','text':'早速作っていきましょう！\n'+'タイトルを教えてください。'};
//         }else{
//             return helpMessage();
//         }
//     case status.waitingTitle:
//         user.setStatus(status.confirmingTitle);
//         user.setField(field.title, event.message.text);
//         return templete.confirmField('タイトル', event.message.text);
//     case status.confirmingTitle:
//         switch(event.message.text){
//             case keyword.yes:
//                 user.resetImageData();
//                 user.setStatus(status.waitingImage);
//                 return {'type':'text','text':'タイトルを「'+user[field.title]+'」で確定しました！\n次に画像を1枚ずつ送ってください。画像なしで良ければ「はい」と伝えてください。'};
//             case keyword.no:
//                 user.setStatus(status.waitingTitle);
//                 return {'type':'text','text': 'タイトルを教えてください。'};
//             default:
//                 return templete.yesno("タイトル");
//         }
//     case status.waitingImage:
//         if(event.message.type == 'image'){
//             try{
//                 var image = await downloadContent(event.message.id);
//                 //console.log(image);
//                 image = await sharp(image).resize({width:680, height:680, fit: sharp.fit.inside}).toBuffer();
//                 const now = new Date();
//                 const fileName = "FoodbankBot/images/"+date.format(now,'YYMM')+"/"+date.format(now, 'DD')+randomChar(2)+".png";
//                 //console.log(fileName);
//                 await storage.upload(image, fileName);
//                 const url = `https://firebasestorage.googleapis.com/v0/b/${projectDomain()}/o/${encodeURIComponent(fileName)}?alt=media`;
//                 //console.log(url);

//                 var nameArray = JSON.parse(user[field.imageName]);
//                 nameArray.push(fileName);
//                 user.setField(field.imageName, JSON.stringify(nameArray));


//                 var urlArray = JSON.parse(user[field.imageUrl]);
//                 urlArray.push(url);
//                 user.setField(field.imageUrl, JSON.stringify(urlArray) );
//                 //user.setStatus(status.confirmingImage);
//                 return templete.addImage(url, urlArray.length);
//             }catch(e){
//                 console.log(e);
//                 return {'type':'text','text':'エラーが発生しました。別の画像を試してください。'};
//             }
//         }else{
//             if(event.message.text == keyword.imageResetAll){
//                 var nameArray = JSON.parse(user[field.imageName]);
//                 nameArray.forEach(fileName => {
//                     storage.delete(fileName);
//                 });
//                 // user.setStatus(status.waitingImage);
//                 // const fileName = user.imageName;
//                 // storage.delete(fileName);
//                 user.resetImageData();
//                 return {'type':'text','text':'画像を全て除外しました。もう一度画像をを1枚ずつ送ってください。'};
//             }else if(event.message.text == keyword.yes){
//                 user.setStatus(status.waitingBody);
//                 return {'type':'text','text':'画像を確定しました！\n次に本文を入力してください。'};
//             }else if(event.message.text == keyword.no){
//                 // user.setStatus(status.waitingImage);
//                 // const fileName = user.imageName;
//                 // storage.delete(fileName);
//                 return {'type':'text','text':`追加する画像をを1枚ずつ送ってください。\n間違えて写真を投稿して全て選び直す場合は「${keyword.imageResetAll}」と伝えてください。`};
//             }else{
//                 return helpMessage();
//             }
//         }
//     case status.confirmingImage:
//         if(event.message.text == keyword.yes){
//             user.setStatus(status.waitingBody);
//             return {'type':'text','text':'画像を確定しました！\n次に本文を入力してください。'};
//         }else if(event.message.text == keyword.no){
//             user.setStatus(status.waitingImage);
//             const fileName = user.imageName;
//             storage.delete(fileName);
//             return {'type':'text','text':'画像を送ってください。'};
//         }else{
//             return templete.yesno("画像");
//         }
//     case status.waitingBody:
//         var body = event.message.text.replace(/\r\n|\n|\r/g, '\n');
//         var body = event.message.text;
//         //console.log(body);
//         user.setField(field.body, body);
//         user.setStatus(status.confirmingBody);
//         //console.log(user[field.body]);
//         return templete.confirm("本文を確定しますか？");//partial
//     case status.confirmingBody:
//         switch(event.message.text){
//             case keyword.yes:
//                 user.setStatus(status.confirmingPost);
//                 return {'type':'text','text':'本文を確定しました！\nもう一度よく確認して、投稿する場合は「投稿決定」最初からやり直したいときは「全てやり直す」と話しかけてください。'};
//             case keyword.no:
//                 user.setStatus(status.waitingBody);
//                 return {'type':'text','text': '本文を教えてください。'};
//             default:
//                 return templete.yesno("本文");
//         }
//     case status.confirmingPost:
//         if(event.message.text == "投稿決定"){
//             const id = date.format(new Date(), "YYMMDD")+randomChar(2);
//             user.setField(field.id, id);
//             user.post();
//             user.setStatus(status.waitingAction);
//             return {'type':'text','text':`投稿を確定しました！こちらのリンクからご確認ください。事務局が承認した後一覧からも確認できるようになります。\n${projectURL()}/preview/${id}`};
//         }else{
//             return {'type':'text','text':'投稿内容をよく確認して、投稿する場合は「投稿決定」最初からやり直したいときは「全てやり直す」と話しかけてください。'};
//         }
// }