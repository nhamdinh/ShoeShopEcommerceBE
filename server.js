require("dotenv").config();
const app = require("./app");

const { PORT } = process.env || 1000;
app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
