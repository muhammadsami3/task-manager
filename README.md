# Task Manager
This Application allows users to manage their tasks.

# APIs
please review the file `./task-manager-openapi.yaml`

# Features
1. Create/manage your own account
   1. Send welcome email and goodbye email.
   2. Upload avatar
   3. JWT authentication
   4. Access from multiple devices
   5. Store users on MongoDB
2. Create/update/delete your tasks from your account
# run

1. Start the database
 ```
 mkdir /tmp/mongodb_data
 ~/mongodb/bin/mongod --dbpath=/tmp/mongodb_data

 ```
