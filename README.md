# Stryke - My Receipts App

The aim of this repository is to demonstrate how a simple custom front end can be interfaced with a Stryke app using Stryke's API.

This app is based on Stryke's Playground app with an additional custom front end. 

Track your receipts, categorise them and generate reports with this app created with Stryke!

[Stryke - Documentation](https://docs.stryke.io)

[Stryke](https://www.stryke.io)

### Live Demo

https://glitch.com/~stryke-myreceipts

## Stryke App 

This app uses the following features of Stryke:

* Store your receipts, types of receipts, and businesses you deal with - [**data persistence**](https://docs.stryke.io/docs/entity)
* Automatically validates receipts data entered by the user - [**trigger action**](https://docs.stryke.io/docs/triggers)
* Automatically sets the alias of business and type records using the record's name - [**trigger action**](https://docs.stryke.io/docs/triggers)
* Generates reports for a set of receipts in a specic time period - [**button action**](https://docs.stryke.io/docs/action)
* Style reports using an HTML template - [**templates**](https://docs.stryke.io/docs/template)
* Allows attaching files to receipt records - [**files**](https://docs.stryke.io/docs/files)
* A dedicated end user for every user of the app, to allow people to login the app - [**end users**](https://docs.stryke.io/docs/endusers)
* Access control to separate users' data, so that users only see their own data - [**eccess control**](https://docs.stryke.io/docs/accesscontrol)
* The Stryke API allows the custom front end to authenticate with Stryke, retrieve data and create receipts records - [**Stryke API**](https://docs.stryke.io/docs/api)

## Front end

The front end for the 'my receipts' is functionaly and intentionally very basic. It is build using vanilla HTML + CSS + JS, to allow anyone to easily get into it. 

It provides: 
- A login screen to allow users to authenticate with the My Receipts app
- A form to create receipts
- Comms layer with Stryke to perform data retrieve and creation with the auth token

## How to Use it

### Create a My Receipts app in Stryke

You can use the app template found under: `/stryke/myreceipts-app.json` to [import the My Receipts app under your Stryke account](https://docs.stryke.io/docs/appinstance#create-an-app-from-template). 

1. Sign up to Stryke
2. Login to stryke with your new user
3. Under your dashboard click on "Import from Template"
4. Select the "myreceipts-app.json" file

### Point to your app

Under `/js/stryke.js` change the value of `appName` to your app's unique name. 

## Repository Structure

This repository includes the source code for both the Stryke app and the custom front end. 

### Stryke App

Under the `/stryke` folder you will find the `myreceipts.json` file which you can use to import this app under your Stryke account as described above.

This file includes all parts of the app, including the script's source code. 

Just as a reference, you can also find the script's source code directly under the `/stryke/src` folder.

### Front end

The source code for the front end is all under the `/frontend` folder, which includes the HTML, JS and CSS. 
