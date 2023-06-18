const mongoose = require("mongoose");
const { Schema } = mongoose;

const issueSchema = new Schema({
    assigned_to: String,
    status_text: String,
    open: {type:Boolean, default: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    project: String
}, {
    timestamps: {
        createdAt: 'created_on', // Use `created_on` to store the created date
        updatedAt: 'updated_on' // and `updated_on` to store the last updated date
      }
})

module.exports = mongoose.model("Issue", issueSchema);