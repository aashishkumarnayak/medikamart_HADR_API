const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {


  const {name, rating, like, dislike, contact, hospital_id, address, verified} = req.query;
  const queryObject = {};
  
  if(hospital_id) {
    queryObject.hospital_id = hospital_id;

  }
   
  if(rating) {
      queryObject.rating = rating;

  }

  if(verified) {
    queryObject.verified = verified;

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
  
  if(address) {
    queryObject.address = {$regex: address, $options: "i"}; 

   }

  if(name) {
      queryObject.name = {$regex: name, $options: "i"};   
  }



  Hospital.find(queryObject)
    .select("name rating like dislike date hospital_id address contact verified _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        hospitals: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            rating: doc.rating,
            like: doc.like,
            dislike: doc.dislike,
            date: doc.date,
            hospital_id: doc.hospital_id,
            address: doc.address,
            contact: doc.contact,
            verified: doc.verified,
            request: {
              type: "GET",
              url: "http://localhost:3000/hospitals/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
 
      const hospital = new Hospital({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        rating: req.body.rating,
        like: req.body.like,
        dislike: req.body.dislike,
        date: req.body.date,
        hospital_id: req.body.hospital_id,
        address: req.body.address,
        contact: req.body.contact,
        verified: req.body.verified
      });

      
        hospital
        .save()
        .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Hospital Review stored",
        createdHospitalReview: {
          _id: result._id,
          name: result.name,
          rating: result.rating,
          like: result.like,
          dislike: result.dislike,
          date: result.date,
          hospital_id: result.hospital_id,
          address: result.address,
          contact: result.contact,
          verified: result.verified
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/hospitals/" + result._id
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

router.get("/:hospitalId", (req, res, next) => {
  Hospital.findById(req.params.hospitalId)
    .exec()
    .then(hospital => {
      if (!hospital) {
        return res.status(404).json({
          message: "Hospital not found"
        });
      }
      res.status(200).json({
        hospital: hospital,
        request: {
          type: "GET",
          url: "http://localhost:3000/hospitals"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/:hospitalId', (req, res, next) => {
  const id = req.params.hospitalId;
  const updateOps = {};
  for(const ops of req.body){
      updateOps[ops.propName] = ops.value;
  }
  Hospital.updateOne({_id: id}, {$set: updateOps})
     .exec()
     .then(result => {
      //console.log(result);
      res.status(200).json({
          message: 'Hospital Review update',
          request: {
              type:'GET',
              url:'http://localhost:3000/hospitals/' + id
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

router.delete("/:hospitalId", (req, res, next) => {
  Hospital.remove({ _id: req.params.hospitalId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Hospital Review deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/hospitals",
          body:{name:'String', rating:'Number', like:'Number', dislike:'Number', date:'Date', hospital_id:'Number', address:'String', contact:'String', verified:'Boolean'} 
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
