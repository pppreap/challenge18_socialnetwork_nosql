const { User, Thought } = require('../models');

const userController = {
    getAllUser( req, res){
        User.find({})
            .select('-_v')
            .sort({_id: -1})
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
        deleteUser({ params }, res ){
            Thought.deleteMany({userId:params.id})
                .then(()=>{
                    User.findOneAndDelete({ userId: params.id})
                        .then(dbUserData => {
                            if(!dbUserData){
                                res.status(404).json({ message: 'No User found with this Id'});
                                return;
                            }
                            res.json(dbUserData);
                        });
                })
                .catch(err => res.json(err));
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