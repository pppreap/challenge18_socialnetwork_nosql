const { User, Thought } = require('../models');

const userController = {
    getAllUser( req, res ) {
        User.find()
            .select('-__v')
            .then((dbUserData)=> res.json(dbUserData))
            .catch((err) => 
                res.status(500).json(err));

    },
    getUserById (req,res){
        User.findOne({ _id:req.params.id})
            .select('-__v')
            .populate({
                path:'thoughts',
                select:'-__v'
            })
            .populate({
                path:'friends',
                select:'-__v'
            })
            .then((oneUserData)=> {
                if (!oneUserData){
                    res.status(404)
                        .json({message: 'No user found with that id!'});
                } else {
                res.json(oneUserData);
            }
            })
            .catch((err) => 
                res.sendStatus(400).json(err));
     },
     createUser(req, res) {
        User.create(req.body)
        .then((oneUserData) => res.json(oneUserData))
        .catch((err)=>{res.status(500).json(err);
        });
    },

     updateUser(req, res) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new:true, runValidators:true})
            .then(oneUserData => {
                if(!oneUserData) {
                    res.status(404).json({message:'No User found with this id!'});
                } else {
                res.json(oneUserData);
                }
                })
                .catch((err)=>res.status(500).json(err));
            },
        deleteUser(req, res ){
            User.findOneAndDelete({ _id: req.params.id })
            .then((oneUserData) => {
              if (!oneUserData) {
                res.status(404).json({ message: "No user found with that id" });
              } else {
                // Deletes the thoughts associated with the user being deleted
                return Thought.deleteMany({ _id: { $in: oneUserData.thoughts } });
              }
            })
            .then(() => res.json({ message: "User and thoughts deleted" }))
            .catch((err) => res.status(500).json(err));
        },

        addFriend( req, res) {
            User.findOneAndUpdate(
                { _id:req.params.userId },
                { $addToSet: { friends: req.params.friendId }},
                { new:true }
            )
            .then((oneUserData) => 
                res.json(oneUserData))
            .catch((err) => res.status(400).json(err));
        },

        deleteFriend( req, res) {
            User.findOneAndUpdate(
                { _id:req.params.userId },
                { $pull: { friends: req.params.friendId }},
                { new:true }
            )
            .then((oneUserData) =>  {
                res.json(oneUserData)})
            .catch((err) => res.status(400).json(err));
        },

};

module.exports = userController;