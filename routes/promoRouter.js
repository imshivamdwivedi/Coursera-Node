const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promos = require('../models/promos');
var authenticate = require('../authenticate');


const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promos.find({})
     .then((promos) => {
         res.statusCode = 200;
         res.setHeader('Content-Type' , 'application/json');
         res.json(promos);
     },(err) => next(err))
     .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promos.create(req.body)
      .then((promo) => {
        console.log('Promo Created' + promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
     }, (err) => next(err))
  .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
      res.statusCode = 403;
      res.end('PUT opertion is not Supported on /promos');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    Promos.remove({})
      .then((resp) => {
       res.statusCode = 200;
       res.setHeader('Content-type ' , 'application/json');
       res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  promoRouter.route('/:promoId')
  .get((req,res,next) => {
    Promos.findById(req.params.promoId)
      .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Conent-Type' , 'application/json');
        res.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
      res.statusCode = 403;
      res.end('POST operation not Supported on /promos/' + req.params.promoId);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
      leaders.findByIdAndUpdate(req.params.promoId, {
          $set: req.body
      }, { new: true })
      .then((promo) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
      Promos.findByIdAndRemove(req.params.promoId)
      .then((resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  promoRouter.route('/:promoId/comments')
  .get((req,res,next) => {
    Leaders.findById(req.params.promoId)
     .then((promo) => {
         if(promo != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type' , 'application/json');
            res.json(leader.comments);
          }
          else {
              err = new Error('promotion' + req.params.promoId + 'not found');
              err.status = 404;
              return next(err);
          }
     },(err) => next(err))
     .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promos.findById(req.params.promoId)
      .then((promo) => {
          if (promo != null) {
            promo.comments.push(req.body);
            promo.save()
              .then((promo) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(promo);                
              }, (err) => next(err));
          }
          else {
              err = new Error('Promotion ' + req.params.promoId + ' not found');
              err.status = 404;
              return next(err);
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /promotions/'
          + req.params.promoId + '/comments');
  })
  .delete(authenticate.verifyUser ,((req,res,next) => {
    Promos.findById(req.params.promoId)
      .then((promo) => {
          if (promo != null) {
              for (var i = (promo.comments.length -1); i >= 0; i--) {
                promo.comments.id(promo.comments[i]._id).remove();
              }
              promo.save()
              .then((promo) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(promo);                
              }, (err) => next(err));
          }
          else {
              err = new Error('Promotion' + req.params.promoId + ' not found');
              err.status = 404;
              return next(err);
          }
      }, (err) => next(err))
      .catch((err) => next(err));    
     
  })
  ) 
  promoRouter.route('/:promoId/comments/:commentId')
  .get((req,res,next) => {
      Promos.findById(req.params.promoId)
      .then((promo) => {
          if (promo != null && promo.comments.id(req.params.commentId) != null) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promo.comments.id(req.params.commentId));
          }
          else if (promo == null) {
              err = new Error('promotion ' + req.params.promoId + ' not found');
              err.status = 404;
              return next(err);
          }
          else {
              err = new Error('Comment ' + req.params.commentId + ' not found');
              err.status = 404;
              return next(err);            
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser ,(req,res,next) => {
      res.statusCode = 403;
      res.end('POST operation not Supported on /promotions/' + req.params.promoId + '/comments/ ' + req.params.commentId);
  })
  .put(authenticate.verifyUser ,(req,res,next) => {
      Promos.findById(req.params.promoId)
      .then((promo) => {
          if (promo!= null && promo.comments.id(req.params.commentId) != null) {
              if (req.body.rating) {
                promo.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.comment) {
                promo.comments.id(req.params.commentId).comment = req.body.comment;                
              }
              promo.save()
              .then((promo) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(promo);                
              }, (err) => next(err));
          }
          else if (promo == null) {
              err = new Error('Promotion' + req.params.promoId + ' not found');
              err.status = 404;
              return next(err);
          }
          else {
              err = new Error('Comment ' + req.params.commentId + ' not found');
              err.status = 404;
              return next(err);            
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser ,(req,res,next) => {
      Promos.findById(req.params.promoId)
      .then((promo) => {
          if (promo != null && promo.comments.id(req.params.commentId) != null) {
            promo.comments.id(req.params.commentId).remove();
            promo.save()
              .then((promo) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(promo);                
              }, (err) => next(err));
          }
          else if (promo == null) {
              err = new Error('leader ' + req.params.promoId + ' not found');
              err.status = 404;
              return next(err);
          }
          else {
              err = new Error('Comment ' + req.params.commentId + ' not found');
              err.status = 404;
              return next(err);            
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })
module.exports = promoRouter;