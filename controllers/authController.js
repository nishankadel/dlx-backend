exports.login = (req, res) => {
  try {
    res.send("login");
  } catch (error) {
    res.json({
      message: error.message,
    });
    console.log(error);
  }
};

exports.register = (req, res) => {
  try {
    res.send("register");
  } catch (error) {
    res.json({
      message: error.message,
    });
    console.log(error);
  }
};
