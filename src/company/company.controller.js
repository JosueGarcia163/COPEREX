import { hash, verify } from "argon2";
import Company from "./company.model.js"

export const createCompany = async (req, res) => {
    try {

        //desestructuramos los objetos del req.body de publicacion.
        const { name, email, phone, levelImpact, yearsOfExperience, category } = req.body;
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
            company
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las empresas",
            error: err.message
        })
    }
}

export const filterCompanies = async (req, res) => {
    try {
        const query = { status: true };
        const { minYears, maxYears, categoryOrder } = req.body;


        if (minYears || maxYears) {
            query.yearsOfExperience = {};
            //$gte es una funcion que por sus siglas significa Greater than or equal
            if (minYears) query.yearsOfExperience.$gte = parseInt(minYears);
            //$lte es una funcion de mongo que significa less than or equal 
            if (maxYears) query.yearsOfExperience.$lte = parseInt(maxYears);
        }

        //Creo este objeto para definir dentro de el los criterios que tendremos para listar en este caso la categoria.
        let sortOptions = {};
        //Si el usuario ejecuta o manda alguna categoria por ejemplo asc o desc entrara al siguiente bloque de codigo.
        if (categoryOrder) {
            //si el usuario coloca asc se le agrega 1 al objeto sortOptions 
            if (categoryOrder === "asc") {
                sortOptions.category = 1;
                //si el usuario coloca desc se le agrega un valor de -1 al objeto. 
            } else if (categoryOrder === "desc") {
                sortOptions.category = -1;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "caracteres no validos. Use 'asc' para A-Z o 'desc' para Z-A."
                });
            }
        }

        /*ahora listamos por filtro de query que contiene los filtros de los años de trayectoria
        tambien utilizo el filtro de sort el cual se origino en mongoDB en sus inicios para poder 
        filtrar utilizando como base 1 y -1, con esta funcion me aseguro de que si por ejemplo sort 
        recibe 1 se ordenara en orden ascendente (A a la Z) y si recibe -1 se ordenara en orden descendente.
        */
        const companies = await Company.find(query).sort(sortOptions);

        return res.status(200).json({
            success: true,
            companies
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las empresas",
            error: err.message
        });
    }
};


export const updateCompany = async (req, res) => {
    try {

        const { id } = req.params;
        //desestructuramos los objetos del req.body de publicacion.
        const { name, email, phone, levelImpact, yearsOfExperience, category } = req.body;
        const user = req.usuario

        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                msg: "Empresa no encontrada",
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        company.name = name || company.name;
        company.email = email || company.email;
        company.phone = phone || company.phone;
        company.levelImpact = levelImpact || company.levelImpact;
        company.yearsOfExperience = yearsOfExperience || company.yearsOfExperience;
        company.category = category || company.category;

        await company.save();

        res.status(200).json({
            success: true,
            msg: 'Empresa actualizada.',
            company
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar la empresa.', error: error.message });
    }
};



















