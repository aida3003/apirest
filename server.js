const mongoose = require('mongoose');
const express = require("express")
const User = require("./module/user");// imprtation du module
require("dotenv").config({ path: "./config/.env" }); // Chargement des variables d'environnement
 const app = express()


 // middleware parser les donnees json
 app.use(express.json());
 //middlleware pour parsr lres donnees 
 app.use(express.urlencoded({ extended: true}));


(async function () {
    try {
       
         // Connexion à MongoDB
         await mongoose.connect(process.env.MONGO_URI);
        console.log("Tentative de connexion à la base de données...");

    //methode get
     app.get("/users" , async(req , res) => {
        try {
             const users = await User.find();
             res.json(users)
        } 
        catch (error) {
            res.json({message: error.message});  
        } 
     });
      //methode get recherche de l'utilisateur par son id
      app.get("/users/:id" , async(req , res) => {
        try {
            //recherche de l'utilisateur par son id
             const user = await User.findById(req.params.id);
             // si  l'uilisateur  ne se trouve pas dans la base de donnees
             if(!user){
                return res.json({message:"utlisateurnon trouve"})
             }
             res.json(user)
        } 
        catch (error) {
            res.json({message:  error.message});  
        } 
     }); 
     
        //methode post pour ajouter ou inserer
        app.post('/users' , async (req  ,res) => {
            const { name, email, age}= req.body;

             try {
               const newUser = new User({ name , email , age}); 
               await newUser.save();
               res.status(201).json(newUser);
             } catch (error) {
                res.status(400).json({message:error.message})
             }
        });
     //methode put pour modifier

         app.put('/users/:id', async (req , res) => {
            try {
                 const updadeuser = await User.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new:true
                    }
                 );
                 res. status(200).json(updadeuser)
                
            } catch (error) {
                res.json({message: error.message })
                
            }
         });
 //methode delete pour supprimer
       
          app.delete('/users/:id', async (req , res) => {
            try { 
                await User.findByIdAndDelete(req.params.id);
                res.json ({message: "utilisateur supprime avec succes"})
                
            } catch (error) {
                res.json({message: error.message})
                
            }
            
          })

       
    }catch (error) {
        console.error("Erreur :", error.message);
    }
})();
//ecouter le serveur
app.listen( 3000 , ()=> {
    console.log(" le serveur est ecoute sur le port 3000");
    
})
