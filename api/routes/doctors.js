const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Doctor = require('../models/doctor');

router.get('/', (req, res, next) => {

    
    const {name, rating, like, dislike, contact } = req.query;
    const queryObject = {};
    
    if(rating) {
        queryObject.rating = rating;

    }

    if(like) {
        queryObject.like = like;

    }

    if(dislike) {
        queryObject.dislike = dislike;

    }

    if(contact) {
        queryObject.contact = {$regex: contact, $options: "i"}; 

    }

    if(name) {
        queryObject.name = {$regex: name, $options: "i"};   
    }

    let apiData = Doctor.find(queryObject);
 
    

   Doctor.find(queryObject)
      .select("name rating like dislike contact date _id")
      .exec()
      .then(docs => {
        const response = {
            count: docs.length,
            Doctors: docs.map(doc => {
                return{
                    name: doc.name,
                    rating: doc.rating,
                    like: doc.like,
                    dislike: doc.dislike,
                    contact: doc.contact,
                    date: doc.date,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url:'http://localhost:3000/doctors/' + doc._id
                    }
                }
            })
        };
        //console.log(docs);
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
      });

});

router.post("/", (req, res, next) => {
    
    const doctor = new Doctor({ 

        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rating: req.body.rating,
        like: req.body.like,
        dislike: req.body.dislike,
        contact: req.body.contact,
        date: req.body.date
        

    });
    doctor 
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
            message:'Created Doctor review successfully',
            createdDoctorReview: {
                
                    name: result.name,
                    rating: result.rating,
                    like: result.like,
                    dislike: result.dislike,
                    contact: result.contact,
                    date: result.date,
                    _id: result._id,
                    request: {
                        type:'GET',
                        url:'http://localhost:3000/doctors/' + result._id
                    }
    
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        }); 
      });
    
  
});

router.get('/:doctorId', (req, res, next) => {
   const id = req.params.doctorId
   Doctor.findById(id)
       .select("name rating like dislike date _id")
       .exec()
       .then(doc => {
        console.log("from the database",doc);
        if(doc)
        {
            res.status(200).json({
                doctor: doc,
                request: {
                    type:'GET',
                    url: 'http://localhost:3000/doctors'
                }
            });
        }
        else{
            res.status(500).json({
                message:'No valid entry found for provided id'
            });
        }
        
       })
       .catch(err => {
           console.log(err);
           res.status(500).json({
            error: err
           })
       });
   
});

router.patch('/:doctorId', (req, res, next) => {
    const id = req.params.doctorId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Doctor.updateOne({_id: id}, {$set: updateOps})
       .exec()
       .then(result => {
        //console.log(result);
        res.status(200).json({
            message: 'Doctor review updated',
            request: {
                type:'GET',
                url:'http://localhost:3000/doctors/' + id
            }
        });
       })
       .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
       });

});

router.delete('/:doctorId', (req, res, next) => {
    const id = req.params.doctorId;
 
     Doctor.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Doctor Review deleted',
            request: {
                type: 'POST',
                url:'http://localhost:3000/doctors/',
                body:{name:'String', rating:'Number', like:'Number', dislike:'Number', contact:'String', date:'Date'} 
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;