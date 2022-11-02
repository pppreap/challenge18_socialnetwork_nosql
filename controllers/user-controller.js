const { User, Thought } = require('../models');

const userController = {
    getAllUser( req, res){
        User.find()
            .select('-_v')
            .then((dbUserData)=> res.json(dbUserData))
            .catch((err) => 
                res.sendStatus(404).json(err));

    },
    getUserById (req,res){
        User.findOne({_id:req.params.id})
            .select('-_v')
            .populate({
                path:'thoughts',
                select:'-_v'
            })
            .populate({
                path:'friends',
                select:'-_v'
            })
            .then((dbUserData)=> {
                if (!dbUserData){
                    res.status(404)
                        .json({message: 'No user found with that id!'});
                } else {
                res.json(dbUserData);
            }
            })
            .catch((err) => 
                res.sendStatus(400).json(err));
     },
     createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err)=>{res.status(500).json(err);
        });
    },

     updateUser({req, body}, res) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new:true, runValidators:true})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message:'No User found with this id!'});
                } else {
                res.json(dbUserData);
                }
                })
                .catch((err)=>res.status(500).json(err));
            },
        deleteUser(req, res ){
            User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
              if (!user) {
                res.status(404).json({ message: "No user found with that id" });
              } else {
                // Deletes the thoughts associated with the user being deleted
                return Thought.deleteMany({ _id: { $in: user.thoughts } });
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
            .then((dbUserData) => 
                res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
        },

        deleteFriend( req, res) {
            User.findOneAndUpdate(
                { _id:req.params.userId },
                { $pull: { friends: req.params.friendId }},
                { new:true }
            )
            .then((dbUserData) =>  {
                res.json(dbUserData)})
            .catch((err) => res.status(400).json(err));
        },

};

module.exports = userController;