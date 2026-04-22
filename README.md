# Web Development Project 7 - *Crewmates*

Submitted by: **Alexander Pulido**

This web app: **Create, read, update, and delete space crewmates with Supabase-backed persistence. Assign roles that restrict available skills, view crew statistics, and track mission readiness.**

Time spent: **10** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate
  - Users can set the crewmate's attributes by clicking on one of several values
- [x] **The web app includes a summary page of all the user's added crewmatese**
  -  The web app contains a summary page dedicated to displaying all the crewmates the user has made so far
  -  The summary page is sorted by creation date such that the most recently created crewmates appear at the top
- [x] **A previously created crewmate can be updated from the list of crewmates in the summary page**
  - Each crewmate has an edit button that will take users to an update form for the relevant crewmate
  - Users can see the current attributes of their crewmate on the update form
  - After editing the crewmate's attribute values using the form, the user can immediately see those changes reflected in the update form and on the summary page 
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - Using the edit form detailed in the previous _crewmates can be updated_ feature, there is a button that allows users to delete that crewmate
  - After deleting a crewmate, the crewmate should no longer be visible in the summary page
  - [x] **Each crewmate has a direct, unique URL link to an info page about them**
    - Clicking on a crewmate in the summary page navigates to a detail page for that crewmate
    - The detail page contains extra information about the crewmate not included in the summary page
    - Users can navigate to to the edit form from the detail page

The following **optional** features are implemented:

- [x] A crewmate can be given a category upon creation which restricts their attribute value options
  - User chooses a role (Engineer, Scientist, Captain, Medic, Security) before selecting a skill
  - Based on the role, users are allowed to access only a subset of the possible skill attributes
- [x] A section of the summary page, displays summary statistics about a user's crew on their crew page
  - Shows total crewmate count and per-role breakdown with percentages
- [x] The summary page displays a custom "success" metric about a user's crew which changes the look of the crewmate list
  - A "Crew Readiness" percentage tracks how many of the 5 roles are filled, with color-coded banners (red/yellow/green)


The following **additional** features are implemented:

* [x] Detail page shows bio, creation date, and unique ID for each crewmate
* [x] Color picker for crewmate avatars
* [x] Responsive sidebar navigation with active state highlighting

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://imgur.com/a/Xe5YFjQ' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:

[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app.

## License

    Copyright [2026] [Alexander Pulido]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
