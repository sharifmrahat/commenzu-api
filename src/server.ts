import app from "./app";

async function main() {
  app.listen(5000, () => {
    console.log(`Server is running on port: 5000`);
  });
}

main();
