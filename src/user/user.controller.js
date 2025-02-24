import User from "./user.model.js"
import { hash } from "argon2";



/*Funcion para crear usuario por default*/ 
export const createDefaultUser = async () => {
    try {
        /*Agregamos la constante de email por default antes 
        debido a que necesitamos este email para buscar si ya existe.
        */
        const defaultEmail = "admin@example.com";

        /*Aqui en este apartado buscamos si existe el usuario en la base de datos
        por medio de defaultEmail.
        */ 
        const existingUser = await User.findOne({ email: defaultEmail });
        //Si ya existe tira esta validacion y no hara nada.
        if (existingUser) {
            console.log("El usuario administrador ya existe. No se creará nuevamente.");
            return;
        }

        //Si no esta el usuario creado encriptara esta password con argon.
        const hashedPassword = await hash("Admin1234#/SFDS=)");

        /*Definimos los valores por default del usuario.*/ 
        const defaultUser = new User({
            name: "Admin",
            surname: "User",
            username: "admin",
            email: defaultEmail,
            password: hashedPassword,
            phone: "12345678",
            role: "ADMIN_ROLE",
            status: true,
        });

        //Lo guardamos en la base de datos.
        await defaultUser.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("Usuario administrador creado exitosamente.");
    } catch (error) {
        console.error("Error al crear el usuario administrador:", error.message);
    }
};
