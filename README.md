Clone the code repository with this link : https://github.com/SanjayRaina24/My-Capstone-Project-Travel-Planner.git

Now this step ensures your local environment (node_modules) and lock file (package-lock.json) match the dependencies specified in package.json. Google App Engine uses npm ci (clean install), which requires perfect synchronization.

Navigate to your server directory in your local terminal:

Bash

cd server
Clean out old dependencies and the lock file:

Bash

rm -rf node_modules
rm package-lock.json
Reinstall and regenerate the lock file:

Bash

npm install
1.2 Verify Dependencies
Ensure your package.json in the server directory includes all necessary dependencies, particularly express, mongoose, and the engines field set for Node.js compatibility.

2. Deployment to Google App Engine
2.1 Prepare and Upload the Project
Return to the root directory where your server folder is located.

Zip the entire server directory (including the newly synchronized package-lock.json):

Bash

zip -r server.zip server
Upload server.zip to your Google Cloud Shell environment.

2.2 Execute Deployment
In Google Cloud Shell, unzip the files:

Bash

unzip -o server.zip
Navigate to the project directory:

Bash

cd server
Initiate the deployment (answer Y when prompted):

Bash

gcloud app deploy
Wait for the deployment to complete.

Success: The output will provide the deployed URL: https://capstone-481123.ue.r.appspot.com .

Failure: If the deployment fails due to a build error, review the log for npm or configuration issues.
