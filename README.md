# What is UpSign?

> UpSign is a an app that allows teachers to create classes and students to sign up for them.

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
Create a file called `config.json` in the `src` directory.

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

export { firebaseConfig }
```

You can get all of the information for this by...
- Going to your [Firebase Console](https://console.firebase.google.com/)
- Clicking the gear icon in the top left
- Clicking "Project Settings"
- Scrolling down until you find the "SDK setup and configuration" section