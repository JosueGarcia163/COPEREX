import { body, param } from "express-validator";
import { companyExist, nameCompanyExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";


export const createValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El name es requerido"),
    body("name").custom(nameCompanyExists),
    validarCampos,
    deleteFileOnError,
    handleErrors
]

export const getCompanyValidator = [
    validateJWT,
    //Utilizamos el metodo para validar o permitir varios roles.
    hasRoles("ADMIN_ROLE"),
    validarCampos,
    handleErrors
]



