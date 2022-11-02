const { User, Thought } = require('../models');

const userController = {
    getAllUser( req, res){
        User.find({})
            .select('-_v')
            .then(dbUserData=> res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(404);
                });
    },
    getUserById ({params},res){
        User.findOne({_id:params.id})
            .populate({
                path:'thoughts',
                select:'-_v'
            })
            .populate({
                path:'friends',
                select:'-_v'
            })
            .then(dbUserData=> {
                if (!dbUserData){
                    res.status(404)
                        .json({message: 'No user found with that id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
                });
     },
     createUser({ body}, res) {
        User.create(body)
        .then(dbUserData => rs.json(dbUserData))
        .catch(err=>res.json(err));
     },

     updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new:true, runValidators:true})
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message:'No User found with this id!'});
                    return;
                }
                res.json(dbUserData);
                })
                .catch(err=>res.json(err));
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

        addFriend( {params}, res) {
            User.findOneAndUpdate(
                { _id:params.userId },
                { $push: { friends: params.friendId }},
                { new:true }
            )
            .then((dbUserData) => {
                if(!dbUserData) {
                res.status(404).json({ message: 'No User found with this Id'});
                return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400),json(err));
        },

        deleteFriend( {params}, res) {
            User.findOneAndUpdate(
                { _id:params.userId },
                { $pull: { friends: params.friendId }},
                { new:true }
            )
            .then((dbUserData) => {
                if(!dbUserData) {
                res.status(404).json({ message: 'No User found with this Id'});
                return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
        },

};

module.exports = userController;