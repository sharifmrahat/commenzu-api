import app from "./app";
import config from "./config";

async function bootstrap() {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port: ${config.PORT}`);
  });
}

bootstrap();
