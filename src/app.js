const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Hazel Joy Tibre",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Hazel Joy Tibre",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Hazel Joy Tibre",
  });
});

app.get("/help", (req, res) => {
  res.send([
    {
      name: "Andrew",
      age: 27,
    },
    {
      name: "Hazel",
    },
  ]);
});

app.get("/about", (req, res) => {
  res.send("<h1>About</h1>");
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
  // res.send({
  //   forecast: "It is snowing",
  //   location: "Philadelphia",
  //   address: req.query.address,
  // });
});

///////////////////////////////////////////////////////////////
// app.get("/weather", (req, res) => {
//   if (!req.query.address) {
//     return res.send({
//       error:
//         "You must provide an address. Unable to connect to geocoding service!",
//     });
//   }

//   geocode(req.query.address, (error, { address, callback } = {}) => {
//     if (error) {
//       return res.send({ error });
//     }

//     forecast(address, callback, (error, {}) => {
//       if (error) {
//         return res.send({ error });
//       }

//       res.send({
//         longitude: body.features[0].center[0],
//         latitude: body.features[0].center[1],
//         location: body.features[0].place_name,
//       });
//     });
//   });
// });
////////////////////////////////////////////////////////////////

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Page not found.",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
