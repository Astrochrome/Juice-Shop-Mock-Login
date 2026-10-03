This website implements a basic login page which mimics the behavior of the juice shop login page. It includes a main login area as well as a place for the user to create an account if they don’t already have one. The account creation ensures that all usernames and emails have an ‘@’ in them and that the passwords are at least 8 characters. It stores the user profile information in a basic in memory SQLite database for testing security against SQL injection. 

How to run:
1. clone the repo (git clone https://github.com/Astrochrome/Juice-Shop-Mock-Login.git)
2. cd into the directory
3. run npm i
4. run node server.js and navigate to the provided link in your terminal
