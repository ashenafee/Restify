# Restify

*Find the perfect place to stay!*

---

## About

Restify is a web-application, much like AirBNB or Bookings.com which allows users to browse/book properties for a getaway, place their own properties up for rent, and manage their bookings.

## Features

- Browse properties
- Book properties
- Manage bookings
- Manage properties
- Leave reviews


## Version History

All edits made can be found under the [commits](https://github.com/ashenafee/Restify/commits/main) tab.

## Roadmap

### Phase 1
- [x] Sign-up / Log-in
- [x] Home
- [x] Account
    - [x] Personal information
    - [x] My reservations (*user is a guest*)
        - [x] Pop-up: Cancel reservation
    - [x] My properties (*user is now a host*)
        - [x] Property management page
        - [x] Property creation page
        - [x] User page from the POV of a host  
        - [x] Pop-up: Leaving a review for a user
    - [x] Reviews
- [x] Catalog
    - [x] Pop-up: Amenities
    - [x] Property for a user page
    - [x] Booking
- [X] Comment page from the user's POV

### Phase 2
- [x] Accounts
    - [x] User signup/login/logout/edit
    - [x] Host leave rating/comment about a guest
    - [x] Host view ratings/comments about a potential guest
- [x] Property creation & administration
    - [x] User can create property listings
    - [x] Host can set a listing's availability and pricing
    - [x] Host can edit general information of a listing
    - [x] Host can approve/deny booking requests and cancellation requests
    - [x] Host can terminate a booking at any time
- [x] Property info & search
    - [x] User can search for properties by location, number of guests, amenities and availability
        - [x] User can sort search results by price or rating
    - [x] User can view property details
    - [x] User can view contact information of a host
    - [x] User can request to book a property
    - [x] User can view history of their bookings
    - [x] User can cancel a booking
- [x] Social network
    - [x] User can leave a rating/comment for each completed booking
    - [x] Host can respond to a rating/comment
    - [x] User can only respond to host's follow-up comments
- [x] Notifications
    - [x] Hosts are notified when a user requests to book their property, rates it, posts a comment, or requests a cancellation
    - [x] Users are notified when a host approves/denies a booking request or when bookings are coming soon


--**Marking scheme for P2:**--

- [ ] General
-1 mark per improper or lack of error handling, e.g., invalid email address, password mismatch, etc.
-1 mark per incorrect permission, e.g., host A cannot terminate host B's reservations, users cannot add comments to a property they have not been to, etc. 

- [x] Property (30 marks)
    - [x] Create/update (10 marks) - Jason
    - [x] Search result (18 marks) - KATE
        - [x] Pagination support (3 marks)
        - [x] Must support at least 4 filters, e.g., location, available dates, number of guests, amenities available (10 marks)
        - [x] Must support at least 2 order-by (5 marks)
    - [x] Delete (2 marks) - Jason

- [x] User (17 marks) - Ash
    - [x] Authentication (5 marks) - Ash
    - [x] Token based authentication (2 marks) - Ash
    - [x] Login (2 mark) - Ash
    - [x] Logout (1 mark) - Ash
    - [x] Signup/update profile (12 marks) - Ash
    
- [x] Comments (18 marks) - Ash
    - [x] View comments (8 marks) - Ash
        - [x] For Guest/Property (6 marks) - Ash
        - [x] Can distinguish reply from comment (2 marks) - Ash
        - [x] -2 marks without pagination support - Ash
    - [x] Write comments/reply (10 marks) - Ash
        Note: remember the requirements on who can comment/reply and how many times.
        
- [x] Reservations (20 marks)
    - [x] List of reservations (8 marks)
        - [x] Ability to filter by user type, i.e., host or guest (4 marks)
        - [x] Ability to filter by state (4 marks)
        - [x] -2 marks without pagination support
    - [x] Reservation actions (12 marks) - Jason
        - [x] Reserve (5 marks)
        - [x] Cancel (2 marks)
        - [x] Approve/Deny Pending (2 mark)
        - [x] Approve/Deny Cancel (2 marks)
        - [x] Terminate (1 mark)
        
- [x] Notifications (15 marks) - Ash
    - [x] List of notifications (8 marks) - Ash
        - [x] -2 marks without pagination support - Ash
    - [x] Read notification (2 marks) - Ash
    - [x] Clear notification (1 marks) - Ash
        - [x] CLEARS BASED OFF POST REQUEST WITH NOTIFICATION ID - Ash
    - [x] Receiving notifications (4 marks) - Ash
        - [x] Host: new reservation, cancellation request - Ash
        - [x] Guest: approved reservation or cancellation request - Ash

--**Marking scheme for P3:**--
- [ ] General
-1 mark per improper or lack of error handling, e.g., invalid email address, password mismatch, etc.
This includes incorrect permission.
See P2 rubrics for more detail.
-1 mark for poor UI/UX.
See P1 rubrics for more detail.
You will not be marked for concurrency bugs, e.g., what happens if a new property is added when a user is flipping through search results.

- [ ] Reservation (40 marks)
    - [ ] Responsive design (3 marks)
    - [ ] Pagination support (4 marks) 
    - [ ] Filter by user type, i.e., host or guest (8 marks, 4 each)
            This can be implemented in different ways, e.g.:
            1. Two separate pages, one for reservation as guest or as host.
            2. One page, with options to filter or two separate tabs, row, etc.
    - [ ] Sort/Filter/Organize reservations by state (4 marks)
        - [ ] Bugs with combining search and pagination should be deducted from pagination support
    - [ ] Reservation actions (21 marks)
        - [ ] Reserve (9 marks)
            - [ ] basic functionality (3 marks)
            - [ ] ability to reserve timeslots occupied by cancelled/terminated reservations (2 marks)
            - [ ] ability to reserve across multiple availability/price ranges (4 marks)
    - [ ] Cancel (3 marks)
    - [ ] Approve/Deny Pending (3 mark)
    - [ ] Approve/Deny Cancel (3 marks)
    - [ ] Terminate (3 mark)
    - [ ] It should be clear to the user what the consequence of each action is, e.g., warn user with a dialog box or a paragraph for each action.

- [ ] Account (20 marks)
    - [ ] Responsive design (3 marks)
    - [ ] Login (4 marks)
    - [ ] Logout (1 marks)
    - [ ] Signup/update (12 marks)
        - [x] Basic registration (10 marks) - Kate
        - [ ] Profile avatar support (2 marks)

- [ ] Property (42 marks)
    - [ ] Responsive design (3 marks)
    - [ ] Support for different availability/prices (4 marks)
        - [ ] As part of view/create/update
        - [ ] This is considered a bonus feature for its difficulty
    - [ ] Support for images (4 marks)
        - [ ] At least 3 images per property (2 marks)
        - [ ] Any number of images (2 marks)
    - [ ] View property detail (8 marks)
    - [ ] Search page (10 marks)
        - [ ] Pagination support (4 marks) 
        - [ ] Filters (4 marks)
        - [ ] Order-by (2 marks)
    - [ ] Create/update (11 marks)
    - [ ] Delete (2 marks)
        - [ ] Remember to give a big warning
        - [ ] Consider what should happen to existing reservations

- [ ] Comment/Rating (26 marks)
    - [ ] Responsive design (3 marks)
    - [ ] Pagination support (4 marks) 
    - [ ] Comments for past guests (7 marks) 
        - [ ] Basic system (5 marks)
            - [ ] Should have host name, date/time, message
            - [ ] Should be sorted in some ways, e.g., by time of post
        - [ ] with rating system (2 marks)
    - [ ] Comments for properties (12 marks)
        - [ ] Basic system (5 mark)
            - [ ] Same as above
        - [ ] With rating system (2 marks)
        - [ ] Reply system is worth (5 marks)

- [ ] Notifications (32 marks)
    - [ ] Responsive design (3 marks)
    - [ ] Pagination support (4 marks) 
    - [ ] View/List notifications (8 marks)
        - [ ] This may be shown as a component and not a whole page.
    - [ ] Clear notification (3 marks)
        - [ ] Can be implemented in various ways. Please explain to the TA how notification can be cleared.
    - [ ] Receiving notifications (12 marks)
        - [ ] Host: new reservation, cancellation request, new comment on owned property (2 each, 6 total)
        - [ ] Guest: result of reservation or cancellation request (2 each, 4 total)
        - [ ] Bonus: Guest receives notification when a reservation is about to come up (2 marks)


## Credits

### Technologies

- Django
- HTML
- CSS
- JavaScript
- Bootstrap
- Figma
    - [Planning](https://www.figma.com/file/YRL2J8DXMkf9TjoVeqc121/Restify?node-id=0%3A1&t=T6iVhlTHlZ59OLB1-1)
    - [Design](https://www.figma.com/file/H31fLA6S9HD2z4CoH7sjNV/Restify-design?node-id=0%3A1&t=cbD3qu6tmhFL1Rt2-0)
- Postman

### Team

- [Ashenafee Mandefro](https://github.com/ashenafee)
- [Jason Sastra](https://github.com/jason121301)
- [Kateryna Stanislavska](https://github.com/stankate)
