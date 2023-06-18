'use strict';
const Issue = require("../model/issue");
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = {project: req.params.project};
      let {...spreadQuery} = req.query;
      let spreadQueryLength = Object.keys(spreadQuery).length;
      let queryParams = spreadQueryLength > 0 ? Object.assign(project, spreadQuery) : project;
      // console.log(queryParams);
      let finAllProjectIssue = await Issue.find(queryParams).select("-project -__v");
      res.status(200).json(finAllProjectIssue);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      // console.log(project)
      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;

      if(issue_title && issue_text && created_by){
        try{
          let createIssue;
          createIssue = await Issue.create({issue_title, issue_text, created_by,
            assigned_to, status_text, project
          })
          let {_id, created_on, updated_on, open} = createIssue;
          res.status(200).json({assigned_to, status_text, open,
            _id, issue_title, issue_text, created_by, created_on, updated_on 
          });
        }catch(err){
          console.log(err);
          return;
        }
      }else{
         res.status(400).json({ error: 'required field(s) missing' });
         return;
       }
    })
    
    .put(async function (req, res){
        let project =  req.params.project;
        // console.log(findParams)
        let {_id, ...updateParams} = req.body;
        console.log("update params = ", updateParams, "id = ", _id);
        let findParams = {project, _id};
        let updateParamsLength = Object.keys(updateParams).length;
        // console.log(updateParamsLength)
        // console.log(updateParams);
        if(!_id){
          res.status(400).json({error: "missing _id"});
          return;
        }else if(updateParamsLength < 1){
          res.status(400).json({error: 'no update field(s) sent', '_id': _id});
          return;
        }else if(_id && updateParamsLength > 0){
          try{
            let updated = await Issue.findOneAndUpdate(findParams, updateParams, {new:true});
            if(Object.keys(updated).length > 0){
              res.status(200).json({result:"successfully updated", _id: _id});
              return;
            }
          }catch(err){
            res.status(400).json({ error: 'could not update', '_id': _id });
            return;
          }
        }
        res.status(400).json({ error: 'could not update', '_id': _id });
      }
    )
    
    .delete(async function (req, res){
      let project = req.params.project;
      let _id = req.body._id;
      if(_id){
        try{
          let deleteOne = await Issue.deleteOne({_id});
          //let deletedCount = deleteOne.deletedCount;
          //if(deletedCount === 1){
            res.status(200).json({ result: 'successfully deleted', _id: _id });
         // }
          //else if(deleteOne.deletedCount === 0){
          //   res.status(400).json({ error: 'could not delete', _id: _id });
          // }          
          return;
        }catch(err){
          res.status(400).json({ error: 'could not delete', _id: _id });
          return;
        }
      }
      res.status(400).json({ error: 'missing _id' });
    });
    
};
