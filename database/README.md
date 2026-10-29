# HCM Lite Database

The app uses MongoDB. The normal assignment flow starts with an EMPTY database and the browser opens the First Run Setup screen.

## Local empty database
Set `MONGODB_URI=mongodb://127.0.0.1:27017/hcm_lite` in `.env`, start MongoDB, then run the app. Collections are created automatically by Mongoose.

## Optional demo database
Run:

```bash
npm run seed:demo
```

This clears the selected database and creates demo Admin, HR and Employee accounts. Do NOT use demo seed for the final judge fresh-install flow.

## Reset to fresh install
```bash
npm run reset:db
```

## Live database
Create a MongoDB Atlas cluster and place its connection string in Vercel as `MONGODB_URI`. Do not commit credentials.
