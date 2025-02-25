import { Router } from "express"
import { getCompany, createCompany, filterCompanies } from "./company.controller.js"
import { createValidator, getCompanyValidator } from "../middlewares/company-validators.js"

const router = Router()


router.post("/createCompany", createValidator, createCompany)


router.get("/", getCompanyValidator, getCompany)


router.post("/filter", getCompanyValidator, filterCompanies)


export default router