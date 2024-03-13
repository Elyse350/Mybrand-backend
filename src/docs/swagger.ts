import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'my Brand API',
      version: '1.0.0',
      description: 'API for managing blogs, users, comments, and likes',
    
    },
    // servers: [
    //   {
    //     url: 'http://localhost:5546',
    //     description: 'Local',
    //   }
      // {
      //   url:'https://mukamabrand202.onrender.com',
      //   description: 'Production',
      // }
      
    // ],

   
    components:{
        securitySchemes:{
            bearerAuth:{
                type:"apiKey",
                scheme:"bearer",
                name:"Authorization",
                in:"header",
                bearerFormat:"JWT",
                description: 'Enter JWT token in the format \'Bearer <token>\''
            }
        }

    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routers/*.ts"],

  
  
};



const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};









