# ChatBlog-Backend
Chat blog is the blog that can be posted from LINE Bot.  
This is backend for ChatBlog that provides linebot support and a frontend API.  

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Install](#install)
    - [Set up secrets](#set-up-secrets)
- [Usage](#usage)
    - [API JSON structure](#api-json-structure)
    - [URL List](#url-list)
	- [Firebase JSON structure](#firebase-json-structure)
# Demo
[Frontend Demo](https://foodbankbotdev.web.app/archive)  
[LINE Posting Demo](https://lin.ee/URajtX8)
# Features
Easy interactive blog posting for who are not used to complicated blog management.
Add editor just by inviting to LINE Bot and NO need to create new account.
Just follow bot instruction and submit the post.
Then, email will sent to admin and they can approve or deny the post.
- No need for account
- Interactive posting
- Admin can manage post
- Monthly archive
- Post deletion
- Post update notification
- SSG
# Getting Started
## Install
`yarn install`
## Setup secrets
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
## Setup frontend
Frontend repository is here.
[Frontend repository](https://github.com/Nekodigi/ChatBlog-Frontend)
## Configuration
Once you finished setup and tried some posting from LINE Bot, `users` folder will be created.  
Then you can add admin with the following steps.
```javascript
is_admin:true
email:[your email]  
check_post:"line"or"email"or""     post confirmation email will be sent if email. line push messege will be sent if line. dont recieve if ""
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

## Firebase JSON structure
- users
```javascript
>[user_id]{
	id:string
	status:string[idle,posting]
	sub_status:string[waiting,confirming,processing]
	created_date:timestamp
	post_id:string
	name:string
	is_admin:boolean
	email:string
	check_post:boolean
	var0:string

	//potential use
	group_id:string
}
```
- posts
```javascript
>[post_id]{
	id:string
	status:string
	[title,image,body,post,waiting_approval,approved,denied,idle]
	sub_status:string[waiting,confirming,processing]
	title:string
	created_date:timestamp
	published_date:timestamp
	image_paths:array(string)
	body:string
	user_id:string
	is_published:boolean
	
	//potential use
	related_object_0:string
	location:string
}
```
- variables
```javascript
>post_count>[YY]>[MM]{count:number}
```