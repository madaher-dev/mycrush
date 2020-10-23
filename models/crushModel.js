const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const crushSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You should provide a name for your crush!'],
      maxlength: [40, 'A Crush name must be less than 40 characters!'],
      minlength: [5, 'A Crush name must have more than 5 characters!']
    },
    phone: Number,
    facebook: {
      type: String,
      lowercase: true
    },
    twitter: {
      type: String,
      lowercase: true
    },
    instagram: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true
    },

    note: {
      type: String,
      trim: true //remove white space in beg and end
    },

    createdAt: {
      type: Date,
      default: Date.now()
      // select: false //does not return field in select query
    },
    slug: String,
    secretCrush: {
      type: Boolean,
      default: false
    },
    notify: {
      type: Boolean,
      default: true
    },

    sourceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    targetId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    contactCardId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Card'
    },
    targetPic: String
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Document Middleware runs before .save() and .create() commands but not on .insertMany()
crushSchema.pre('save', function(next) {
  //pre save hook
  this.slug = slugify(this.name, { lower: true });
  next();
});

crushSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sourceId',
    select: '-__v -passwordChangedAt'
  });

  next();
});

crushSchema.index({ sourceId: 1, targetId: 1 });
crushSchema.index({ email: 1 });
crushSchema.index({ facebook: 1 });
crushSchema.index({ instagram: 1 });
crushSchema.index({ twitter: 1 });
crushSchema.index({ name: 1 });

// crushSchema.post('save', function(doc, next) {
//   //access to finished document
//   console.log(doc);
//   next();
// });
// Query middlewre used to remove secret crushes and add start time
crushSchema.pre(/^find/, function(next) {
  //crushSchema.pre('find', function(next) {
  //runs before find queries
  this.find({ secretCrush: { $ne: true } });
  this.start = Date.now();
  next();
});

// // Query middlewre used to log time of query
// crushSchema.post(/^find/, function(docs, next) {
//   const time = Date.now() - this.start;
//   console.log(`The query took ${time} milliseconds!`);
//   next();
// });

const Crush = mongoose.model('Crush', crushSchema);
const Archive = mongoose.model('Archive', crushSchema);

// module.exports = Crush;

module.exports = {
  Crush: Crush,
  Archive: Archive
};
