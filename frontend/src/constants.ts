export const DEFAULT_SETTINGS = {
    "settings": {
        "misc": [
            {
                "name": "Autosave Interval",
                "value": 1000,
                "unit": "ms"
            },
            {
                "name": "Autodelete Interval",
                "value": 1000,
                "unit": "ms"
            }
        ],
    
        "plugins": [
            {
                "name": "robot-language-server",
                "active": true
            },
            {
                "name": "c-language-server",
                "active": false 
            },
            {
                "name": "cypress-language-server",
                "active": false 
            }
        ]

    }
}
