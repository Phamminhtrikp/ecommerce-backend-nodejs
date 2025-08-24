const app = require("./src/app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`ECommerceServer is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log("ECommerceServer is shutting down...");
    })
    // notify.send({ ping: "ECommerceServer is shutting down..." });
});