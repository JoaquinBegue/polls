Site description:
    A simple polls site wich let the user create a new poll and vote in others.


Structure:
    A Question model will represent each poll question. This model will have a
    "question_text" field and a "pub_date" field.

    + Questions will have categories.
    
    A Choice model will represent the choices a poll can have. This model will
    have a Foreign Key to a Question, a "choice_text" field and a "votes" field.

    A Vote model will represent each vote a poll's choice can have. This model 
    will have a Foreign Key to the Choice and the User who voted.


Style structure:
    The main page will display all the polls. Each polls will only show the
    question. If the user is authenticated, a button will allow the choices to
    appear.
    The choices will be displayed in a grid. When the user votes, the content
    of the choice's container should change to show the current results of the
    poll (like Twitter's polls).

    The login and sign up forms will appear as a popup, in the middle of the
    screen, blurring the background.

    + There will be 3 sections: Recent, Trending and All Polls. The user should
    be able to filter the polls by categories.

    + First, 10 questions will be displayed. An infite scroll will let the user
    see more questions.

    + A button will display a form to let the user create a poll. This form
    should let the user add choices for the question, with a minimum of 2.


TODO:

- Add delete poll feature when loading my polls.
- Improve general styling.
- Improve user registration and authentication
- Adjust forms displaying in navbar.
- Fix parameters displaying on narrow viewport width.

- Fix forms data persistence during viewport changes (moving forms from sidebar to navbar).