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
        - [ ] Must support at least 2 order-by (5 marks) - I'll add 1 more sort later
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
