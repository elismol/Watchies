# Watchies

## NB: the application was created to work optimally with android devices
The application was only tested with different android devices. There are differences between Android and iOS regarding the functionality of react native core components (one of our reviewers experienced feedback from the Pressable-component on iOS when we do not include the "pressed" attribute in the styling of the component, and the modal pop up did not work on their favorites page) and the order of the stacking of components when running the project (some components was incorrectly positioned in front of others, which we never experienced when testing on three different android devices). 
Therefore, the application has ciritcal bugs when ran with iOS. We only had Windows computers available so we could not use the iOS simulator in Xcode. However, we could have used a third-party simulator (for instance BlueStacks) to test it with iOS, but it was not a criteria in this project and therefore considered out of scope.

We would recommend that you try out the application with an Android device or an Android simulator to experience the intended bugless behvaiour of the app that we strived to achieve.

### DEMO: If you do not have access to an Android device or Android simulator
We have provided a video demo of the application that showcases all of the availabe funcitonality the way we experienced it on our Android devices.

```bash
https://veed.io/view/d6b55733-b3a7-4bcf-b1cd-e9f740e336aa
```

#### Functionality showcased in the demo:
- Different feedback when signing in and signing up (the email field will also check if "@" and "." is present).
- Creating a user.
- Scrolling in the infinite list.
- Pressing on a movie on the homepage.
- Adding a movie to your favorites list.
- Searching for a movie.
- Feedback when reaching the end of the infinite list.
- Feedback when there is no movies matching the search.
- Filter on genre.
- Sorting on newest first or oldest first.
- Sorting, filter and search dissapears on scroll down and appears on scroll up.
- Users email displayed/hidden at the top right corner.
- Dark mode/light mode.
- View movies added to your favorites list on the favorites page.
- Pressing on a movie on the favorite page.
- Skips login page when previously logged in after completely closing the app.
- Saves the previous dark/light mode settings after completely closing the app.
- Signing out with the Sign out button, confirm the sign out and then get directed to login page instead of homepage when reopening the app.
- Remove a movie from the favorites list on the favorites page.
- Persistent favorites list after signing out and in.

## Run Instructions
1. Check if you have yarn installed:
```bash
yarn --version
```

2. If you get yarn command not found, install yarn:
```bash
npm install --global yarn
```
3. Repeat step 1 to verify that yarn was successfully installed.

4. Install the dependencies inside /watchies:
```bash
yarn install
```

5. Inside /watchies, run the command:
```bash
yarn start
```

6. Download the expo app from google play or app store. 
7. Scan the QR-code. The phone and the computer needs to be connected to the same internet connection. 
8. If it dosent start building in the terminal on the first try, close the app-window on your phone, go back to the expo-app and scan the QR-code again.


If you encounter this error message in the terminal: 
- "apiV2Error: Entity Not Authorized."
Then run the command:
```bash
expo logout
```
Then continue through the remaining steps.

### APK
If you have an android phone and would like to try out the app without the expo app, you can download the apk and install it on your phone from here:
```bash
https://expo.dev/artifacts/eas/ojdsm2wQjWEZ56nfkvsB1H.apk
```


## About Watchies 
Watchies is a React Native application. The main functionality of the application is to search through a database consisting of 37000 movies. You are also able to filter and sort the movies, and add movies to the user's favorites list. 

### Login Page
When you open the application you will be directed to the initial page, the login page. Here you can enter your email and password to sign in, or create a new account. The form handles various errors and gives feedback to the user. If you were previously logged in without logging out, then you will be directed directly into movies, skipping the login screen. The last theme (dark/light) setting will also be saved.

<img src="./assets/readmeImages/loginDark.jpg" width="280" height="600">

<img src="./assets/readmeImages/loginLight.jpg" width="280" height="600">

