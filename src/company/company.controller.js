import { hash, verify } from "argon2";
import Company from "./company.model.js"
import { generateExcel } from "../helpers/excel.validators.js";

export const createCompany = async (req, res) => {
    try {

        //desestructuramos los objetos del req.body de publicacion.
        const { name, email, phone, levelImpact, yearOfFoundation, category } = req.body;
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
            yearOfFoundation,
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


export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, levelImpact, yearOfFoundation, category } = req.body;
        const user = req.usuario;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const currentYear = new Date().getFullYear();


        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                msg: "Empresa no encontrada",
            });
        }

        //Defino la variable que contendra los campos como el nombre, el email, el telefono etc para actualizarlos.
        let updateData = {
            name: name || company.name,
            email: email || company.email,
            phone: phone || company.phone,
            levelImpact: levelImpact || company.levelImpact,
            category: category || company.category,
        };

        //Si yearOfFoundation se proporciono y si es distinto al valor de la db entra al siguiente bloque.
        if (yearOfFoundation && yearOfFoundation !== company.yearOfFoundation) {

            //Cambio los datos como el año de la fundacion de la empresa se pasa a updateData.yearOfFoundation
            updateData.yearOfFoundation = yearOfFoundation;
            /*Hago la resta para que ahora el valor inicial de yearsOfExperienceInitial sea la resta de la fecha actual - el año de la fundacion
            de la empresa.
            Entonces de esta manera defino el nuevo valor inicial en base al nuevo año de fundacion proporcionado por el usuario.
            */
            updateData.yearsOfExperienceInitial = currentYear - yearOfFoundation;
        }

        /*Entonces en base a lo anterior se asigna a yearsOfExperience el año de experiencia inicial mas la resta de la fecha actual y 
        la fecha de la creacion de la empresa.*/
        updateData.yearsOfExperience = (company.yearsOfExperienceInitial) +
            (currentYear - company.createdAt.getFullYear());

        //Actualizamos empresa segun el id proporcionado y colocamos la informacion proporcionada por el usuario.
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: 'Empresa actualizada.',
            company: updatedCompany
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar la empresa.', error: error.message });
    }
};



export const filterCompanies = async (req, res) => {
    try {
        const query = { status: true };
        const { minYears, maxYears, categoryOrder, downloadExcel } = req.body;

        if (minYears || maxYears) {
            query.yearsOfExperience = {};
            //$gte es una funcion que por sus siglas significa Greater than or equal
            if (minYears) {
                query.yearsOfExperience.$gte = parseInt(minYears);
            }
            //$lte es una funcion de mongo que significa less than or equal 
            if (maxYears) {
                query.yearsOfExperience.$lte = parseInt(maxYears);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Caracteres no validos."
                });
            }
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


        if (downloadExcel) {
            //llamo a la funcion generateExcel la cual recibe companies osea los datos de listar ya de con los filtros que se hayan aplicado
            const excelBuffer = await generateExcel(companies);

            //Aqui le indicamos al navegador que la respuesta es un archivo de Excel.
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            /*tambien dentro de Content-Disposition le indicamos con: attachment que descargue el archivo, con filaname 
            le doy el nombre al archivo que debe tener el archivo al momento de descargarse*/
            res.setHeader("Content-Disposition", "attachment; filename=empresas.xlsx");

            //Enviamos el contenido del archivo como respuesta http por medio de send que es un metodo de express.
            return res.send(excelBuffer);
        }


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

































