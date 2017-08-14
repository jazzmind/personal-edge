import { Component, NgZone, OnInit, Renderer2, ElementRef } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { CacheService } from '../../shared/cache/cache.service';


import * as Winwheel from 'Winwheel';
// import {TweenLite, Power2, TimelineMax, TweenMax} from "gsap";
import {TweenLite, TweenMax, Power2, Power4, TimelineLite} from "gsap";

// font size and test colour overridden on backrupt segments.
// hardcoded prize list
const POINTS = [
   {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
   {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
   {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
   {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400},
   {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
   {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
   {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
   {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400},
   {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
   {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
   {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
   {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400}
];

@Component({
  templateUrl: './spinwheel.html',
  styleUrls: ['./spinwheel.scss']
})
export class SpinwheelPage implements OnInit {
  config = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 150,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 50,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 24,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'numSegments'     : 12,         // Specify number of segments.
    'segments'        : POINTS,     // Define segments including colour and text.
    'animation' :           // Specify the animation to use.
    {
      'type'     : 'spinToStop',
      'duration' : 10,     // Duration in seconds.
      'spins'    : 3,     // Default number of complete spins.
      'callbackFinished' : this.alertPrize
    }
  };
  public wheel: any;
  canvasWidth: number = 300;
  canvasHeight: number = 500;
  statuses = {
    chances: 0,
    spinning: false,
    power: 0,
    value: 0,
    spinOn: false,
    displayPureCSS: false,
    isCompleted: false,
    isStarted: false,
  };

  constructor(
    public loadingCtrl: LoadingController,
    private gameService: GameService,
    private zone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef,
    private cache: CacheService,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    // preset values
    this.statuses.chances = 10;
    this.statuses.value = 0;
    this.statuses.spinOn = true;

  }

  ionViewWillEnter() {
    let ionContentElement = this.renderer.selectRootElement('ion-content');

    let width = ionContentElement.clientWidth;
    this.canvasWidth = width * 0.9;

    // radius X 2 < max-width of ion-content
    let radius = this.canvasWidth / 2;

    // make canvas rectangle dynamically, so it do not crop spinwheel
    this.canvasHeight = width;
    this.config.outerRadius = radius * 0.8;
    this.config.innerRadius = radius * 0.2;
  }

  // api calls
  game: any = {};
  character: any = {};
  item: any = {};
  calls (types) {

    let gameId = null;
    let characterId = null;
    let itemId = null;

    switch (types) {
      case "game":
        this.gameService.getGames().subscribe(res => {
          console.log(res);
          this.game = res.Games[0];
          /*
            {
              "Games": [
                {
                  "id": 1,
                  "name": "PE-TEST Project",
                  "created": "2017-08-04 08:00:08.865691",
                  "modified": "2017-08-04 08:00:08.865691"
                }
              ]
            }
           */
        });
        break;

      case "character":
        if (this.game.id === null) {
          console.log('load game API first!');
        } else {
          this.gameService.getCharacters(this.game.id).subscribe(res => {
            console.log(res);
            this.character = res.Characters[0];
          });
        }
        break;

      case "item":
        if (this.character.id === null) {
          console.log('load character API first!');
        } else {
          this.gameService.getItems({
            character_id: this.character.id,
            action: 'list'
          }).subscribe(res => {
            this.item = res.Items[0];
            console.log(res);
          });
        }
        break;
      default:
          console.log('nothing loaded');
        break;
    }
  }

  private getItems() {

    // get current user's character ID
    // call getItems API

  }

  alertPrize() {
    this.statuses.value += 100;
    console.log('hmmmm...... hahahahahahahah');
  }

  retrieve() {
    if (this.cache.getLocal('character_id')) {
      this.gameService.getItems({
        character_id: this.character.id
      }).subscribe(res => {
        console.log(res);
      });
    } else {
      this.gameService.getGames({
        character_id: this.game.id
      }).subscribe(res => {
        console.log(res);
        // this.gameService.getCharacters()
      }, err => {
        console.log(err);
      })
    }
  }

  /**
   * @description ensure WinWheel library code run under the watch of angular
   * @param {Function} cb callback function run under ngZone's watch
   */
  private runInZone(cb) {
    this.zone.run(() => {
      cb();
    });
  }

  /**
   * @name draw
   * @description draw SpinWheel in the canvas based on given config
   */
  draw() {
    this.retrieve();
    this.runInZone(() => {
      this.wheel = new Winwheel(this.config);
      this.wheel.draw();
      console.log(this.wheel);
    });
  }

  // pause
  pause() {
    this.runInZone(() => {
      this.wheel.pause();
    });
  }

  // resume
  play() {
    this.runInZone(() => {
      this.wheel.tween.play();
    });
  }

  // reset
  /**
   * reset: required before 2nd spin
   */
  reset() {
    this.runInZone(() => {
      this.wheel.kill();
      this.wheel.stopAnimation(true);  // Stop the animation, false as param so does not call callback function.
      // this.wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
      this.wheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
      this.wheel.draw();                // Call draw to render changes to the wheel.
    });
  }

  clear() {
    this.wheel.clearCanvas();
    this.wheel.canvas.kill();
    this.wheel.tween.kill();
  }

  spin() {
    this.runInZone(() => {
      let segmentNumber = 70/100;

      // Get random angle inside specified segment of the wheel.
      let stopAt = this.wheel.getRandomForSegment(segmentNumber);

      // Important thing is to set the stopAngle of the animation before stating the spin.
      this.wheel.animation.stopAngle = stopAt;
      this.startAnimation();
      // this.wheel.startAnimation();
    });
  }

  stop() {
  }

  powerSelected() {
    // Ensure that power can't be changed while wheel is spinning.
    if (this.statuses.spinning == false) {
      this.statuses.spinOn = true;
    } else {
      this.statuses.spinOn = false;
    }
  }


  // pure CSS drawing
  createSlice() {
    let result = `
      <div>
        <h2>Daylights<i class="fa fa-lightbulb-o"></i></h2>
      </div>
    `;
  }

  // draw pure CSS spinwheel
  drawPureCSS() {
    this.statuses.displayPureCSS = true;

    var duration = Math.floor(Math.random() * 4) + 1;
    var degrees = 360 * (Math.random() * 10);

    // $('#outcome-icon').removeClass('fa-hand-' + selectedOutcome.toLowerCase()  + '-o');
    // $('#outcome-name').text('');
    let el = this.renderer.selectRootElement('.wheelContainer .gameWheel');
    let slices = [
      {id: 'rock', class: 'slide1', text: 'RockS'},
      {id: 'paper', class: 'slide2', text: 'PaperS'},
      {id: 'scissors', class: 'slide3', text: 'ScissorsS'},
      {id: 'lizard', class: 'slide4', text: 'LizardS'}
    ];

    slices.forEach((slice) => {
      let newSlice = this.renderer.createElement('div');
      this.renderer.addClass(newSlice, 'slice');
      this.renderer.addClass(newSlice, slice.class);
      this.renderer.setProperty(newSlice, 'id', slice.id);

      let newSliceChild = this.renderer.createElement('h2');
      this.renderer.setValue(newSliceChild, slice.text);
      let test2 = this.renderer.appendChild(newSlice, newSliceChild);

      let test = this.renderer.appendChild(el, newSlice);
      console.log(newSlice, test);
    });

    /*TweenMax.to('.gameWheel', duration,  {rotation: degrees}).eventCallback("onComplete", function(){
      for (var i = 0; i < slices.length; i++) {
        var $slice = $(slices[i]);
        var topPosition = $slice.position().top;

        if (topPosition < 0.3) {
          break;
        }

        if (topPosition < 5) {
          $slice.addClass('selected');
          break;
        }
      }
    });*/
  }



  onUpdate() {
    console.log('spinning...');
  }

  finalisingSpinner() {
    // let segment = this.wheel.segments;
    let prize = this.wheel.getIndicatedSegment();
    this.statuses.value += prize.value;
  }


  /**
   * @name startAnimation
   * @description
   *   similar startAnimation replace WinWheel library's animation trigger
   *   this will also use current context of TweenLite to run gsap animation
   */
  startAnimation() {
    // gsap callback: triggered when spin started
    let onStart= () => {
      console.log('im started!');
      this.statuses.isStarted = true;
      this.statuses.isCompleted = false;

      let test = this.wheel;
      console.log(test);
    };

    // gsap callback: triggered after spin is complete
    let onComplete = () => {
      console.log('onCompleteha! gotcha!');
      this.statuses.isStarted = false;
      this.statuses.isCompleted = true;
      this.statuses.chances -= 1;

      let test = this.wheel;
      console.log(test);
      this.finalisingSpinner();
    };

    // check animation is allowed/activated
    if (this.wheel.animation && this.statuses.chances > 0) {
        // Call function to compute the animation properties.
        this.wheel.computeAnimation();

        let animation = this.wheel.animation,
        properties: any = {
          yoyo: animation.yoyo,
          repeat: animation.repeat,
          ease: animation.easing,
          onStart: onStart,
          onUpdate: this.onUpdate,
          onComplete: onComplete
        };
        properties[`${animation.propertyName}`] = animation.propertyValue;
        properties['rotation'] = animation.propertyValue;

        // use back same wheel object
        if (this.wheel.tween) {
          this.restart();
        } else {
          this.wheel.tween = TweenLite.to(this.wheel.canvas, animation.duration, properties);
        }
        let test = this.wheel;
        console.log(test);
    }
  }

  restart() {
    if (this.wheel.tween) {
      this.wheel.tween.restart();
    } else {
      throw 'Tween doesnt exist!';
    }
  }

  manualSpin() {
    let tweenmaxTest = this.renderer.selectRootElement('.tweenmax-test');
    let tm = TweenLite.to(tweenmaxTest, 0.5, {
      rotation: 360 * 10
    });

  }
}