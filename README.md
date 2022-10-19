#Needs Node and MongoDB available in local instance
#Created a node backend server and React web application with JWT basic authentication and a Crud module to manage Construction projects.

Server:
1. Change the following credentials on .evn file as per your environment:
	#Default Admin
	ADMINEMAIL = 'niresh@mailinator.com'
	ADMINPASSWORD = 'password'


	#MONGODB
	DBNAME = 'max-poc'
	DBHOST = 'localhost'
	DBPORT = '27017'


2. Execute 'npm install' to run the project. Use the locahost URL with the port ID displayed on the console.
3. 'npm run start:dev' to start the application. Runs default in "http://localhost:8001"


Client:
1. Execute 'npm install' to run the project. Use the locahost URL with the port ID displayed on the console.
2. 'npm start' to start the application. Runs default in "http://localhost:3000"


Note:

-DB will be created and only basic DB records will be created on starting the server for first time 'npm run start:dev'.
-Admin user will be created. 'niresh@mailinator.com/password'
-One staff record will be created along project categories 
-Projects will be empty.




