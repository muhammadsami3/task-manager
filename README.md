# Task Manager
This Application allows users to manage their tasks.

# APIs
Review the file `./task-manager-openapi.pdf` or `./task-manager-openapi.yaml`

# Features
1. Create/manage your own account
   1. Send welcome email and goodbye email.
   2. Upload avatar
   3. JWT authentication
   4. Access from multiple devices
   5. Store users on MongoDB
2. Create/update/delete your tasks from your account


# Running the Application
1. install MongoDb
You can download the MongoDB Community Server from the [MongoDB download page](https://www.mongodb.com/download-center/community).
The download is a zip file. Unzip the contents, change the folder name to “mongodb”, and
move it to your users home directory. From there, create a “mongodb-data” directory in
your user directory to store the database data.
You can start the server using the following command. Make sure to swap out
\<home-dir> with the correct path to your users home directory.

2. Start the database
```bash
 mkdir /tmp/mongodb_data
 ~/mongodb/bin/mongod --dbpath=<home-dir>/mongodb_data

```
3. Start the server
```bash
npm run start
```

