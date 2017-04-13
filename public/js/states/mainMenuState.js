/**
 * Created by timothyferrell on 3/8/17.
 * Requires
 *  state.js
 *  input.js
 */


function mainMenuState(elementId, debug=false) {
    let mainMenu = state(elementId, "Main Menu");

    mainMenu.addInput("play");
    mainMenu.addInput("score");
    mainMenu.addInput("controls");
    mainMenu.addInput("credits");

    let mainMenuUpdate = function (time, inputs) {
       return new Promise(function(resolve, reject){
            if(inputs["play"]){
                if(debug){
                    console.log("Main Menu new game event triggered");
                }
                mainMenu.changeState("game");
            }
           if(inputs["score"]){
               if(debug){
                   console.log("Main Menu High score key event triggered");
               }
               mainMenu.changeState("score");
           }
           if(inputs["controls"]){
               if(debug){
                   console.log("Main Menu Credits event triggered");
               }
               mainMenu.changeState("controls");
           }
           if(inputs["credits"]){
               if(debug){
                   console.log("Main Menu Credits event triggered");
               }
               mainMenu.changeState("credits");
           }
            resolve({});
       })
    };

    mainMenu.init(NaN, mainMenuUpdate);

    return mainMenu;
}
