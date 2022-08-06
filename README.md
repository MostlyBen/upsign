# What is UpSign?

UpSign is a an app that allows teachers to create classes and students to sign up for them.

## Some Background

I work at a school that has a flexible schedule on Fridays. Teachers need to create workshops. Students need to sign up for them. This is an small web app I'm making to facilitate all of that.

## Setup
You will need...
- To create a Firestore Database through [Firebase](https://console.firebase.google.com/)
- Create a file to store information about how to connect to your Firebase app
- Install and run UpSign
- (Optional) deploy UpSign for use on the internet

### Creating your Database
[Firebase has a great quickstart guide for this.](https://firebase.google.com/docs/firestore/quickstart)
Just follow the "Create a Cloud Firestore database" section.
### Saving your Configuration
Create a file called `config.js` in the `src` directory.

Put this code in it:
```
const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "YOUR AUTH DOMAIN",
  projectId: "YOUR PROJECTID",
  storageBucket: "YOUR STORAGE BUCKET",
  messagingSenderId: "YOUR SENDER ID",
  appId: "YOUR APP ID",
  measurementId: "YOUR MEASUREMENT ID"
}

const schoolId = 'YOUR_SCHOOL_ID'

export {
  firebaseConfig,
  schoolId,
}
```

You can get all of the information for this by...
- Going to your [Firebase Console](https://console.firebase.google.com/)
- Clicking the gear icon in the top left
- Clicking "Project Settings"
- Scrolling down until you find the "SDK setup and configuration" section
- (You may need to create an app first by clicking the "</>" icon)

### Configuring the Database
There are a few documents that need to be in the Firestore database, but are not yet automatically created. Here's what you will need to do:

- Start a collection called "config"
- Add a document with the id "student_signup"
  - Give the document one field called "active" with a boolean value of true
- Add a document with the id "teacher_register"
  - Give the document one field called "active" with a boolean value of true
- Add a document with the id "teacher_edit"
  - Give the document one field called "active" with a boolean value of true
- Add a document called "student_groups"
  - Give the document a field called "groups" with an empty array



### Installing and Running Locally
Once you have a Firestore database and config.js file created, you just need to install the required modules and run the app.

If you don't already have [nodejs](https://nodejs.org/en/) installed, you'll need to install version 14.

Then, open a command prompt and navigate to this project's main directory and run these two commands:
```
npm install
```
Then...
```
npm run
```

### Deploying to the Internet
This app has been configured for deployment on the Google App Engine.

*Feel free to deploy anywhere else, if you know how.*
<br></br>

First, you'll need to [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects).

You'll also need to [install Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

Then, open a command prompt and navigate to the project's main directory.

[Initialize the Google Cloud SDK](https://cloud.google.com/sdk/docs/initializing). (You may need to restart your computer if you just installed Google Cloud SDK)

Once initialized, run the following commands:
```
npm run-script build
```
```
gcloud app deploy
```

You can configure the app from there in the [Google Cloud Console](https://console.cloud.google.com/).
