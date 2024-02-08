import swaggerJSDoc from 'swagger-jsdoc';
import * as packageJson from '../../package.json';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Integral module for managing all user-related operations',
      version: packageJson.version,
      description: packageJson.description,
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: packageJson.author,
        email: 'luccarebtoledo@gmail.com',
        url: 'https://www.linkedin.com/in/lucca-toledo/',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookie: {
          type: 'apiKey',
          in: 'cookie',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'token',
        },
      },
      schemas: {
        SignUpSchema: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'johndoe@gmail.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        SignInSchema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'johndoe@gmail.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        EmailAlreadyInUseSchema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 409,
            },
            status: {
              type: 'string',
              example: 'Conflict',
            },
            message: {
              type: 'string',
              example:
                'The provided email is already in use. Please use a different email.',
            },
          },
        },
        InvalidCredentialsSchema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 401,
            },
            status: {
              type: 'string',
              example: 'Unauthorized',
            },
            message: {
              type: 'string',
              example:
                'The provided credentials are invalid. Please check your email and password.',
            },
          },
        },
        MissingUserFeatureGroupSchema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 403,
            },
            status: {
              type: 'string',
              example: 'Forbidden',
            },
            message: {
              type: 'string',
              example:
                'The user does not have an assigned feature group. Please contact the administrator to resolve this issue.',
            },
          },
        },
        FeatureNotFoundSchema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 404,
            },
            status: {
              type: 'string',
              example: 'Not Found',
            },
            message: {
              type: 'string',
              example:
                'The feature was not found. Please check the provided feature ID or name.',
            },
          },
        },
        InternalServerErrorSchema: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 500,
            },
            status: {
              type: 'string',
              example: 'Internal server error',
            },
            message: {
              type: 'string',
              example: 'Something is wrong!',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/infra/http/routes/*.ts'],
};

export const swaggerDocument = swaggerJSDoc(options);
