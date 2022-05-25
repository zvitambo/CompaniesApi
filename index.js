const cors = require("cors");
const express = require("express");
const customers = require("./routes/companies");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/companies", customers);

//set PORT=3001
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
