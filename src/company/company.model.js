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
    },
    lastUpdated: {
        type: Number

    }
},
    {
        versionKey: false,
        timestamps: true
    })

//Se ejecuta si se utiliza find o findOne y el resultado de la consulta se guarda en docs
companySchema.post(["find", "findOne"], async function (docs) {
    
    //const currentYear = new Date().getFullYear();
    const currentYear = 2028

    
    if (Array.isArray(docs)) {
        
        for (const doc of docs) {
            
            if (!doc.lastUpdated || doc.lastUpdated !== currentYear) {
                const yearsSinceCreated = currentYear - doc.createdAt.getFullYear();
                
                doc.yearsOfExperience += yearsSinceCreated;

                
                doc.lastUpdated = currentYear;  
             

                // Guardamos los cambios en la base de datos
                await doc.save();
            }
        }

        //Si docs no es un array osea se utilo la funcion findOne.
    } else if (docs) {

        const yearsSinceCreated = currentYear - docs.createdAt.getFullYear();

        
        if (!docs.lastUpdated || docs.lastUpdated !== currentYear) {
            docs.yearsOfExperience = docs.yearsOfExperience + yearsSinceCreated;
            docs.lastUpdated = currentYear;  

            await docs.save();  
        }
    }
});



export default model("Company", companySchema)