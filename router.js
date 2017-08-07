const Mate = require('./models/mate');
const MateRequest = require('./models/mateRequest');
const MatesRelationships = require('./models/matesRelationships');

function router(app) {
  app.get('/getMates', (req, res, next) => {
    Mate.find((err, mates) => {
      if (err) { return next(err) }

      res.json({ mates });
    })
  });

  app.post('/addMate', (req, res, next) => {
    const name = req.body.name;
    const hobby = req.body.hobby;

    const mate = new Mate({
      name: name,
      hobby: hobby
    });

    mate.save((err) => {
      if (err) {return next(err)}

      res.json({ mate });
    })
  });

  app.post('/getMate', (req, res, next) => {
    const name = req.body.name;
    Mate.findOne({ name: name }, (err, mate) => {
      if (err) return next(err);

      res.json({ mate });
    })
  });

  app.post('/addMateRequest', (req, res, next) => {
    const requestedBy = req.body.requestedBy;
    const mateRequest = req.body.mateRequest;
    console.log(`Requested by: ${requestedBy}`);
    console.log(`Requested mate: ${mateRequest}`);

    const request = new MateRequest({
      mateID: mateRequest,
      requests: requestedBy
    })

    // In DB, values should be stored invertedly.
    // { mateID: mateRequest // The ID of the mate being requested to. ,
    //   requests: [requestedBy] // It is an array of ID of mates who sent the request. }
    MateRequest.findOne({ mateID: mateRequest }, (err, mateResponse) => {
      if (err) return next(err);

      if (!err && !mateResponse) {
        request.save(err => {
          if (err) return next(err);

          res.json({ req: request });
        });
      } else {
        // Handle case wherein there are other requests in DB and add the request to the existing one.
        const updatedRequest = mateResponse;
        updatedRequest.requests.push(requestedBy);
        
        MateRequest.update({ mateID: mateRequest }, updatedRequest, (err, update) => {
          res.json({ req: updatedRequest });
        })
      }
    })
  })

  app.post('/getMateRequests', (req, res, next) => {
    const id = req.body.id;

    MateRequest.findOne({ mateID: id }, (err, mateRequest) => {
      if (err) return next(err);

      let mateRequests = [];
      if (mateRequest && mateRequest.requests.length > 0) {
        mateRequests = [ ...mateRequest.requests ];
      }

      res.json({ mateRequests });
    })
  })

  app.post('/approveMate', (req, res, next) => {
    const requestedBy = req.body.requestedBy;
    const approvedID = req.body.approvedID;
    console.log('Requested by: ', requestedBy);
    console.log('Approved ID: ', approvedID);

    MateRequest.findOne({ mateID: requestedBy }, (err, mateRequest) => {
      if (err) return next(err);

      if (mateRequest.requests.length > 0) {
        const index = mateRequest.requests.findIndex(r => r === approvedID);

        if (index > -1) {
          const requests = [ ...mateRequest.requests.slice(0, index), ...mateRequest.requests.slice(index + 1) ];
          const updatedMateRequest = mateRequest;
          updatedMateRequest.requests = requests;

          console.log(updatedMateRequest);
          MateRequest.update({ mateID: requestedBy }, updatedMateRequest, (err, raw) => {
            
            MatesRelationships.findOne({ mateID: requestedBy }, (err, relationship) => {
              if (err) return next(err);
              console.log('Found mates relationship: ', relationship);
              if (relationship) {
                const mates = [ ...relationship.mates, approvedID ];
                const updatedRelationship = relationship;
                updatedRelationship.mates = mates;
                console.log('Updated relationship: ', updatedRelationship);
                MatesRelationships.update({ mateID: requestedBy }, updatedRelationship, (err, raw) => {
                  res.json({ myMates: updatedRelationship });
                })
              } else {
                // Handle the case where this matey does NOT have a relationship/matey/mates/friends in record yet.
                const matesRelationships = new MatesRelationships({
                  mateID: requestedBy,
                  mates: [ approvedID ]
                });
                console.log('New mate relationship created: ', matesRelationships);
                matesRelationships.save(err => {
                  if (err) return next(err);

                  res.json({ myMates: matesRelationships });
                })
              }
            })
            
          })
        }
      }
    })
  })
}

module.exports = router;