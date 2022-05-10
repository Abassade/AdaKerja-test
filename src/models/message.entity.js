const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const MessageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: [{
        type: String,
        required: true
    }]
},
{
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
    timestamps: true,
  });

MessageSchema.plugin(mongoosePaginate);
MessageSchema.index({ '$**': 'text' });

const Messages = mongoose.model("Messages", MessageSchema);

module.exports = Messages;
