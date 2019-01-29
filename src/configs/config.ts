// list of hardcode ids && pre-config data
// from list.page.ts file
const prefixUrl = 'https://api.practera.com/';
const appKey = '69ad1e66dc';
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
const portfolio_domain = 'assess/assessments/portfolio'; //for handling digital portfolio url
// function of hardcode list data
const HardcodeDataList = () => {
  const peEndpoints = ['pe.practera.com', 'pe.rmit.edu.vn'];
  const xpEndpoints = ['xp.practera'];
  const skillsEndpoints = ['skills.practera', 'passport.practera'];
  const devEndpoints = ['localhost', 'local.practera.com', '127.0.0.1'];
  this.appKey = appKey;

  if (devEndpoints.includes(window.location.hostname)) {
    // function for app to access hardcoded data
    // this is the URL prefix for all api requests
    this.prefixUrl = 'http://local.practera.com:8080/';

    // this is the AppKey from the experience admin screen
    this.appKey = 'PETestAppK';

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

  } else if (peEndpoints.includes(window.location.hostname)) {
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
    this.portfolio_domain = `https://my.practera.com/${portfolio_domain}`;
  } else if (xpEndpoints.includes(window.location.hostname)) {
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
    this.portfolio_domain = `https://my.practera.com/${portfolio_domain}`;
  } else if (skillsEndpoints.includes(window.location.hostname)) {
   // function for app to access hardcoded data
    // this is the URL prefix for all api requests
    this.prefixUrl = 'https://api.practera.com/';

    // this is the AppKey from the experience admin screen
    this.appKey = 'dc733244ac';

    // This is the base URL for the student to access their portfolio 
    this.portfolio_domain = `https://my.practera.com/portfolio`;

    // these are achievement IDs for the achievements earned when skills are submitted and pass review
    // they are used for determining the ordering/visibility of the ticks on the main page and skill detail page
    this.achievementListIDs = [
        [ 3440, 3462, 3438, 3439 ],
        [ 3437, 3464, 3435, 3436 ],
        [ 3449, 3467, 3447, 3448 ],
        [ 3434, 3463, 3432, 3433 ],
        [ 3443, 3465, 3441, 3442 ],
        [ 3446, 3466, 3444, 3445 ],
        [ 3431, 3431, 3431, 3431 ]
    ];

    // this version puts the newbie achievement first so that the "tutorial mode" can show the newbie first.
    this.newbieOrderedIDs = [
        [ 3431, 3431, 3431, 3431 ],
        [ 3440, 3462, 3438, 3439 ],
        [ 3437, 3464, 3435, 3436 ],
        [ 3449, 3467, 3447, 3448 ],
        [ 3434, 3463, 3432, 3433 ],
        [ 3443, 3465, 3441, 3442 ],
        [ 3446, 3466, 3444, 3445 ]
    ];

    // this is the AssessmentId and ContextId of the post-program survey, used as the "application" for a the final transcript
    // the transcript button will not link to the final transcript page until this is done
    this.hardcode_assessment_id = 5807; 
    this.hardcode_context_id = 109; 

    // Activity ID is the activity id of Ethical Leader; if this is present on the screen then
    // we know that all of the skills activities has been revealed.
    this.hardcode_activity_id = 12848; 

    // These are the IDs of the skill submission assessments
    this.hardcodeAssessmentIds = [ 5800, 5801, 5802, 5803, 5804, 5805 ];

    // These are the QuestionIDs for the "title" question for each of the above assessment Ids, in the same order
    this.hardcodeQuestionIDs = [ 50202, 50212, 50222, 50232, 50242, 50252 ];

  }  else { // use live endpoint
      // if not live server, then, go to sandbox hardcode list and pre-config data
      this.prefixUrl = 'https://stage-test.practera.com/';
      this.portfolio_domain = `https://stage-test.practera.com/${portfolio_domain}`;
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
