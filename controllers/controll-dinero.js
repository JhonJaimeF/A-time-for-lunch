
const Dinero= require('./../models/dinero')

////
module.exports= {
    findAll : async(req, res)=>{
        return null
    },
    save : async(req, res) =>{
        const dinero= new Dinero(req.body)
        const {id}= req.params
        try{
            return res.status(201).json({state:true, data:({id:id, dinero:dinero})})
        }catch(err){
            return res.state(404)
        }
    }
}