module.exports = {
    app: {
        container: '2dks',
        publishPort: 8080
    },
    network: '2dks-net',
    selenium: {
        container: '2dks-selenium',
        publishPort: 4444,
        browserDebugPublishPort: 9222,
        width: 1200,
        height: 600
    }
};
