import { Schema, model } from "mongoose";

const companySchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    levelImpact: {
        type: String,
        enum: ["Alto", "Medio", "Bajo"],
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timestamps: true
    })

//Se ejecuta si se utiliza find o findOne y el resultado de la consulta se guarda en docs
companySchema.post(["find", "findOne"], async function (docs) {
    //Aqui obtengo el año actual
    const currentYear = new Date().getFullYear();
    //const currentYear = 2026

    //Si docs es un array eso nos quiere decir que se hizo una consulta de tipo find.
    if (Array.isArray(docs)) {
        //declaro un bucle de los documentos y se define doc para representar documentos uno por uno.
        for (const doc of docs) {
            if (!doc.lastUpdated || doc.lastUpdated !== currentYear) {
            /*Restamos con la fecha actual para ver si paso un año
            si current year que es la fecha actual - createdAt que es la fecha en la que se agrego 
            el documento es 1, 2, 3 etc ese numero se le sumara a yearsOfExperience y digamos que 
            yearsOfExperience era 8 al principio ahora se le sumara los años que pasaron.
            */
            doc.yearsOfExperience += (currentYear - doc.createdAt.getFullYear());
            doc.lastUpdated = currentYear;

            //Para que se actualice tambien en la base de datos.
            await doc.save();
            }
        };

        //Si docs no es un array osea se utilo la funcion findOne.
    } else if (docs) {

        docs.yearsOfExperience += (currentYear - docs.createdAt.getFullYear());
        await docs.save();
    }
});



export default model("Company", companySchema)