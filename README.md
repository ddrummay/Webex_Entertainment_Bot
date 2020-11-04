[![published](https://static.production.devnetcloud.com/codeexchange/assets/images/devnet-published.svg)](https://developer.cisco.com/codeexchange/github/repo/ddrummay/Webex_vBond_Bot)

# Webex-Bot-Starter vBond Bot

### Template for the vBond Webex Teams bot

*This Webex Bot, vBond, was created in effort to bring teams together during the COVID-19 pandemic. The vBond bot focuses on intrinsic nature of humans to socialize.*

This is a very simple Webex Teams node.JS vBond bot application built from a template, which is comprised of old [sparkbotstarter](https://github.com/valgaze/sparkbotstarter) template created by Victor Algaze and [webex-node-bot-framework](https://github.com/webex/webex-bot-node-framework) that simplifies development for Webex Teams bots.


## Prerequisites:

- [ ] node.js (minimum supported v8.0.0 & npm 2.14.12 and up)

- [ ] Sign up for Webex Teams (logged in with your web browser)


----

## Steps to get the bot working

1. Create a Webex Teams bot (save the API access token and username): https://developer.webex.com/my-apps/new/bot

2. Sign up for nGrok, then connect and start it on your machine (save the port number and public web address): https://ngrok.com/download

3. After installing ngrok, run it on your local machine to get a public ip address, eg `ngrok http 3000 --region=eu`
 
4. Copy the ip address displayed in the ngrok window, ie: : https://1234.eu.ngrok.io

5. Edit  `config.json` with the following values:

* token - Set this to the token for your bot that you got in step 1
* port - Set this to the port you set when you started ngrok in step 3 (ie: 3000)
* webhookUrl - Set this to the ip address that you copied in step 4

5. Turn on your bot server with ```npm start```

6. Create a space in Webex Teams

7. Add the bot (by its username) to the space in Webex Teams

8. Be sure to capitalize the command words

----

## vBond Bot Illustration

1. Creating a space on Webex Teams with vBond Bot

![Creating Space](https://github.com/ddrummay/Webex_vBond_Bot/blob/main/images/Space1.png)


2. vBond Bot initial conversation 

![Introduction](https://github.com/ddrummay/Webex_vBond_Bot/blob/main/images/Intro.png)


3. Interaction with vBond Bot

![Interaction](https://github.com/ddrummay/Webex_vBond_Bot/blob/main/images/func1.png)


4. Request completed

![Output](https://github.com/ddrummay/Webex_vBond_Bot/blob/main/images/output1.png)

*Be sure to @mention the Bot and write commands (case-sensitive)*

