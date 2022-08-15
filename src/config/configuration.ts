export default () => ({
    monday:{
        uri: process.env.MONDAY_URI,
        api_key: process.env.MONDAY_API_KEY
    },
    freshservice: {
        uri: process.env.FRESHSERVICE_URI,
        api_key: process.env.FRESHSERVICE_API_KEY
        
    }
});