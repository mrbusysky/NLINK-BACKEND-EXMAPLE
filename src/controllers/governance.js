const GovernorRequest = require("../models/GovernorRequest");
const User = require("../models/User");

const generateNonce = require("../utils/generateNonce");
const {
  UserType,
  PaymentStatus,
  MemoType,
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
} = require("../constants");

const applyForGovernor = async (req, res) => {
  try {
    user = req.user;

    if (user.type === UserType.GOVERNER) {
      return res.status(400).json({
        errors: [
          {
            msg: "oops, you are already a governor. Why applying again??",
            param: "none",
            location: "none",
          },
        ],
      });
    }

    var governorRequest = await GovernorRequest.findOne({
      accountNumber: user.accountNumber,
    });

    if (!governorRequest) {
      var governorRequest = await GovernorRequest.create({
        accountNumber: user.accountNumber,
      });
    }

    paymentInfo = {
      accountNumber: TREASURY_ACCOUNT_NUMBER,
      metadata: `${MemoType.GOVERNER_REQUEST}_${user._id}`,
      amount: GOVERNOR_REQUEST_FEE,
    };

    governorRequest = governorRequest.toObject();
    governorRequest.paymentInfo = paymentInfo;

    return res.json(governorRequest);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = { applyForGovernor };
