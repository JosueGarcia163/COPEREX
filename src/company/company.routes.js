import { Router } from "express"
import { getCompany, createCompany, filterCompanies, updateCompany } from "./company.controller.js"
import { createValidator, getCompanyValidator, updateCompanyValidator } from "../middlewares/company-validators.js"

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "65d8c1e4c2e63b001f1d0a3b"
 *         name:
 *           type: string
 *           example: "Tech Solutions"
 *         email:
 *           type: string
 *           example: "contact@techsolutions.com"
 *         phone:
 *           type: string
 *           example: "12345678"
 *         levelImpact:
 *           type: string
 *           enum: ["Alto", "Medio", "Bajo"]
 *           example: "Alto"
 *         yearsOfExperienceInitial:
 *           type: number
 *           example: 10
 *         yearsOfExperience:
 *           type: number
 *           example: 10
 *         category:
 *           type: string
 *           example: "Technology"
 *         status:
 *           type: boolean
 *           example: true
 *         yearOfFoundation:
 *           type: number
 *           example: 2014
 */


/**
 * @swagger
 * /managerCompanies/v1/company/createCompany:
 *   post:
 *     summary: Crear una nueva empresa
 *     description: Permite crear una nueva empresa en el sistema.
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - levelImpact
 *               - yearOfFoundation
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: ESKIBIDI EMPRESA
 *               email:
 *                 type: string
 *                 example: email@empresa.com
 *               phone:
 *                 type: string
 *                 example: "12345678"
 *               levelImpact:
 *                 type: string
 *                 enum: ["Alto", "Medio", "Bajo"]
 *                 example: "Alto"
 *               yearOfFoundation:
 *                 type: number
 *                 example: 2000
 *               category:
 *                 type: string
 *                 example: Tecnología
 *     responses:
 *       200:
 *         description: Empresa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       500:
 *         description: Error al crear la empresa
 */

router.post("/createCompany", createValidator, createCompany)

/**
 * @swagger
 * /managerCompanies/v1/company/:
 *   get:
 *     summary: Obtener todas las empresas
 *     description: Retorna todas las empresas activas.
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       500:
 *         description: Error al obtener las empresas
 */

router.get("/", getCompanyValidator, getCompany)

/**
 * @swagger
 * /managerCompanies/v1/company/filter:
 *   post:
 *     summary: Filtrar empresas
 *     description: Filtra las empresas según los años de experiencia, categoría y exportar a Excel.
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minYears:
 *                 type: number
 *                 example: 5
 *               maxYears:
 *                 type: number
 *                 example: 100
 *               categoryOrder:
 *                 type: string
 *                 enum: ["asc", "desc"]
 *                 example: "desc"
 *               downloadExcel:
 *                 type: boolean
 *                 example: false
 *     parameters:
 *       - in: body
 *         name: filterParams
 *         description: Parámetros para filtrar empresas.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             minYears:
 *               type: number
 *               example: 5
 *             maxYears:
 *               type: number
 *               example: 100
 *             categoryOrder:
 *               type: string
 *               enum: ["asc", "desc"]
 *               example: "desc"
 *             downloadExcel:
 *               type: boolean
 *               example: false
 *     responses:
 *       200:
 *         description: Empresas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error al filtrar las empresas
 */

router.post("/filter", getCompanyValidator, filterCompanies)

/**
 * @swagger
 * /managerCompanies/v1/company/updateCompany/{id}:
 *   put:
 *     summary: Actualizar los detalles de una empresa
 *     description: Permite actualizar los datos de una empresa existente en el sistema.
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la empresa a actualizar.
 *         schema:
 *           type: string
 *           example: "607c72ef9e6a2a001f7a92e3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre actualizado de la empresa.
 *                 example: "Empresa Actualizada"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico de la empresa.
 *                 example: "email@empresaactualizada.com"
 *               phone:
 *                 type: string
 *                 description: Número de teléfono de la empresa.
 *                 example: "12345678"
 *               levelImpact:
 *                 type: string
 *                 description: Nivel de impacto de la empresa.
 *                 enum: ["Alto", "Medio", "Bajo"]
 *                 example: "Medio"
 *               yearOfFoundation:
 *                 type: integer
 *                 description: Año de fundación de la empresa.
 *                 example: 2005
 *               category:
 *                 type: string
 *                 description: Categoría de la empresa.
 *                 example: "Consultoría"
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Empresa actualizada."
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Datos de entrada inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Los datos proporcionados no son válidos."
 *       404:
 *         description: Empresa o usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Empresa no encontrada."
 *       500:
 *         description: Error interno del servidor al actualizar la empresa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Error al actualizar la empresa."
 */


router.put("/updateCompany/:id", updateCompanyValidator,  updateCompany)


export default router