# WikiForces
# Problem Statement
Information and job knowledge across the Air Force (AF) is very siloed, which makes it difficult for groups to collaborate, understand each other's career fields, or understand a new assignment. This isolation of information also means that newfound information isn't presented until the last minute, making it so that service members are unprepared for the new capabilities and technologies.

# Solution
We wish to solve this by creating a Wiki for service members to create and update information about their own jobs and interactions with the Air Force. These can include topics ranging from basic job knowledge to a given Air Force Instruction (AFI) to unclassified information about a weapon system. In addtion, specially marked pages on upcoming capabilities and projected projects will be available. Each Wiki page will have an associated forum thread in which users can then discuss information on the page.

# Entity Relationship Diagram(ERD)
![Screenshot](/Backend/docs/db_schema_screenshot.png)

## Github
- navigate to the github page and fork the project
    - `https://github.com/luis-beast/capstone-project2`
- navigate to your desired directory in your terminal to clone the forked repo
    - `cd projects/`
    - `git clone https://github.com/luis-beast/capstone-project2`
- navigate into the local repo
    - `cd capstone-project2/`

## Web Server
- navigate to the frontend directory
    - `cd frontend/`
- install dependencies
    - `npm i`
- start the web server
    - `npm start`
- open url in browser
    - `http://localhost:3000`

## API server
- navigate to the Backend directory
    - `cd Backend`
- install dependencies
    - run `npm i`  
- start the api server
    - `npm start`
- open url in browser
    - `http://localhost:8080`

## Database
*reference https://docs.docker.com/get-started/ to start a docker instance. Docker will be required to use WikiFroces*
- navigate to the Backend directory
    - `cd Backend/`
- reinitialize the database
    - `npm run start-dev`

## Documentation
- https://docs.google.com/document/d/16yZcNkG6rQMvAU6msef3SPJ4QjwXdykjIzYGnh2JpZo/edit?usp=sharing
 