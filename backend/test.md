/*
Backend file structures


backend/
├── config/
│   |── db.js 
|   |__ passport.js    
|            
├── controllers/
│   |── configController.js   
|   |__ authController.js
|   |__ googleAuthController.js
|   |__ publicController.js
|   |__ teamController.js
|   |__ uploadController.js
|
├── middleware/
│   |── authMiddleware.js    
|   |__ errorHandler.js
|   |__ rbacMiddleware.js
|   
├── models/
│   |── StoreConfig.js  
|   |__ ActivityLog.js
|   |__ GoogleAuthCode.js
|   |__ StoreMember.js
|   |__ User.js
|         
├── routes/
│   |── configRoutes.js    
|   |__ authRoutes.js
|   |__ publicRoutes.js
|   |__ teamRoutes.js
|   |__ uploadRoutes.js
|
|__ tests
|   |__ fakeDb.js
|   |__ run.js
|
|__ utils
|   |__ rateLimit.js
|   |__ sanitize.js
|   
├── .env                      
├── .env.example              
├── .gitignore                
├── package.json              
|── server.js  
|__ app.js               
|__ package-lock.json

*/


