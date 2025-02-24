import { hash, verify } from "argon2";
import Company from "./company.model.js"

export const createCompany = async (req, res) => {
    try {

        //desestructuramos los objetos del req.body de publicacion.
        const { name, email, phone, levelImpact, yearsOfExperience, category} = req.body;
        const user = req.usuario

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        const company = new Company({
            name,
            email,
            phone,
            levelImpact,
            yearsOfExperience,
            category
        });


        await company.save();

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la empresa.', error: error.message });
    }
};


export const getCompany = async (req, res) => {
    try {
        const query = { status: true }

        //Buscamos todas las empresas.
       const company = await Company.find(query)

        return res.status(200).json({
            success: true,
            total,
            company
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}