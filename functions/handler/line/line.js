var { handleEvent } = require('./handleEvent');

exports.eventAction = (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
};



