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
Create a file called `.env.local` in the root directory.

Put this code in it:
```env
VITE_FIREBASE_APIKEY=YOUR API KEY
VITE_FIREBASE_AUTHDOMAIN=YOUR AUTH DOMAIN
VITE_FIREBASE_DATABASEURL=YOUR PROJECT DATABASE URL
VITE_FIREBASE_PROJECTID=YOUR PROJECT ID
VITE_FIREBASE_STORAGEBUCKET=YOUR FIREBASE STORAGE BUCKET
VITE_FIREBASE_MESSAGINGSENDERID=YOUR MESSAGING SENDER ID
VITE_FIREBASE_APPID=YOUR FIREBASE APP ID
VITE_FIREBASE_MEASUREMENTID=YOUR FIREBASE MEASUREMENT ID
```

You can get all of the information for this by...
- Going to your [Firebase Console](https://console.firebase.google.com/)
- Clicking the gear icon in the top left
- Clicking "Project Settings"
- Scrolling down until you find the "SDK setup and configuration" section
- (You may need to create an app first by clicking the "</>" icon)

### Configuring the Database
There are a few documents that need to be in the Firestore database, more testing needs to be done to make sure they are automatically created.

You may only need to create the `school_names` collection and update the default school ID in `/app/utils/info/getSchoolId.ts`.

However, since the rest is not tested, here are steps to create all the necessary documents manually.

- Create a collection called `school_names` in your Firestore
- Add a document with an ID you want to use for your school
- Give it the field `name` defined as a string with your school's name
  - NOTE: The `getSchoolId` method (`/app/utils/info/getSchoolId.ts`) defaults to `museum`. You should probably change that for your deployment.
  - Otherwise, everyone will need to go to {yourSchoolId}.{your domain}.com
- Create a collection called `schools` and a document with an ID that matches the school ID you created before
- Create collections called `config`, `sessions`, and `users`
- Create the following documents in your `config` collection
`{ domain_restriction: {active: false, domain: ""} }`
`{ reactions: {default: []} }`
`{ school_info: {default_day: "friday"} }`
`{ sessions: {number: X, times: [""]} }` // Where `X` is the number of hours in your day, and `times` is an array of strings with the start and end time of each hour (ex: "8:15 - 9:00")
`{ student_groups: {groups: []} }`
`{ student_signup: {active: false} }` // `false` means students can NOT sign up
`{ teacher_register: {active: true} }` // `true` means new users CAN register as teachers


### Installing and Running Locally
Once you have a Firestore database and config.js file created, you just need to install the required modules and run the app.

If you don't already have [nodejs](https://nodejs.org/en/) installed, you'll need to install version 14.

Then, open a command prompt and navigate to this project's main directory and run these two commands:
```
npm install
```
Then...
```
npm run dev
```

### Deploying to the Internet
This app has been configured for deployment on [Vercel](https://vercel.com).

*Feel free to deploy anywhere else, if you know how.*
<br></br>

The easiest way to deploy to Vercel would be to:
1. Clone this repository
2. Sign up for Vercel
3. Create a new Vercel project from your repository
4. Add your environment variables to Vercel
5. Switch the Framework Preset (in Build & Development Settings) to `Remix`
6. Override the Install Command to `npm install`
7. Switch Node.js Version to `18.x`

### OMG help it's not working!!

If you're having issues, you can email me at [ben@upsign.app](mailto:ben@upsign.app)
