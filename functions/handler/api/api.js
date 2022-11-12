

exports.test = async (req, res) => {
    const courses = [
        { id: 1, name: 'computer science'},
        { id: 2, name: 'information technology'},
        { id: 3, name: 'business intelligence'},
    ];
    res.send(courses);
  }