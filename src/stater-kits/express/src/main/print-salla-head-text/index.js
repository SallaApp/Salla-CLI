const logo = require("asciiart-logo");
console.log(
  logo({
    name: "Salla",
    font: "DOS Rebel",
    fontSize: 1,
    lineChars: 1,

    padding: 1,
    margin: 1,
    borderColor: "grey",
    logoColor: "white",
    textColor: "white",
  })
    .center("^_^")
    .center("Welcome to Salla Express Starter Kit ")
    .center("https://salla.dev/")
    .emptyLine()
    .render()
);