### Movie Search Page
After signing in you will be directed to the movie search page. Here you are able to search, filter and sort. The header containing the search bar and drop-downs will dissappear when scrolling downwards and appear when scrolling upwards or when you are at the top. It is not possible to make the header dissappear when the view is above the first row of movie components.

<img src="./assets/readmeImages/moviesDark.jpg" width="280" height="600">

<img src="./assets/readmeImages/moviesLight.jpg" width="280" height="600">

You can click on a movie to view more information as well as adding it to favorites. There is also a button directing you to the IMDB page.

<img src="./assets/readmeImages/movieInfoDark.jpg" width="280" height="600">

<img src="./assets/readmeImages/movieInfoLight.jpg" width="280" height="600">

### Favorite Movies Page
On this page you will be able to see all your favorite movies that were previously added.

<img src="./assets/readmeImages/favoritesDark.jpg" width="280" height="600">

<img src="./assets/readmeImages/favoritesLight.jpg" width="280" height="600">

### Log out
When pressing the log out tab in the navbar you will get a pop up to confirm if you would like to log out or not.

<img src="./assets/readmeImages/logOutDark.jpg" width="280" height="600">

<img src="./assets/readmeImages/logOutLight.jpg" width="280" height="600">

### Dark/Light Mode
On all the pages there is a switch available where you can change the mode between dark and light. Default is dark, but after running the app for the first time, your settings wil be saved.

## Implementations/changes
- Restructure/rewrite code in Movie and Favorites - into seperate components.
- Almost all of the styling.
- Better validation and error feedback in Login.
- Saves and checks if the user is logged in to skip over the login page and navigate straight to movies if already logged in. 
- Log out modal that asks if the user wants to log out.
- New bottom navbar.
- Redesigned login page.
- Rewrote and redesigned header: searchbar, dropdowns, brightness-mode switch and user-info.
- New logo.
- Improved favorites so it does not rerender the whole favorite list when making a change to the favorite page.
- Expanded dark/light mode to change most of the application and not just the background/text color.
- Saves which light-mode activated.
- Fixed a bug from project 3 that made it possible to create several users with the same email through sign up on the login page.
- Rewrote the infinite list with a flatlist.
- Wrote functionality that makes the header (searchbar and dropdowns) visible from the top of the list to the top of the first row of movie components and when swiping up (faster than a very low speed), and invisible when swiping down (faster than a very low speed).
- Added more precise feedback (loading wheels and text) when the flatlist is loading new movies, or if there is no more movies or if the search does not match any movies.
- Deactivate swipe back (especially important on the login-page). Swipe back gesture is still usable instead of the "close" button when you have pressed on a movie.
- Redesigned buttons and layout on the movieInfo modal (when clicking on a movie).
- Added proxy url in the api to the backend from project 3.
- App icons and splash image (in /assets) for the apk build.


## Work process
Throughout this project, we have practiced pair programming as a development technique. With this technique, the pair works from one computer, which is why all the commits in this project are committed by only one group member. We chose this development technique because of the valuable learning outcome for both parties. We did not push to git as often as we are used to because we were always working together on the same computer.

### Git
We decided to not have issues and branches for each component as most of them were already developed in Project 3, and the work that needed to be done involved changing multiple components as a whole, and therefore unnecessary to have issues and branches for individual components. Most of the components needed partly rewriting, improvements or minor fixes to work in React Native. We did not create many issues because we wrote them down on paper instead. This was easier and more effective as we were physically working together over a short period of time. Branches were also somewhat unneccessary as there would not be any conflicts on any of the branches due to the pair programming. We only used it when we were working on stuff that could potentially break the app, as it would allow us to look at the main branch and backtrack our implementations.

## Testing
The application was tested with the expo app on android. It was tested with two devices with different aspect ratios:
- OnePlus 9 Pro: aspect ratio 20.1:9
- Huawei P20 Pro: aspect ratio 18.7:9
The application was also tested as an installed apk on the OnePlus devices.
