# E-Voting System using Blockchain

This is the website made using React, NodeJS, MongoDB and Ganache for a Blockchain based, easy to use, face recognization voting system.

For details on this project read the this [report](https://drive.google.com/file/d/1KJCA_DDZKEn6AIj1U3rWgylZuFRNBFqj/view?usp=sharing).

## Installation
---

### Requirements

1. Ganache 
2. Docker
3. Node Js (18.12 verion or up)
4. Google Chrome
5. Metamask Extension
6. A MongoDB Database connection

### Ganache
---
You can donwload Ganache from [here](https://trufflesuite.com/ganache/)

Follow the basic installation steps and open the Quickstart or New Workspace as per your need.

### Docker
---
You can donwload Docker Desktop from [here](https://www.docker.com/products/docker-desktop/)

Follow the basic installation steps.

### NodeJS
---

You can download the NodeJS from [here](https://nodejs.org/en)

Follow the basic installation steps.

### Google Chrome and Metamask
---
Download it from chrome [website](https://www.google.com/chrome/) and Metamask from [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).

Install chrome , sign up and add the Metamask Extension and make an wallet account in metamask.

## MongoDB 
---
You need to create your own MongoDB databse instance , follow the Using the MongoDB Atlas UI in this [guide](https://www.mongodb.com/basics/create-database) and make your first databse and name it `Blockchain`.


## Installation Step
---

1. Install Compreface for Face recongnization , whose installtion steps can be found [here](https://github.com/exadel-inc/CompreFace/blob/master/README.md#getting-started-with-compreface)

2. After its done you need to open [http://localhost:8000/login](http://localhost:8000/login) in there make account and login

3.  Go to Test Tab Create two services Detection Service and Verfication service.

4. You will get The APIs for both service from that page. Now in the server folder of the project directory make `.env` folder and write the below code.

```sh
#paste the APIS you just created
APIDETECT=[Detecttion service API]
APIVERIFY=[Verification service API]
PRIVATEKEY=[add a random 16 deigit secret]
```
5. Now open Ganache and start a quickservice.

6. Now login into you MongoB account and create a user for the cluster and then click on the Connect ![Alt text](/images//mongodb.jpg) and click on drivers option and copy this URL ![Alt text](/images//url.png) now in .env folder created in step 4 add this 
```sh
CONNECTION_URL=mongodb+srv://admin-siddharth:<password>@cluster0.ziuav.mongodb.net/<your database name here Blockchain>?retryWrites=true&w=majority
```
7. Now open terminal with directory as server and run the command below and wait for the `$ server is live`  message.
```sh
$ npm i
$ npm start
```

8. Now `cd` to the project directory and run the below command, make sure Ganache is runinng.

```sh
$ npm i
$ truffle migrate

```

10. Now `cd` to client folder and run the following command.

```sh
$ npm i
$ npm start
```

11. A website opens on(http://localhost:3000/login).Now in Metamask link the ganache 1st account using its private key and organise the election

12. Mkae sure to change the metamask account when logging in as a new user.

