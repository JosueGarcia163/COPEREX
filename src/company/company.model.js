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
    yearsOfExperienceInitial: {
        type: Number,
        default: 0,
        min: 0
    },
    yearsOfExperience: {
        type: Number,
        default: 0,
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
    yearOfFoundation: {
        type: Number,
        required: true
    }
},
    {
        versionKey: false,
        timestamps: true
    })

//Este middleware me sirve para calcular los años antes de guardar.
companySchema.pre("save", function (next) {
    // defino la constante que tiene la fecha actual
    const currentYear = new Date().getFullYear();
    //Si el documento es nuevo se ejecuta el siguiente bloque.
    if (this.isNew) {
        /*con this hacemos referencia al documento de la base de datos que estoy modificando.
        se resta la fecha actual - el año de fundacion para calcular el año inicial el cual
        no modificaremos, por que es un registro de los años de experiencia que tenia al 
        registrarse en el programa.
        */
        this.yearsOfExperienceInitial = currentYear - this.yearOfFoundation;
        // asigno a años de experiencia los años de experiencia inicial.
        this.yearsOfExperience = this.yearsOfExperienceInitial;
    }
    next();
});


companySchema.pre("findOneAndUpdate", async function (next) {
    /*Aqui obtenemos el documento por medio de la consulta 
    this en este caso seria la consulta entonces con this.getQuery
    traemos el id del documento y con this.model.findOne
    traemos todo el documento por medio del id.
    */
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
        //si lo encuentra  utilizamos la funcion de updateYearsOfExperience para actualizar el documento.
        await updateYearsOfExperience(docToUpdate);
    }
    next();
});


const updateYearsOfExperience = async function (doc) {
    if (doc) {
        // const currentYear = new Date().getFullYear();
        const currentYear = 2028
        /*ahora a yearsOfExperienceInitial le sumo la fecha actual menos la fecha de la creacion del documento
        esto con el fin de actualizar el año de experiencia sumandole los años que han pasado despues de creado 
        el documento o la empresa.
        */ 
        const newYearsOfExperience = doc.yearsOfExperienceInitial + (currentYear - doc.createdAt.getFullYear());

        //Si el año de trayectoria que acabmos de modificar es distinto al que ya teniamos en la db se le asigna a yearsOfExperience para actualizarlo.
        if (doc.yearsOfExperience !== newYearsOfExperience) {
            doc.yearsOfExperience = newYearsOfExperience;
            //lo guardamos en la db
            await doc.save(); 
        }
    }
};


companySchema.post("findOne", async function (doc) {
    if (doc) {
        //Si el usuario busca un documento usamos la funcion de actualizar años de experiencia para verificar si pasaron años. 
        await updateYearsOfExperience(doc);
    }
});


companySchema.post("find", async function (docs) {
    //Valido de que docs sea  un array
    if (Array.isArray(docs)) {
        //Aca se recorre todos los documentos docs por medio de doc en un bucle.
        for (let doc of docs) {
            
            //Se actualiza los años de experiencia para cada documento osea cada empresa.
            await updateYearsOfExperience(doc);
        }
    }
});



export default model("Company", companySchema)