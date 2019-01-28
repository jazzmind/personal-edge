// function for app to access hardcoded data
const HardcodeDataList = () => {
    this.prefixUrl = 'https://api.practera.com/';
    this.achievementListIDs = [
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364],
      [341, 341, 341, 341]
    ];
    this.newbieOrderedIDs = [
      [341, 341, 341, 341],
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364]
    ];
    this.hardcode_assessment_id = 2134;
    this.hardcode_context_id = 2532;
    this.hardcode_activity_id = 7850;
    this.hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050];
    this.hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661];
    this.portfolio_domain = `https://my.practera.com/portfolio`;
  
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