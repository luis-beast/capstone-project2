# API Endpoints Documentation

### /login (post)
- returns error message if login fails 
- returns user information upon successful login

### /register (get, post)
    - post to create a new user. Returns error message if username/email already exists

### /users/ (get, post)
    - admin can see list of users

### /users/:id (get, del, put)
    - admin can modify user information

### /users/:id/history (get)
    - gets all of a particular users modifications to a page along with their information

### /pages (get, post)
    - should return a list of all pages

### /pages (get)
    - returns pages and corresponding tag

### /pages/:id (get, put, del)
    - get includes all the tags a page uses
    - specific page

### /pages?search=example (get)
    - returns list of pages where title/body contains "example"

### /pages?tag=example (get)
    - returns all pages that have a tag of "example"

### /pages?tag=example&search=example&inclusive=true
    - returns all pages that have either the tag or the text "example"
    - if inclusive is false, it returns all pages that have both the tag and the text "example"

### /tags (get, post)
    - get lists all the tags

### /tags?search=example (get)
    - retuns a list of tages with text of "example"

### /tags/:id (get, put, del)
    - get, update, or delete a specific tag

### /pages/:id/history
    - returns the edit history for a page including information of the user that edited a particular page

### /pages/:page_id/history/:edit_id
    - returns specific version of a particular page

### /Forum (get, post)
    - returns a list of all Forum threads
    - post creates a new forum thread

### /Forum/:id (get, post, put, del)
    - full CRUD on a specific forum
    - get returns the comments with the users information
    - post creates a new comment

### /Forum/comment/:id (get, put, del)
    - get, edit, and delete a single comment
    - get returns the comments with the users information
