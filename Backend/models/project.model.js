import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    unique: [true, 'Project name already exists'],
    required: true,
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],

  fileTree: {
    type: Object,
    default: {}
  }

});

const Project = mongoose.model('Project', projectSchema);

export default Project;
