// list of hardcode ids && pre-config data
// from list.page.ts file
const prefixUrl = 'https://api.practera.com/';
const appKey = '1ec748c932';
const achievementListIDs = [ // for handling activities ticks data display order
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364],
  [341, 341, 341, 341]
];
const newbieOrderedIDs = [ // for handling initialized newbie assessment data display
  [341, 341, 341, 341],
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364]
];
const hardcode_assessment_id = 2134; // Reference Model - Assessment: Assessment ID:
const hardcode_context_id = 2532; // Reference Model - Assessment Context ID
// from activities-view.page.ts file
const hardcode_activity_id = 7850; // <Activity ID> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
const hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050]; // for handling submitted assessments title display
const hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661]; // for handling submitted assessments title display
const portfolio_path = 'portfolio'; //for handling digital portfolio url
// function of hardcode list data
const HardcodeDataList = () => {
  const liveEndpoints = ['xp.practera.app'];
  this.appKey = appKey;

  // if not live server, then, go to sandbox hardcode list and pre-config data
  if (!liveEndpoints.includes(window.location.hostname)) {
    this.prefixUrl = 'http://127.0.0.1:8080/';
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
    this.portfolio_domain = `http://127.0.0.1:8080/${portfolio_path}`;
  } else { // use live endpoint
    this.prefixUrl = 'https://us.practera.com/';
    this.achievementListIDs = [
      [571, 553, 551, 554],
      [552, 572, 565, 566],
      [564, 576, 557, 560],
      [550, 570, 556, 563],
      [559, 586, 585, 562],
      [561, 573, 555, 584],
      [567, 567, 567, 567]
    ];
    this.newbieOrderedIDs = [
      [567, 567, 567, 567],
      [571, 553, 551, 554],
      [552, 572, 565, 566],
      [564, 576, 557, 560],
      [550, 570, 556, 563],
      [559, 586, 585, 562],
      [561, 573, 555, 584],
    ];
    this.hardcode_assessment_id = 2638;
    this.hardcode_context_id = 3304;
    this.hardcode_activity_id = 8305;
    this.hardcodeAssessmentIds = [2632, 2633, 2634, 2635, 2636, 2637, 2050];
    this.hardcodeQuestionIDs = [24673, 24683, 24693, 24703, 24713, 24723, 24703];
    this.portfolio_domain = `https://us.practera.com/${portfolio_path}`;
  }
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
