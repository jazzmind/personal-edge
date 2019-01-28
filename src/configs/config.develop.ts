// function for app to access hardcoded data
const HardcodeDataList = () => {
    // this is the URL prefix for all api requests
  this.prefixUrl = 'http://local.practera.com:8080/';

  // this is the AppKey from the experience admin screen
  this.appKey = 'b11e7c189b';

  // This is the base URL for the student to access their portfolio 
  this.portfolio_domain = `http://local.practera.com:8080/portfolio`;

  // these are achievement IDs for the achievements earned when skills are submitted and pass review
  // they are used for determining the ordering/visibility of the ticks on the main page and skill detail page
  this.achievementListIDs = [
      [ 117, 139, 115, 116 ],
      [ 114, 141, 112, 113 ],
      [ 126, 144, 124, 125 ],
      [ 111, 140, 109, 110 ],
      [ 120, 142, 118, 119 ],
      [ 123, 143, 121, 122 ],
      [ 108, 108, 108, 108 ]
  ];

  // this version puts the newbie achievement first so that the "tutorial mode" can show the newbie first.
  this.newbieOrderedIDs = [
      [ 108, 108, 108, 108 ],
      [ 117, 139, 115, 116 ],
      [ 114, 141, 112, 113 ],
      [ 126, 144, 124, 125 ],
      [ 111, 140, 109, 110 ],
      [ 120, 142, 118, 119 ],
      [ 123, 143, 121, 122 ]
  ];

  // this is the AssessmentId and ContextId of the post-program survey, used as the "application" for a the final transcript
  // the transcript button will not link to the final transcript page until this is done
  this.hardcode_assessment_id = 138; 
  this.hardcode_context_id = 109; 

  // Activity ID is the activity id of Ethical Leader; if this is present on the screen then
  // we know that all of the skills activities has been revealed.
  this.hardcode_activity_id = 156; 

  // These are the IDs of the skill submission assessments
  this.hardcodeAssessmentIds = [ 134, 135, 131, 132, 133, 136 ];

  // These are the QuestionIDs for the "title" question for each of the above assessment Ids, in the same order
  this.hardcodeQuestionIDs = [ 1813, 1823, 1783, 1793, 1803, 1833 ];

  return {
    filestack: {
      apiKey: 'AO6F4C72uTPGRywaEijdLz'
    },
    prefixUrl: this.prefixUrl,
    appKey: this.appKey,
    achievementListIDs: this.achievementListIDs,
    newbieOrderedIDs: this.newbieOrderedIDs,
    hardcode_assessment_id: this.hardcode_assessment_id,
    hardcode_context_id: this.hardcode_context_id,
    hardcode_activity_id: this.hardcode_activity_id,
    hardcodeAssessmentIds: this.hardcodeAssessmentIds,
    hardcodeQuestionIDs: this.hardcodeQuestionIDs,
    portfolio_domain: this.portfolio_domain
  }
}
export default HardcodeDataList();