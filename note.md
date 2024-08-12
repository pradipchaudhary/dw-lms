# Guide

# Steps for Creating `createUser` Function

1. **Import Necessary Modules**

    - Import `bcrypt`, `jsonwebtoken`, `User` model, and `sendEmail`.

2. **Define the `createUser` Function**

    - Create an asynchronous function to handle user registration.

3. **Extract User Details**

    - Extract `password` and other user details from the request body.

4. **Hash the Password**

    - Hash the extracted password using `bcrypt`.

5. **Create User Data Object**

    - Construct the user data object with the hashed password and other details.

6. **Save User to Database**

    - Save the new user data to the database using `User.create`.

7. **Generate JWT Token**

    - Create a JWT token for the user with an expiration time.

8. **Send Verification Email**

    - Send a verification email with the JWT token to the user.

9. **Send Success Response**

    - Respond with a success message and the user data.

10. **Handle Errors**
    - Catch and handle any errors, responding with an error message.
