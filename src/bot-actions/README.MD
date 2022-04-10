# Actions

`/bot-actions` folder contains actions that bot does once hear a message or receives a chat command. 

Actions are wrapped in "action creator" functions to make sure command name extraction via 
`Localizer` won't happen on `import`.

Bot action being "Command to Command Handler" relation is wrapped in tuple for convenience.

Note: "bot-action" entity type refers both to "message action" and "command action".