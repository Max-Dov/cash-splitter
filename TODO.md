# Features
Wrap following functionality in feature flags:
* Clearing messages via "Clear messages" menu.
* Owed items display.

### Create message that will display money split and update on new message
### Expand currencies via command
### Customize "money spent" message via strings templating
### Support message editing
### Remove message if forwarded in same chat with saying "remove"

# Code

### Errors
Improve errors placing within code, so they would be more meaningful and appropriate.
Add feature of debug mode when bot will send error messages to chat or bot owner once having error.

### Strings
Extract to localization.json.

# Bugs

### Can't see userId due to privacy settings
If message is forwarded from user who hides their link, 
then it won't pick that user up.
Potential fix: send message when following happens and don't process message

### If user deletes any message, then bot would throw errors when attempting to delete them
Need to verify that 1st.