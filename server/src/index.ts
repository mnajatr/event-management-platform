import App from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

const application = new App();

application.listen(PORT);
