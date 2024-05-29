# React + TypeScript + Vite + Gutendex API

## How to run the project?

- Create a .env file in ./client (see .env.template)
- Set the API url to `https://gutendex.com`
- Move one directory up and use the docker-compose.yml file to start a container by running `docker compose up`

## Features

- Each search field gives you the chance to search for a specific book
- If you find a book you like, you will see it has one or more subjects, which you can click on to start a new search with that subject
- You can select the page number manually
- The website is also responsive (minor css fixes are still needed)
