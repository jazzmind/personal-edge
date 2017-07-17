import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CacheService } from '../../../shared/cache/cache.service';
import { ChoiceBase, QuestionBase, Submission, AssessmentService } from '../../../services/assessment.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './assessments-group.html',
})
export class AssessmentsGroupPage {
  questions = [];
  formGroup;
  temp;

  //@TODO: decide which one to use
  assessment: any;
  activity: any;
  submission: Submission;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private cache: CacheService,
    private assessmentService: AssessmentService
  ) {
  }

  ionViewDidEnter() {
    this.activity = this.navParams.get('activity') || {};
    this.assessment = this.navParams.get('assessment') || {};

    this.questions = this.normaliseQuestions(this.assessment.AssessmentQuestion);
    this.formGroup = this.retrieveProgress(this.buildFormGroup(this.questions));
  }

  /**
   * turn a collection of questions into angular's FormGroup to share among components
   * @param {array} questions list of questions from a question group (Assessment group)
   */
  buildFormGroup = (questions) => {
    let result: any = {};

    this.questions.forEach(question => {
      let group = {
        answer: question.required ? new FormControl(question.answer || '', Validators.required) : new FormControl(question.answer || ''),
        comment: question.required ? new FormControl(question.comment || '', Validators.required) : new FormControl(question.comment || '')
      };

      // render choices' FormGroup
      let choices = {};
      if (question.choices && question.type === 'multiple') {
        question.choices.forEach(choice => {
          let answer = (question.choices) ? question.choices[choice.id] : false;
          choices[choice.id] = new FormControl(answer);
        });
        group['choices'] = new FormGroup(choices);
      }

      result[question.id] = new FormGroup(group);

    });

    return result;
  };

  /**
   * @TODO: confirm with backend how checkbox value submission is handled
   * @description format checkbox value before post back to server
   */
  getCheckboxValues(choices) {
    let result = {};
    // choices
    return result;
  }

  /**
   * @description store assessment answer/progress locally
   */
  storeProgress = () => {
    let answers = {};
    _.forEach(this.formGroup, (question, id) => {
      let values = question.getRawValue(),
          answer = {
            assessment_question_id: id,
            answer: values.answer || values.comment,

            // store it if choice answer is available or skip
            choices: (!_.isEmpty(values.choices)) ? values.choices : null
          };


      answers[id] = answer;
    });

    // final step - save to localstorage
    let assessmentId = this.assessment.Assessment.id;
    let submission = {
      Assessment: {
          id: assessmentId,
          activity_id: this.activity.id || 'temporary_fake_activity_id'
      },
      AssessmentSubmissionAnswer: answers
    };
    this.submission = submission;
    console.log(this.submission);
    this.cache.setLocal(`assessment.group.${assessmentId}`, JSON.stringify(submission));
    return submission;
  };

  /**
   * @description retrieve saved progress from localStorage
   */
  retrieveProgress = (questions: Array<any>) => {
    let cachedProgress = this.cache.getLocalObject(`assessment.group.${this.assessment.Assessment.id}`);

    let newQuestions = questions;
    let savedProgress = cachedProgress.AssessmentSubmissionAnswer;

    if (!_.isEmpty(savedProgress)) {

      // index "id" is set as question.id in @Function buildFormGroup above
      _.forEach(newQuestions, (question, id) => {
        // check integrity of saved answer (question might get updated)
        if (savedProgress[id] && savedProgress[id].assessment_question_id == id) {
          newQuestions[id] = this.setValueWith(question, savedProgress[id]);
        }
      });
    }
    return newQuestions;
  };

  /**
   * @description set value to each FormControl differently based on type:
   *              - "text", "oneof" & "file" using just "answer" field
   *              - "multiple" answer is stored into "choices" FormControl instead
   * @param {FormGroup} question FormGroup for a question
   * @param {Object} answers answer [choices object || string answer]
   */
  private setValueWith(question, answers) {
    if (!_.isEmpty(answers.choices)) {
      question.controls.choices.setValue(answers.choices);
    } else {
      question.controls.answer.setValue(answers.answer || '');
    }
    return question;
  }


  /*
    Turn AssessmentQuestion object from:
    {
      Assessment: {
        id: 123
      },
      AssessmentQuestion: [
        {
          id: 234,
          question_type: 'file',
          audience: "[\"reviewer\",\"submitter\"]",
          file_type: 'image',
          choices: [],
          answers: {
            submitter: [],
            reviewer: [],
          },
          name: 'Question 234',
          required: true
        }
        ...
      ]
    }

    to:
    [
      {
        id: 234,
        assessment_id: 123
        name: 'Question 234',
        type: 'file',
        audience: "[\"reviewer\",\"submitter\"]",
        file_type: 'image',
        choices: []
      },
      ...
    ]
   */
  private normaliseQuestions = (questions) => {
    let result = [];

    questions.forEach((question) => {
      let choices = question.AssessmentQuestionChoice || [];
      if (choices.length > 0) {
        choices = this.normaliseChoices(choices);
      }

      let normalised: QuestionBase<any> = {
        id: question.id,
        assessment_id: question.assessment_id,
        name: question.name,
        type: question.question_type,
        audience: question.audience,
        file_type: question.file_type,
        choices: choices
      };

      result.push(normalised);
    });

    return result;
  };

  /* turn raw API respond format from:
    {
      "id": 123,
      "assessment_question_id": 124,
      "assessment_choice_id": 123,
      "order": 1,
      "weight": "1",
      "explanation": null,
      "AssessmentChoice": {
          "id": 123,
          "name": "Testing name",
          "description": "Testing description"
      }
    }

    to Choices type format:
    {
      "id": 123,
      "value": 123, // or choice id
      "name": "Testing name",
      "description": "Testing description",
      "explanation": null,
      "order": 1,
      "weight": "1"
    }
   */
  private normaliseChoices = (assessmentQuestionChoice) => {
    let results: ChoiceBase<any>[] = [];
    assessmentQuestionChoice.forEach(choice => {
      let assessmentChoice = choice.AssessmentChoice;
      results.push({
        id: choice.id,
        value: choice.assessment_choice_id, // or choice id
        name: assessmentChoice.name,
        description: assessmentChoice.description,
        explanation: choice.explanation,
        order: choice.order,
        weight: choice.weight
      });
    });

    return results;
  };

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    this.assessmentService.save(this.storeProgress());
    this.navCtrl.pop();
    // this.assessmentService.post();
  }
}
