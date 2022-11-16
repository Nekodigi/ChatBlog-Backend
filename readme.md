# ChatPost-Backend
The blog that can be posted from LINE Bot.  
- [Features](#features)
- [Getting Started](#getting-started)
    - [Install](#install)
    - [Set up secrets](#set-up-secrets)
- [Usage](#usage)
    - [API JSON structure](#api-json-structure)
    - [URL List](#url-list)
# Demo
[Frontend Demo](https://foodbankbotdev.web.app/archive)  
[LINE Posting Demo](https://lin.ee/URajtX8)
# Features
A backend for ChatPost that provides linebot support and a frontend API.  
Frontend repository is here.
[Frontend repository](https://github.com/Nekodigi/ChatBlog-Frontend)
# Getting Started
## Install
`yarn install`
## Set up secrets
You will need secret to access following api.
- Firebase
    - projectID
    - API_KEY   (Any string)
- Gmail
    - OAuth     [Guide](https://gist.github.com/neguse11/bc09d86e7acbd6442cd4)
- Line
    - channelSecret
    - channelAccessToken
- Firebase Service account.
    - ServiceAccount  

Please refer secretSample and set up secret folder in the same directory.
## Configuration
Once you finished setup and tried some posting from LINE Bot, `users` folder will be created.  
Then you can add admin with the following steps.
```javascript
is_admin:true
email:[your email]  
check_post:true     post confirmation email will be sent if true.
```
# Structure
## API JSON structure
- paths
```javascript
[id,id...]
```
- post_
```javascript
{
	id:
	status:
	is_published:
	title:
	created_date:
	image_paths:
	body:
}
```
- post
```javascript
{
	next_id:
	prev_id:
	post: post_
}
```
- posts
```javascript
{
	next_id:
	prev_id:
	[post_, post_…]
}
```
- archive
```
{
	[YY]:{
		[MM]:count
		[MM]:count
	}
}
```
## URL list
### GET
``` markdown
/api/archive                    <paths>
/api/archive?page=?n=           <posts>
/api/archive/[YYMM]             <paths>
/api/archive/[YYMM]?page=&n=    <posts>
/api/variable/monthly           <archive>
/api/post                       <paths>
/api/post/[id]                  <post>
/api/preview/[id]               <post_>
```
### POST
```
/api/apply/?hash=               hash=md5(password)
/api/approve/[id]?hash=         hash=md5(id+password)
/api/deny/[id]?hash=            hash=md5(id+password)

```
### Webhook(LINE Bot)
```
/webhook
```