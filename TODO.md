# Features
Wrap following functionality in feature flags:
* Clearing messages via "Clear messages" menu.
* Owed items display.

### Expand currencies via command
### Customize "money spent" message via strings templating
### Support message editing

# Code
### Errors
Improve errors placing within code so they would be more meaningful and appropriate.
Add feature of debug mode when bot will send error messages to chat or bot owner once having error.

# Bugs

### Can't see userId due to privacy settings
If message is forwarded from user who hides their link, 
then it won't pick that user up.
Potential fix: send message when following happens and don't process message

### Can't save bot messageId if chat is not created
If command to count money is launched before any chat interaction is done, then bot message won't be saved
as chat creation is tied to user commands