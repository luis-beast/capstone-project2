# API Endpoints Documentation

### /login (post) (started, not complete)
- returns error message if login fails 
- returns user information upon successful login

### /register (get, post)
    - post to create a new user. Returns error message if username/email already exists

### /users/ (get, post) ✅
    - admin can see list of users

### /users/:id (get, del, put) ✅
    - admin can modify user information

### /users/:id/history (get)
    - gets all of a particular users modifications to a page along with their information

### /pages (get, post) 
    - should return a list of all pages and their corresponding tags

### /pages/:id (get, put, del) ✅
    - get includes all the tags a page uses
    - specific page

### /pages/:id/history ✅
    - returns the edit history for a page including information of the user that edited a particular page
    - results are sorted in descending order of creation date - most recent edit is at the top

### /pages/:page_id/history/:edit_id ✅
    - returns specific version of a particular page

### /pages/:id/edit-request (post, delete) ✅
    - POST checks if anyone else is currently editing the page and returns a lock {id, token, timestamp} if nobody else is. 
        - Requests to edit a page are only granted if the page is not locked OR if the request body contains that page's lock.a
    - DELETE removes the lock in the request body from the list of active page locks.
    - These API requests do not touch the database, the page locks are stored in memory on the API server. 

### /pages?search=example (get)   (This is currrently being done in the front end.)
    - returns list of pages where title/body contains "example"

### /pages?tag=example (get)      (This is currently being done in the front end.)
    - returns all pages that have a tag of "example"

### /pages?tag=example&search=example&inclusive=true    (This is currently being done in the front end.)
    - returns all pages that have either the tag or the text "example"
    - if inclusive is false, it returns all pages that have both the tag and the text "example"

### /tags (get, post) ✅
    - get lists all the tags

### /tags?search=example (get)   (This is currently being done in the front end.)
    - retuns a list of tages with text of "example"

### /tags/:id (get, put, del) ✅
    - get, update, or delete a specific tag

### /forum (get, post) ✅
    - returns a list of all Forum threads
    - post creates a new forum thread

### /forum/:id (get, post, put, del) ✅
    - full CRUD on a specific forum
    - post creates a new comment

### /forum/:id/comments (get)
    - returns all comments on a specific forum with user information

### /forum/comment/:id (get, put, del) 
    - get, edit, and delete a single comment
    - get returns the comments with the users information
