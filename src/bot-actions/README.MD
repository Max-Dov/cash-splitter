# Actions

`/bot-actions` folder contains actions that bot does once hears a command. 
These actions are wrapped in "action creator" functions to make sure command name extraction via 
`Localizer` won't happen on `import`.

Bot action being "Command to Command Handler" relation is wrapped in tuple for convenience.