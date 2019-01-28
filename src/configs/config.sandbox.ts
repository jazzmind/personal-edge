// function for app to access hardcoded data
const HardcodeDataList = () => {
  this.prefixUrl = 'https://stage-test.practera.com/';
  this.portfolio_domain = `https://stage-test.practera.com/portfolio`;
  // this.prefixUrl = 'https://sandbox.practera.com/';
  // this.portfolio_domain = `https://sandbox.practera.com/${portfolio_domain}`;
  this.achievementListIDs = [
    [349, 350, 347, 348],
    [345, 346, 343, 344],
    [361, 362, 359, 360],
    [341, 342, 339, 340],
    [353, 354, 351, 352],
    [357, 358, 355, 356],
    [326, 326, 326, 326]
  ];
  this.newbieOrderedIDs = [
    [326, 326, 326, 326],
    [349, 350, 347, 348],
    [345, 346, 343, 344],
    [361, 362, 359, 360],
    [341, 342, 339, 340],
    [353, 354, 351, 352],
    [357, 358, 355, 356]
  ];
  this.hardcode_assessment_id = 2064;
  this.hardcode_context_id = 2487;
  this.hardcode_activity_id = 7655;
  this.hardcodeAssessmentIds = [2066, 2067, 2068, 2069, 2070, 2071, 2050];
  this.hardcodeQuestionIDs = [20775, 20785, 20795, 20805, 20815, 20825, 20661];

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