const express = require("express");
const fs = require("fs");
const Joi = require("joi");
const router = express.Router();

let companies = [];

fs.readFile("./companies.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    const companylist = JSON.parse(jsonString);
    companies = [...companylist];
  } catch (err) {
    console.log("Error parsing JSON string:", err);
    return [];
  }
});

router.get("/", (req, res) => {
  res.send(companies);
});

router.get("/:id", (req, res) => {
  const company = companies.find((c) => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).send("company not found");
  res.status(200).send(company);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error);
  const company = {
    id: companies.length + 1,
    name: req.body.name,
    logo: req.body.logo_url,
    specialities: req.body.specialities,
    city: req.body.city,
  };
  companies.push(company);
  res.status(201).send(company);
});

router.put("/:id", (req, res) => {
  const company = companies.find((c) => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).send("company not found");

  const { error } = validateCompany(req.body);
  if (error) return res.status(400).send(error);

  company.name = req.body.name;
  company.logo = req.body.logo_url;
  company.specialities = req.body.specialities;
  company.city = req.body.city;

  res.status(201).send(company);
});

router.delete("/:id", (req, res) => {
  const company = companies.find((c) => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).send("company not found");

  const index = companies.indexOf(company);
  companies.splice(index, 1);
  res.status(200).send(company);
});

function validateCompany(company) {
  const schema = {
    name: Joi.string().min(6).required(),
    logo: Joi.string().min(12).required(),
    specialities: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
  };

  return Joi.assert(company, schema);
}

module.exports = router;
