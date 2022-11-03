const { User, Thought } = require('../models');

module.exports = {

    getAllThought(req,res){
        Thought.find()
            .select('-__v')
            .then((dbThoughtData)=> res.json(dbThoughtData))
            .catch((err) => 
                res.status(500).json(err));
    },
    getThoughtById (req,res){
        Thought.findOne({ _id: req.params.thoughtId})
            .select('-__v')
            .then(dbThoughtData=> {
                if (!dbThoughtData){
                    res.status(404)
                        .json({message: 'No thoughts found with that id!'});
                } else {
                res.json(dbThoughtData);
                }
            })
            .catch((err) => 
                res.status(500).json(err));
     },
     createThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughtData) =>{
            res.json(dbThoughtData);
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: dbThoughtData._id, thoughtText }},
                { new: true }
            ).catch((err)=>res.status(500).json(err));
        })
        .catch((err)=>res.status(500).json(err));
     },

     updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId}, 
            {$set: req.body}, 
            {new:true, runValidators:true})
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({message:'No Thoughts found with this id!'});
                } else {
                res.json(dbThoughtData);
                }
              })
                .catch((err)=>res.json(err));
            },

        deleteThought(req, res ){
                    Thought.findOneAndDelete({ _id: req.params.thoughtId})
                        .then(dbThoughtData => {
                            if(!dbThoughtData){
                                res.status(404).json({ message: 'No thoughts found with this Id'});
                            } else {
                                res.json({message:'Thought Deleted'});
                                }
                        })
                        .catch((err)=>res.status(500).json(err));
                },
        createReaction(req, res) {
            Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body }},
                { new:true,  runValidators:true})
                .populate({path: 'reactions', select: '-__v'})
                .select('-__v')
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                        res.status(404).json({message: 'No thoughts with this ID.'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.status(400).json(err))
            },

        deleteReaction( req, res) {
            Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: {reactionId: req.params.reactionId} }},
                { new:true })
                .then(dbThoughtData => {
                    if (!dbThoughtData) {
                      res.status(404).json({ message: 'None!'});
                      return;
                    }
                   res.json(dbThoughtData);
                  })
                  .catch(err => res.json(err));
              }
            
};


