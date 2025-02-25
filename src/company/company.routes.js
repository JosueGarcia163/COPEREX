import { Router } from "express"
import { getCompany, createCompany, filterCompanies, updateCompany } from "./company.controller.js"
import { createValidator, getCompanyValidator, updateCompanyValidator } from "../middlewares/company-validators.js"

const router = Router()


router.post("/createCompany", createValidator, createCompany)


router.get("/", getCompanyValidator, getCompany)


router.post("/filter", getCompanyValidator, filterCompanies)


router.put("/updateCompany/:id", updateCompanyValidator,  updateCompany)


export default router