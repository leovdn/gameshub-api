# GameHub API

API for GameHub created with Strapi CMS, GraphQL, PostgresSQL

## Technologies Used

- Strapi (v4.2.0) - Headless CMS and API builder
- Node.js (v16.14.2) - JavaScript runtime environment
- PostgreSQL (v14.5) - Relational database management system
- Docker (v20.10.14) - Containerization platform
- PostgreSQL

## ⚠️ Required to run the project

- Node.js (v16.14.2)
- Docker

## ⚙️ Getting Started

1. To get started, clone this repository to your local machine and install it by running the following command:

   ```
   docker compose up
   ```

2. After the container runs all the images you will be able to:

   - **Strapi admin Panel:** Open http://localhost:1337 with your browser

   - **Strapi instructions:**

     - Create a new Strapi user:
       In the Strapi admin panel, go to `Users & Permissions` > `Users` and create a new user with admin permissions.

     - Start building your API:

     - In the Strapi admin panel, go to `Content-Types Builder` and start creating content types and fields for your API.

   - **Graphql:** Open http://localhost:1337/graphql to run query commands, for instance to get games names:

   ```
     games {
       data {
         id
         attributes {
           name
         }
       }
     }
   ```

3. It's all set up now. Don't forget to run the client side to see the results in the Web version: [Gamehub Client](https://github.com/leovdn/gamehub-client)

## 📚 Learn more

- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.

## License

This project is licensed under the MIT License.
